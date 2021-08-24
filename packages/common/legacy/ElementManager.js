/**
 * 기존에 사용하던  aries.manager.domain 을 대체합니다.
 *
 *  1. 타입을 가지지 않고  순수 data 만 보관합니다.
 *  2. selected 상태를 캐쉬로 항상 가지고 있습니다.
 *  3. data 는 계층 구조가 아니라  list 형태로 보관되고
 *  4. domain, instance 모두 유일한 id 를 가집니다.
 *  5. select 가 변경되면  무조건 cache 를 생성합니다.
 *  6. handler 라는 개념을 쓰지 않고 jennifer.core.js 에 있는 event 를 사용합니다. (Observer pattern)
 *  7.  즉, 이코드에는 외부와 연결되는 코드가 있으면 안됩니다. 순수한 데이타 덩어리입니다.
 *  ps. 어떠한 외부 코드도 넣지 마세요.
 *
 *  // 중요
 *  8. 타입을 가지지 않는 이유는 selected 된 상태만 가지기 때문입니다. selected 된 리스트를 어떻게 쓰던, domainbar 나 chart 에서 제어합니다.
 *     즉, chart 에서 자기가 처리할 데이타 타입을 이미 다 가지고 있어야합니다.
 *
 *  몇가지 이벤트를 가집니다.
 *
 *  aries.manager.element:select  -  select 상태가 변경될때 일어납니다. 다른 컴포넌트에서 해당 이벤트를 받아서 사용하세요.
 *
 */
import { Observer } from '@common/legacy/Observer';
import { DomainGroupManager } from './DomainGroupManager';
import { ID } from '@common/legacy/ID.js';
import {
    AgentStatusDef,
    DomainBarBatchjobModeDef,
    LicenseStatusDef,
} from '@common/definition';
import {
    ChartKeywordInObserver,
    DataKeywordInObserver,
} from '@common/ObserverKeyword';
import { ColorManager_v2 } from '@common/legacy/ColorManager';
import _ from '@library/lodash';

const NOT_LIVE_LICENSE_STATUS = [
    LicenseStatusDef.STOPPED,
    LicenseStatusDef.STOPPED_RECENTLY_LICENSE_PROBLEM_OCCURS,
];

export class ElementManager {
    ///////////////////////////////////////////////////////
    /////
    ///// Public Functions
    /////
    //////////////////////////////////////////////////////

    // domainbar 초기화 , 옵션 설정, 타입 설정,
    /*this.init = */
    static init(data, batchjobMode, sid, oid) {
        _dataInit(data, false);

        if (typeof batchjobMode != 'undefined') {
            _batchjobMode = batchjobMode;
        }

        if (typeof sid != 'undefined') {
            if (!(sid instanceof Array)) {
                sid = [sid];
            }

            for (var i = 0, len = sid.length; i < len; i++) {
                var domainId = ID.domain(sid[i]);

                if (_objectList[domainId]) {
                    _objectList[domainId].selected = true;
                }
            }
        }

        if (typeof oid != 'undefined') {
            if (!(oid instanceof Array)) {
                oid = [oid];
            }

            for (var i = 0, len = oid.length; i < len; i++) {
                var instanceId = oid[i];

                if (_objectList[instanceId]) {
                    _objectList[instanceId].selected = true;
                }
            }
        }

        _generateCache();
    }

    static generateCache() {
        _generateCache();
    }

    static getValueByColor(colorCode) {
        return this.getValue(
            _colorDomainCodeManager[colorCode + ''] ||
                _colorCodeManager[colorCode + '']
        );
    }

    // 생성된 캐쉬를 리턴한다.
    static getCache() {
        return _cache;
    }

    // 가지고 있는 전체 (domain, instance 정보)를 리턴한다.
    static getData() {
        return _data;
    }

    static id(sid, oid) {
        if (arguments.length === 1) {
            return this.domain(sid);
        } else {
            return this.agent(sid, oid);
        }
    }

