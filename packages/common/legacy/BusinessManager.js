import { ID } from '@common/legacy/ID';
import { ElementManager } from './ElementManager';
import { ColorManager_v2 } from '@common/legacy/ColorManager';
import { Observer } from '@common/legacy/Observer';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';
import $ from '@library/jquery';

/**
 * aries.manager.business
 *
 *  1. business 리스트를 관리합니다.
 *  2. business 도 domain ,instance 와 같이 id 를 가집니다.
 *  3. 형태는 /domain@business 로 됩니다.
 *  4. /domain@0 은 도메인을 표시하고 0 이상은 비지니스를 표시합니다.
 *  5. 비지니스는 특수 데이타이기 때문에 전체 데이타를 관리하지 않고 필요한 도메인에 대한 데이타만 관리합니다.
 *  6. business 선택된 상태를 관리합니다.
 *
 *
 * * aries.manager.business 를 BusinessManager 로 변경함.
 */

export class BusinessManager {
    ///////////////////////////////////////////////////////
    /////
    ///// Public Functions
    /////
    //////////////////////////////////////////////////////

    static load(sids, done) {
        sids = sids || [];
        var that = this;

        $.ajax({
            url: '/biz/group/treeList/tree',
            data: {
                sids: sids,
                format: 'json',
            },
            success: function(data) {
                that.init(data);
                if (typeof done == 'function') done();
            },
        });
    }

    static loadCheckedOids(sids, done) {
        sids = sids || [];
        var that = this;

        if (sids.length === 0) {
            return;
        }

        $.getJSON(
            '/manager/realtime/business/list',
            'sids=' + sids + '&format=json',
            function(dataList) {
                var keys = Object.keys(dataList);
                for (var i = 0, len = keys.length; i < len; i++) {
                    var key = keys[i];
                    var value = dataList[key];

                    // 만약에 아예 객체가 없는 경우는 최초 설정이 되지 않은 것이기 때문에 그대로 둔다.
                    if (!value) continue;

                    that.unselectOids(+key); // sid 에 해당하는 모든 요소의 selected 를 지우고
                    that.selectOids(+key, value); // 다시 설정한다.
                }

                if (typeof done == 'function') done();
            }
        );
    }

    // 선택된 개수를 maxCount 로 조정
    static initSelect(maxCount) {
        var selectedBusinessList = _cache.selectedBusinessList;
        if (maxCount >= selectedBusinessList.length) return;

        var dist = selectedBusinessList.length - maxCount;
        while (dist) {
            _objectList[
                selectedBusinessList[maxCount + dist - 1]
            ].selected = false;
            dist--;
        }
        generateCache();
    }

    // domainbar 초기화 , 옵션 설정, 타입 설정,
    static init(data) {
        _dataInit(data, false);

        generateCache();
    }

    static generateCache() {
        generateCache();
    }

    static getValueByColor(colorCode) {
        return this.getValue(_colorCodeManager[colorCode + '']);
    }

    // 생성된 캐쉬를 리턴한다.
    static getCache() {
        return _cache;
    }

    // 가지고 있는 전체 (domain, instance 정보)를 리턴한다.
    static getData() {
        return _data;
    }

    static list() {
        return this.getData();
    }

    static id(sid, oid) {
        return this.business(sid, oid);
    }

    static domain(sid) {
        return ID.domain(sid);
    }

    static business(sid, oid) {
        if (ID.hasStringId(oid)) {
            return oid;
        }

        if (oid == 0 || oid == undefined) {
            return ID.domain(sid);
        }

        return ID.business(sid, oid);
    }

    static getDepth(sid, oid) {
        var obj = this.getValue(this.id(sid, oid));

        if (obj) {
            return obj.depth;
        }

        return 0;
    }

    // all data
    // id 가 있으면 특정 아이디에 대한 것만 리턴,
    // 아니면 전체 리스트 리턴
    static getValue(id) {
        if (_objectList[id]) return _objectList[id];

        // 전체 리스트 볼일이 없으므로 null 을 리턴한다.
        return null;
    }

    // 선택된 애를 토글 시켜보자.
    static toggle(id, notGenerateCache) {
        toggle(id, notGenerateCache);
    }

    // 아이디 기반으로 unselect 를 결정한다.
    // this.unselect()  // 모든 것을 선택 이전 상태로
    // this.unselect(id, id, id) // 정해진 id 만 selected 를 false 로 설정
    // 그런 이후에 generateCache() 로 캐쉬 재생성
    static unselect() {
        var len = arguments.length;

        if (len == 0) {
            each(_data, function(i, element) {
                if (element.selected) {
                    element.selected = false;
                }
            });
        } else {
            each(arguments, function(i, id) {
                _objectList[id].selected = !!_objectList[id].selected;
            });
        }

        generateCache();
    }

    static refreshBusinessSelect() {
        // 캐쉬에 있는 리스트 지우기
        each(_cache.selectedBusinessList, function(i, id) {
            _objectList[id].selected = false;
        });

        generateCache();
    }

    // 선택된 상태를 변경시켜보자.
    static select(id) {
        select(id);
    }