    static domain(sid) {
        return ID.domain(sid);
    }

    static agent(sid, oid) {
        return ID.agent(sid, oid);
    }

    // websocket 으로 데이타 동기화
    static callback(json) {
        if (!json.domainAgentList || !json.domainAgentList.data) {
            return;
        }

        var data = json.domainAgentList.data;

        if (!data.length) return;

        // 데이타 받은 이후에  기존 리스트를 업데이트 한다.
        // 1. callback 받은 시점의 time 을 생성한다.
        var time = Date.now();
        // 2. 각각의 data 의  id 를 검색해보고  없으면 추가하고 있다면  해당 필드 값을 모두 거기 있는 값으로 변경한다.
        //  if (_objectList[element.id]) { }  else { }
        var domainCount = 0;
        var instanceCount = {};

        var list = [];

        // 데이타를 일렬로 만듦
        each(data, function(i, d) {
            var agent_list = d.agent;

            delete d.agent;

            list.push(d);

            each(agent_list, function(j, a) {
                list.push(a);
            });
        });

        each(list, function(i, d) {
            // 3. insCount 와 agentCount 의 각각 통계를 낸다.
            //  sidCount[sid]++;

            d.time = time;
            if (_objectList[d.id]) {
                // 기존에 가지고 있는 아이디가 있다면  정보를 업데이트

                if (d.parent) {
                    // agent 일 경우 상태를 변경한다.
                    instanceCount[d.parent] = instanceCount[d.parent] || 0;

                    _objectList[d.id].color(createColor(d.id));

                    _objectList[d.id].status = d.status;
                    _objectList[d.id].license_status = d.license_status;
                    _objectList[d.id].shortName = d.shortName;
                    _objectList[d.id].longName = d.longName;
                    _objectList[d.id].statusMsg = d.statusMsg;
                } else {
                    // domain 일 경우 상태 변경

                    _objectList[d.id].color(createDomainColor(d.id));
                    _objectList[d.id].agentCount = d.agentCount;
                }
                _objectList[d.id].time = d.time;
            } else {
                // 기존에 가지고 있는 아이디가 없다면 추가
                if (d.parent) {
                    instanceCount[d.parent] = instanceCount[d.parent] || 0;

                    _instanceInit(d, instanceCount[d.parent]++);
                } else {
                    _domainInit(d, domainCount++);
                }

                //추가하려는 인스턴스가 속한 가장 마지막 index에 추가한다.
                //같은 도메인에 속한 인스턴스의 정렬을 유지하기 위해서다.
                const lastIndex = _data.map(el => el.sid).lastIndexOf(d.sid);
                lastIndex > -1
                    ? _data.splice(lastIndex + 1, 0, d)
                    : _data.push(d);
                _objectList[d.id] = d;
            }
        });

        // agentCount 업데이트
        each(Object.keys(instanceCount), function(i, domainId) {
            _objectList[domainId].agentCount = instanceCount[domainId];
        });

        // 4. time 이 현재 시점보다 작은건  모두 지운다.
        //   if (element.time < time) { continue;  }
        //
        _data = filter(_data, function(element) {
            if (element.time == time) {
                return true;
            } else {
                delete _objectList[element.id]; // 제외된 객체는 지운다.
                return false;
            }
        });

        // 5. cache 를 다시 생성한다.
        _generateCache();

        // aries.manager.element 는  domain bar 생성에 관여하지 않는다.
        // 모든 것은 domain 바에서 처리할 뿐이다.
        Observer.emit(DataKeywordInObserver.INSTANCE_INFO_IN_DOMAIN);
    }

    // all data
    // id 가 있으면 특정 아이디에 대한 것만 리턴,
    // 아니면 전체 리스트 리턴
    static getValue(id) {
        if (_objectList[id]) return _objectList[id];

        // 전체 리스트 볼일이 없으므로 null 을 리턴한다.
        return null;
    }

    /**
     *
     * instance id 리스트를 oid 리스트로 변환하기
     *
     * @param sid
     * @param instanceIdList
     * @returns {*}
     */
    static getOids(sid, instanceIdList) {
        return map(
            filter(_data, function(element) {
                return (
                    element.sid == sid &&
                    instanceIdList.indexOf(element.instId + '') > -1
                );
            }),
            function(element) {
                return element.oid();
            }
        );
    }

    static getInstanceIdList(sid, oids) {
        return map(
            filter(_data, function(element) {
                return element.sid == sid && oids.indexOf(element.oid()) > -1;
            }),
            function(element) {
                return element.instId;
            }
        );
    }

    static getDomainAllList() {
        return getDomainAllList();
    }

    static getDomainList() {
        return getDomainList();
    }

    /**
     * 선택된 도메인 리스트를 준다.
     *
     * instanceList 는 비어있는 배열.
     *
     * @returns {{domainList: *, instanceList: Array}}
     */
    static getSelectedDomain() {
        return getSelectedDomain();
    }

    static getSelectedDomainSidList() {
        return getSelectedDomainSidList();
    }

    static getAllDomainSidList() {
        return getAllDomainSidList();
    }

    /**
     * 선택된 Instance 리스트를 준다.
     *
     * @returns {{domainList: *, instanceList: Array}}
     */
    static getSelectedInstance() {
        return getSelectedInstance();
    }

    // 캐쉬된 개수 리턴
    static getInfo() {
        return _info;
    }

    // 선택된 애를 토글 시켜보자.
    static toggle() {
        toggle();
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

        _generateCache();
    }

    static refreshDomainSelect() {
        // 캐쉬에 있는 리스트 지우기
        each(_cache.selectedDomainList, function(i, id) {
            _objectList[id].selected = false;
        });

        _generateCache();
    }

    static refreshInstanceSelect() {
        // 캐쉬에 있는 리스트 지우기
        each(_cache.selectedInstanceList, function(i, id) {
            _objectList[id].selected = false;
        });

        _generateCache();
    }

    static refreshUnliveInstanceSelectWhenSelectOnlyLive() {
        _cache.selectedInstanceList.forEach(id => {
            if (
                NOT_LIVE_LICENSE_STATUS.includes(_objectList[id].license_status)
            ) {
                _objectList[id].selected = false;
            }
        });
    }

    // 모든 것을 selected 를 하지 않고 하나만 선택합니다.
    // 분석에서 많이 쓰이겠네요.
    static selectInstanceOne(id) {
        each(_cache.instanceList, function(i, id) {
            var instance = _objectList[id];
            // 선택된 instance 를 모두 selected 로 만들고
            instance.selected = false;
        });

        // 하나만 선택한다. 당연 캐쉬는 다시 만들고
        select(id);
    }

    // 도메인을 하나만 선택해보자.
    static selectDomainOne(id) {
        each(_cache.domainList, function(i, domainId) {
            var domain = _objectList[domainId];
            // 선택된 instance 를 모두 selected 로 만들고
            domain.selected = false;
        });

        // 하나만 선택한다. 당연 캐쉬는 다시 만들고
        select(id);
    }

    // 선택된 상태를 변경시켜보자.
    static select(id) {
        select(id);
    }

    // 선택되어있는지 알아보자.
    static isSelected(id) {
        return !!_objectList[id].selected;
    }

    // selected 된 instance 가 있는지 , 실제로 클릭한 상태의 instance 가 있는지
    static hasSelectedInstance() {
        return _cache.selectedInstanceList.length > 0;
    }

    // 캐쉬에 있는 instance 개수는 ?
    static selectedInstanceCount() {
        return _cache.instanceList.length;
    }

    static setSelectedData(data) {
        data = data || { selectedDomainList: [], selectedInstanceList: [] };

        each(data.selectedDomainList || [], function(i, id) {
            if (_objectList[id]) {
                _objectList[id].selected = true;
            }
        });

        each(data.selectedInstanceList || [], function(i, id) {
            if (_objectList[id]) {
                _objectList[id].selected = true;
            }
        });

        // selected 된 정보가 업데이트 되면  cache 를 재생성한다.
        _generateCache();
    }