    static unselectOids(sid, oids) {
        var that = this;
        if (oids) {
            each(oids, function(i, oid) {
                var obj = _objectList[that.id(sid, oid)];

                if (obj) {
                    obj.selected = false;
                }
            });
        } else {
            // oids 가 없으면 sid 에 해당하는 business 전체를 selected = false 로 지정
            each(_data, function(i, d) {
                if (sid == d.sid) {
                    d.selected = false;
                }
            });
        }

        generateCache();
    }

    /**
     * 특정 비지니스 아이디를 선택할 때 사용한다.
     *
     * @param sid
     * @param oids
     */
    static selectOids(sid, oids) {
        var that = this;
        if (oids) {
            each(oids, function(i, oid) {
                var obj = _objectList[that.id(sid, oid)];

                if (obj) {
                    obj.selected = true;
                }
            });
        } else {
            // oids 가 없으면 sid 에 해당하는 business 전체를 selected = false 로 지정
            each(_data, function(i, d) {
                if (sid == d.sid) {
                    d.selected = true;
                }
            });
        }

        generateCache();
    }

    static selectIds(selectedIds) {
        Object.keys(_objectList).forEach(id => {
            _objectList[id].selected = !!selectedIds.includes(id);
        });

        const bizIdArray = selectedIds.map(id => _objectList[id].bizId);
        // 순수하게 선택되어져 있는 것만 처리
        var sid = ElementManager.getSelectedDomainSidList()[0];

        $.post(
            '/manager/realtime/business/save',
            'sid=' + sid + '&oids=' + bizIdArray.join(',') + '&format=json',
            function() {
                // 이건 그대로 실행
            }
        );

        generateCache();

        //generateCache 안에 있던 내용을 이쪽으로 변경.
        let selectedBusinessOidsBySid = {};
        const sids = ElementManager.getSelectedDomainSidList();
        if (sids.length > 0)
            selectedBusinessOidsBySid = Object.assign(
                ...sids.map(sid => ({
                    [sid]: BusinessManager.businessKeys(sid, true),
                }))
            );

        Observer.emit(
            ChartKeywordInObserver.CHANGE_SELECT_BUSINESS_ON_ELEMENT,
            [selectedBusinessOidsBySid]
        );
    }

    // 선택되어있는지 알아보자.
    static isSelected(id) {
        return !!_objectList[id].selected;
    }

    // selected 된 instance 가 있는지 , 실제로 클릭한 상태의 instance 가 있는지
    static hasSelectedBusiness() {
        return _cache.selectedBusinessList.length > 0;
    }

    // 캐쉬에 있는 instance 개수는 ?
    static selectedBusinessCount() {
        return _cache.selectedBusinessList.length;
    }

    //토플로지에서 사용.
    //false라면 권한이 없다고 표시함.
    static exist(id) {
        return !!_objectList[id];
    }

    static createBusiness(instance, i) {
        _businessInit(instance, i);

        return instance;
    }

    static getSortKeys(sid) {
        var businessList = [];

        if (_cache.hasSelectedBusiness) {
            businessList = _cache.selectedBusinessList;
        } else {
            businessList = _cache.businessList;
        }

        var sortKeys = {};

        each(businessList, function(i, id) {
            sortKeys[id] = i;
        });

        return sortKeys;
    }

    static businessKeys(sid, isSelectedBusinessList) {
        var businessList = [];

        if (_cache.hasSelectedBusiness || isSelectedBusinessList) {
            businessList = _cache.selectedBusinessList;
        } else {
            businessList = _cache.businessList;
        }

        if (typeof sid !== 'undefined') {
            businessList = filter(businessList, function(id) {
                return _objectList[id].sid == sid;
            });
        }

        return map(businessList, function(id) {
            return _objectList[id].oid();
        });
    }

    static businessList() {
        return map(_cache.businessList, function(id) {
            return _objectList[id];
        });
    }

    static convertBusinessId(businessList) {
        return map(businessList, function(id) {
            return _objectList[id].oid();
        });
    }

    static isDomain(id) {
        if (_objectList[id]) {
            return _objectList[id].isDomain();
        }

        return false;
    }

    static isBusiness(id) {
        if (_objectList[id]) {
            return _objectList[id].isBusiness();
        }

        return false;
    }

    static getSelectedBusinessListWithSid() {
        var domainList = {};

        each(_cache.selectedBusinessList, function(i, id) {
            domainList[_objectList[id].sid] = true;
        });
        domainList = Object.keys(domainList);
        var businessList = _cache.selectedBusinessList;

        return {
            domainList: domainList,
            businessList: businessList,
        };
    }

    static getHirachyList(externalList) {
        var result = {};
        var list = externalList || _cache.businessList;

        each(list, function(i, id) {
            var obj = _objectList[id];

            if (obj) {
                // domain id 기준
                if (!result[obj.sid]) {
                    result[obj.sid] = [];
                }

                result[obj.sid].push(obj.oid());
            }
        });

        return result;
    }

    static names() {
        var businessList = [];

        if (_cache.hasSelectedBusiness) {
            businessList = _cache.selectedBusinessList;
        } else {
            businessList = _cache.businessList;
        }

        var obj = this.getHirachyList(businessList);

        var total = [];

        for (var sid in obj) {
            var oids = obj[sid];

            var arr = [];

            arr.push('[');
            arr.push(ElementManager.getValue(this.domain(sid)).shortName);
            arr.push(' >  ');

            var businessNames = [];
            for (var i = 0, len = oids.length; i < len; i++) {
                businessNames.push(
                    _objectList[this.id(sid, oids[i])].shortName
                );
            }

            arr.push(businessNames.join(','));
            arr.push(']');

            total.push(arr.join(''));
        }

        return total.join(', ');
    }
}

var _data = [],
    _objectList = {},
    _cache = {
        domainList: [],
        businessList: [],
        selectedDomainList: [],
        selectedBusinessList: [],
    };

// group 전체 정보 설정, 그룹은 고정된 데이타이기 때문에 최초 로드할때 domain id 리스트를 가질 수 있는 구조로 만든다.
var _group = [],
    _selectedGroup = -1;

var _colorManager = [];
var _colorManagerKeys = {};
var _colorCodeManager = {};

//////////////////////////////////////////
////
////  Private Functions
////
////////////////////////////////////////////

function each(arr, callback, context) {
    for (var i = 0, len = arr.length; i < len; i++) {
        var ret = callback.call(context, i, arr[i]);

        // 루프를 돌다가 나오고 싶으면 return false; 를 하면 된다.
        if (ret === false) {
            break;
        }
    }
}

function filter(arr, callback) {
    var list = [];
    each(arr, function(i, element) {
        if (callback(element)) {
            list.push(element);
        }
    });

    return list;
}

function filterOne(arr, callback) {
    return filter(arr, callback)[0];
}

function map(arr, callback) {
    var list = [];
    each(arr, function(i, element) {
        list.push(callback(element));
    });

    return list;
}

// 각 id 별로 유일한 색상을 만든다.
function createColor(id) {
    if (_colorManagerKeys[id]) {
        return _colorManagerKeys[id];
    }

    // 색상코드가 없으면 새로 지정한다.
    _colorManagerKeys[id] = ColorManager_v2.newColor(_colorManager.length);
    _colorCodeManager[_colorManagerKeys[id].getRGB() + ''] = id;
    _colorManager.push(_colorManagerKeys[id]);

    return _colorManagerKeys[id];
}

// business 객체 생성
function _businessInit(business, i) {
    delete business.name;
    business.__proto__ = {
        key: function() {
            return this.id;
        },

        oid: function() {
            return +this.bizId;
        },

        selected: function(selected) {
            if (selected == true) {
                this.selected = true;
            } else if (selected == false) {
                this.selected = false;
            }

            return this.selected;
        },

        name: function() {
            return this.shortName;
        },

        isActive: function() {
            // business 는 언제나 Active 상태이다.
            return true;
        },

        isStopped: function() {
            return false;
        },

        isUnlicensed: function() {
            return false;
        },

        isDomain: function() {
            return false;
        },

        isAgent: function() {
            return false;
        },

        isBusiness: function() {
            return true;
        },

        color: function(color) {
            if (color) {
                this._color = color;
            }

            return this._color;
        },
    };
    business.color(createColor(business.id));
}

// 현재 선택된 리스트에 대한 캐쉬를 만든다.
function generateCache() {
    var domainCache = ElementManager.getCache();

    // 전체 instance 리스트를 가지고 있음.
    _cache = {};

    _cache.businessList = map(_data, function(obj) {
        return obj.id;
    }); // 비지니스 데이타를 어떻게 관리할지 부터 정해야할 듯 하다.

    _cache.domainList = domainCache.domainList;

    _cache.selectedDomainList = domainCache.selectedDomainList;

    _cache.selectedBusinessList = filter(_cache.businessList, function(id) {
        return (
            typeof _objectList[id].bizId != 'undefined' &&
            _objectList[id].selected
        );
    });

    _cache.hasSelectedBusiness = !!_cache.selectedBusinessList.length;
}

// 데이타 설정하기
// 정확히는 data 를 설정하면서  domain , instance 객체에 대한 function 도 같이 초기화 해준다.
function _dataInit(data, hasCaching) {
    _data = data || [];
    _objectList = {};

    var time = Date.now();

    each(_data, function(i, element) {
        element.time = time;
        //element.sid = sid;
        element.id = BusinessManager.id(element.sid, element.oid);
        element.depth = element.treeIndex.split('.').length;
        delete element.oid;
        _businessInit(element);
        _objectList[element.id] = element;
    });

    if (hasCaching) {
        generateCache();
    }
}

function toggle(id, notGenerateCache) {
    if (!id) return;

    if (_objectList[id]) {
        _objectList[id].selected = !_objectList[id].selected;
        if (!notGenerateCache) {
            generateCache();
        }
    } else {
        console.debug(id, 'is invalid domain or instance, it is no right. ');
    }
}

function select(id) {
    each(arguments, function(i, tempId) {
        toggle(tempId, false);
    });

    generateCache();
}