    static getHierarchyList(externalList) {
        var result = {};
        var list = externalList || _cache.instanceList;

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

    static getSelectedInstanceIdListWithSid() {
        var domainList = {};

        each(_cache.selectedInstanceList, function(i, id) {
            domainList[_objectList[id].sid] = true;
        });
        var domainList = Object.keys(domainList);
        var instanceList = _cache.selectedInstanceList;

        return {
            domainList: domainList,
            instanceList: instanceList,
        };
    }

    //토플로지에서 사용.
    //false라면 권한이 없다고 표시함.
    static exist(id) {
        return !!_objectList[id];
    }

    static createInstance(instance, i) {
        _instanceInit(instance, i);

        return instance;
    }

    static instanceKeys(sid) {
        var instanceList = [];

        if (_cache.hasSelectedInstance) {
            instanceList = _cache.selectedInstanceList;
        } else {
            instanceList = _cache.instanceList;
        }

        if (typeof sid !== 'undefined') {
            instanceList = filter(instanceList, function(id) {
                return _objectList[id].sid === sid;
            });
        }

        return map(instanceList, function(id) {
            return _objectList[id].agent;
        });
    }

    static instanceList() {
        return map(_cache.instanceList, function(id) {
            return _objectList[id];
        });
    }

    static convertInstanceId(instanceList) {
        return map(instanceList, function(id) {
            return _objectList[id].oid();
        });
    }

    static isDomain(id) {
        if (_objectList[id]) {
            return _objectList[id].isDomain();
        }

        return false;
    }

    static isInstance(id) {
        if (_objectList[id]) {
            return _objectList[id].isAgent();
        }

        return false;
    }

    static name(sid, oid) {
        return nameList[ID.agent(sid, oid)] || (oid > 0 ? oid : sid);
    }
    static domainNames() {
        const obj = this.#instanceHierarchyList();

        const domainNames = Object.keys(obj).map(
            sid => _objectList[this.id(sid)].shortName
        );

        return '[' + domainNames.join(',') + ']';
    }
    static #instanceHierarchyList() {
        const instanceList = _cache.hasSelectedInstance
            ? _cache.selectedInstanceList
            : _cache.instanceList;
        return this.getHierarchyList(instanceList);
    }
    static names() {
        const obj = this.#instanceHierarchyList();

        var total = [];

        for (var sid in obj) {
            var oids = obj[sid];

            var arr = [];

            arr.push('[');
            arr.push(_objectList[this.id(sid)].shortName);
            arr.push(' >  ');

            var instanceNames = [];
            for (var i = 0, len = oids.length; i < len; i++) {
                instanceNames.push(
                    _objectList[this.id(sid, oids[i])].shortName
                );
            }

            arr.push(instanceNames.join(','));
            arr.push(']');

            total.push(arr.join(''));
        }

        return total.join(', ');
    }
}

var _data = [],
    _batchjobMode,
    _objectList = {},
    _domainList = [],
    _cache = {
        domainList: [],
        instanceList: [],
        liveInstanceList: [],
        selectedDomainList: [],
        selectedInstanceList: [],
    },
    _info = { totalCount: 0, live: 0, stop: 0, license: 0 };

// group 전체 정보 설정, 그룹은 고정된 데이타이기 때문에 최초 로드할때 domain id 리스트를 가질 수 있는 구조로 만든다.
var _group = [],
    _selectedGroup = -1;

var _colorManager = [],
    _colorManagerKeys = {},
    _colorCodeManager = {};
var _colorDomainManager = [],
    _colorDomainManagerKeys = {},
    _colorDomainCodeManager = {};

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

// 각 id 별로 유일한 색상을 만든다.
function createDomainColor(id) {
    if (_colorDomainManagerKeys[id]) {
        return _colorDomainManagerKeys[id];
    }

    // 색상코드가 없으면 새로 지정한다.
    _colorDomainManagerKeys[id] = ColorManager_v2.newColor(
        _colorDomainManager.length
    );
    _colorDomainCodeManager[_colorDomainManagerKeys[id].getRGB() + ''] = id;
    _colorDomainManager.push(_colorDomainManagerKeys[id]);

    return _colorDomainManagerKeys[id];
}

// domain 객체 생성
function _domainInit(domain, i) {
    domain.__proto__ = {
        key: function() {
            return this.id;
        },

        oid: function() {
            return this.sid;
        },

        isActive: function() {
            return true;
        },

        isUnlicensed: function() {
            return false;
        },

        isDomain: function() {
            return true;
        },

        isAgent: function() {
            return false;
        },

        isStopped: function() {
            return false;
        },

        isBusiness: function() {
            return false;
        },

        name: function() {
            return this.shortName;
        },

        // color: function(color) {
        //     if (color) {
        //         this._color = color;
        //     }
        //
        //     return this._color;
        // },
    };

    domain.color = color => {
        if (color) {
            domain._color = color;
        }

        return domain._color;
    };
    domain.color(createDomainColor(domain.id));

    //도메인 단위의 인스턴스 카운트 정보.
    //인스턴스의 색상을 정의하는데 사용한다.
    domain.insCount = 0;

    // 아이디 설정
    domain.hash = '#' + domain.id;

    return domain;
}

// instance 객체 생성
function _instanceInit(instance, i) {
    delete instance.name;
    instance.__proto__ = {
        key: function() {
            return this.id;
        },

        keys: function() {
            return { sid: this.sid, agent: this.agent };
        },

        oid: function() {
            return this.agent;
        },

        host: function() {
            return this.hostId;
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

        isHost: function() {
            return this.instId == 0;
        },

        // isActive: function() {
        //     if (!this.isStopped() && !this.isUnlicensed()) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // },
        //
        // isUnlicensed: function() {
        //     if (
        //         this.license_status ===
        //         LicenseStatusDef.STOPPED_RECENTLY_LICENSE_PROBLEM_OCCURS
        //     ) {
        //         return true;
        //     }
        //
        //     return false;
        // },
        //
        // isStopped: function() {
        //     if (this.isHost()) {
        //         if (this.status === AgentStatusDef.NONE) {
        //             return true;
        //         }
        //     } else {
        //         if (this.license_status === LicenseStatusDef.STOPPED) {
        //             return true;
        //         }
        //     }
        //
        //     return false;
        // },

        // isDomain: function() {
        //     return false;
        // },

        isAgent: function() {
            return true;
        },

        isBusiness: function() {
            return false;
        },

        // color: function(color) {
        //     if (color) {
        //         this._color = color;
        //     }
        //
        //     return this._color;
        // },
    };

    //[/realtime/event] 페이지에서 스트립트 에러가 생겼다. __proto__ 에 선언된 메소드를 인지하지 못함.
    //마치 __proto__의 메소드들이 비동기 선언 함수가 된거 같은 상황으로 변경되었다. 긴급 땜빵.
    instance.isDomain = () => {
        return false;
    };

    instance.isUnlicensed = () => {
        return (
            instance.license_status ===
            LicenseStatusDef.STOPPED_RECENTLY_LICENSE_PROBLEM_OCCURS
        );
    };

    instance.isStopped = () => {
        return instance.license_status === LicenseStatusDef.STOPPED;
    };

    instance.isActive = () => {
        return !instance.isStopped() && !instance.isUnlicensed();
    };
    instance.color = color => {
        if (color) {
            instance._color = color;
        }

        return instance._color;
    };

    instance.color(createColor(instance.id));
    instance.hash = '#' + instance.id;
}

// 현재 선택된 리스트에 대한 캐쉬를 만든다.
function _generateCache() {
    // 가지고 있는 도메인 전체 리스트 호출
    let domainList = [];

    // 그 중에 실제로 사용되는 , domain group 에 속한 리스트만 추출
    var domainGroupList = map(
        DomainGroupManager.getSelectedDomainList(),
        function(it) {
            return ID.domain(it);
        }
    );

    if (domainGroupList.length) {
        // _domainList 로 현재 실행되고 있는 domain 만 출력
        _domainList = map(domainGroupList, function(domainId) {
            return domainId;
        });
    } else {
        // 없으면 없는  상태로 보여줌
        _domainList = []; // 아무것도 없을 때는  비어있는 목록으로 가지고 있는다.
    }

    // 캐쉬는 _domainList 를 기준으로 만들어준다.

    // 전체 instance 리스트를 가지고 있음.
    _cache = getSelectedInstance(true);

    // 순수하게 선택된 것들만 가지고 있음 .
    _cache.selectedDomainList = filter(_cache.domainList, function(id) {
        return _objectList[id].selected;
    });

    _cache.selectedInstanceList = filter(_cache.instanceList, function(id) {
        return _objectList[id].selected;
    });

    _cache.hasSelectedDomain = !!_cache.selectedDomainList.length;
    _cache.hasSelectedInstance = !!_cache.selectedInstanceList.length;

    // instance 카운트를 세어보자.
    var totalCount = 0,
        liveCount = 0,
        stopCount = 0,
        licenseCount = 0;
    each(_cache.instanceList, function(i, id) {
        var obj = _objectList[id];

        if (obj.isActive()) {
            // 살아있는것
            liveCount++;
        } else if (obj.isUnlicensed()) {
            // 라이센스가 없는 것
            licenseCount++;
        } else if (obj.isStopped()) {
            // 죽어있는 것
            stopCount++;
        }
        totalCount++; // 전체 개수
    });

    _info = {
        totalCount: totalCount,
        live: liveCount,
        stop: stopCount,
        license: licenseCount,
    };

    let selectedInstanceOidsBySid = {};
    const sids = ElementManager.getSelectedDomainSidList();
    if (sids.length > 0)
        selectedInstanceOidsBySid = Object.assign(
            ...sids.map(sid => ({ [sid]: ElementManager.instanceKeys(sid) }))
        );

    // 캐쉬가 생성되었다는 것은  select 정보가 변경되었다는 증거.
    Observer.emit(
        ChartKeywordInObserver.CHANGE_SELECT_DOMAIN_OR_INSTANCE_ON_ELEMENT,
        [selectedInstanceOidsBySid]
    );
}

// 데이타 설정하기
// 정확히는 data 를 설정하면서  domain , instance 객체에 대한 function 도 같이 초기화 해준다.
function _dataInit(data, hasCaching) {
    _data = data;
    _objectList = {};

    var time = Date.now();

    var domainCount = 0;
    each(_data, function(i, element) {
        element.time = time;
        if (element.parent) {
            // instance 의 경우
            _instanceInit(element, _objectList[element.parent].insCount++);
        } else {
            // domain 의 경우
            element.insCount = 0;
            _domainInit(element, domainCount++);
        }

        _objectList[element.id] = element;
    });

    if (hasCaching) {
        _generateCache();
    }
}

function getDomainAllList() {
    return _domainList;
}

function getDomainList() {
    // 전체 도메인 리스트를 구한다.

    return filter(_data, function(element) {
        return element.isDomain();
    });
}

function getSelectedInstance(isAll) {
    var domainList = getSelectedDomain();

    // 선택된  도메인에 대한 전체 instance 리스트를 구한다.
    var instanceList = filter(_data, function(element) {
        return _.indexOf(domainList.domainList, element.parent) > -1;
    });

    // 그 중에 selected 되어진 instance 리스트를 구한다.
    var selectedInstanceList = filter(instanceList, function(element) {
        return element.selected;
    });

    let instanceIdList = [],
        liveInstanceIdList = [];

    // selected 리스트가 있다면
    if (selectedInstanceList.length && isAll !== true) {
        // selected 되어진 리스트 중에 id 만 추출
        instanceIdList = selectedInstanceList.map(el => el.id);
        liveInstanceIdList = selectedInstanceList
            .filter(
                el =>
                    NOT_LIVE_LICENSE_STATUS.includes(el.license_status) ===
                    false
            )
            .map(el => el.id);
    } else {
        // 아니면 전체 instance 리스트 중에 id 만 추출
        instanceIdList = instanceList.map(el => el.id);

        liveInstanceIdList = instanceList
            .filter(
                el =>
                    NOT_LIVE_LICENSE_STATUS.includes(el.license_status) ===
                    false
            )
            .map(el => el.id);
    }

    return {
        domainList: domainList.domainList,
        instanceList: instanceIdList,
        liveInstanceList: liveInstanceIdList,
    };
}

function getSelectedDomain(isAll) {
    var filteredList = filter(
        map(_domainList, function(id) {
            return _objectList[id];
        }),
        function(element) {
            // 살아있는 리스트만 조회
            return !!element;
        }
    );

    // 그 중에 selected 되어진 리스트를 구한다.
    var selectedDomainList = filter(filteredList, function(element) {
        // batchjob 모드 일때는 batch mode 인 애들만 selected 체크함
        if (DomainBarBatchjobModeDef.BATCHJOB_ONLY == _batchjobMode) {
            if (element.batchjob) {
                return element.selected;
            }

            return false;
        } else {
            // batchjob 모드가 아닐때는 batchjob 인 도메인은 제외시키고 selected 체크
            if (element.batchjob) {
                return false;
            }
        }

        return element.selected;
    });

    var domainIdList = [];
    // selected 리스트가 있다면
    if (selectedDomainList.length && isAll !== true) {
        // selected 리스트에서 아이디 리스트를 구한다.

        if (DomainBarBatchjobModeDef.BATCHJOB_ONLY === _batchjobMode) {
            // batchjob only mode 에서는 batchjob 인 도메인만
            var filteredSelectDomainList = filter(selectedDomainList, function(
                element
            ) {
                return element.batchjob;
            });
        } else {
            var filteredSelectDomainList = filter(selectedDomainList, function(
                element
            ) {
                return !element.batchjob;
            });
        }

        domainIdList = map(filteredSelectDomainList, function(element) {
            return element.id;
        });
    } else {
        // 그렇지 않다면 전체 리스트에서 id 리스트를 구한다.
        if (DomainBarBatchjobModeDef.BATCHJOB_ONLY === _batchjobMode) {
            // batchjob only mode 에서는 batchjob 인 도메인만
            var filteredDomainList = filter(filteredList, function(element) {
                return element.batchjob;
            });
        } else {
            var filteredDomainList = filter(filteredList, function(element) {
                return !element.batchjob;
            });
        }

        domainIdList = map(filteredDomainList, function(element) {
            return element.id;
        });
    }

    return { domainList: domainIdList, instanceList: [] };
}

function getSelectedDomainSidList() {
    var domainList = getSelectedDomain().domainList;

    return map(domainList, function(id) {
        return _objectList[id].sid;
    });
}

/**
 * 모든 도메인 sid 리스트
 * @returns {*}
 */
function getAllDomainSidList() {
    var domainList = getDomainList();

    return map(domainList, function(element) {
        return element.sid;
    });
}

function toggle(id, notGenerateCache) {
    if (!id) return;

    if (_objectList[id]) {
        _objectList[id].selected = !_objectList[id].selected;
        if (!notGenerateCache) {
            _generateCache();
        }
    } else {
        console.debug(id, 'is invalid domain or instance, it is no right. ');
    }
}

function select(id) {
    each(arguments, function(i, tempId) {
        toggle(tempId, false);
    });

    _generateCache();
}

// domain 동기화 이벤트
Observer.on(
    DataKeywordInObserver.LISTEN_INSTANCE_INFOMATION_IN_DOMAINS,
    function(json) {
        ElementManager.callback(json);
    }
);
