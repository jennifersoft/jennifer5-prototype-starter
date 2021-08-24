/**
 * DomainGroup 에 대한 Tree 를 관리한다. 
 *
 * domain group 사용 여부   aries.get('isDomainGroupUsage')
 * domain group 관련 tree list aries.get("domainGroupListJson")
 *
 */

/**
 * @author david
 * aries.manager.domaingroup 을 변경함.
 */

import { Observer } from "@common/legacy/Observer.js";


class DomainGroupManager {


    ///////////////////////////////////////////////////////
    /////
    ///// Public Functions
    /////
    //////////////////////////////////////////////////////



    // group 초기화
    static init (data) {
        each(data, function (i, item) {
            item.depth = item.index.split('.').length;
            if (item.sid == -1) {
                var filterIndex = item.index + '.';
                var sidList = map(
                    filter(data, function (it) {
                        return it.index.indexOf(filterIndex) == 0 && it.sid > 0;		// 하위에 있고  sid 가 0보다 큰 애들
                    }),
                    function (it) {
                        return it.sid;
                    }
                );

                item.sidList = sidList;
            } else {
                item.sidList = [ item.sid ]    //  그룹이 아니고 도메인이면 하나의 리스트만 배열로 가진다.
            }
        });

        _group = data;

        if (Observer.get("isDomainGroupUsage")) {
            // 그룹을 쓰고 있다면
            if (!_selectedItem) {
                _selectedItem = _group[0];		// 선택되어진게 없으면 가장 처음에 있는 그룹으로 선택한다.
            }

            if (_selectedItem) {
                _selectedDomainList = _selectedItem.sidList;
            }
        } else {
            // domain group 을 사용하지 않을때는 도메인 중에 첫번째 것을 선택한다.
            this.setOnlyOne(true);
            // domain 중에 첫번째 것을 선택해준다. 그룹 제외
            this.setFirstDomain();
        }

    }



    /**
     * 현재 index 를 가리키는 객체를 가지고 온다.
     *
     * var item = aries.manager.domaingroup.item(index);
     *
     * item.title			// 제목
     * item.index			// 트리 노드의 위치
     * item.sidList 		// 하위 sid 리스트, 도메인이라면 자신을 리턴
     *
     * @param index
     * @returns {*}
     */
    static item (index) {
        return filterOne(_group, function (item) {
            return item.index == index;
        });
    };

    /**
     * sid 로 tree item 얻어오기
     *
     * @param sid
     * @returns {*}
     */
    static itemBySid (sid) {
        return filterOne(_group, function (item) {
            return item.sid == sid;
        });
    }

    /**
     * 정해진 depth 에서 list 가지고 오기
     *
     * depth 가 없으면 전체 리스트 모두 가지고 오기
     *
     * @param depth
     * @returns {*}
     */
    static list (depth) {
        depth = depth || 100;
        return filter(_group, function (it) {
            return it.depth <= depth;
        });
    };

    /**
     * 순수하게 도메인 리스트만 구함.
     *
     * domain group 이 아닐 때 전체 도메인을 나태내기 위해서 사용
     *
     * @param depth
     * @returns {*}
     */
    static domainList (depth) {
        depth = depth || 100;
        return map(filter(_group, function (it) {
            return it.depth <= depth && it.sid > 0;
        }), function (it) {
            return it.sid;
        });
    };

    /**
     * 자식 노드 조회하기
     *
     * aries.manager.domaingroup.children('0.1');			// 0.1 인덱스를 가진 node 에서 바로 밑 자식 가지고 오기
     * aries.manager.domaingroup.children('0.1', true);		// 0.1 인덱스를 가진 node 에서  하위에 속한 모든 자식 리스트 가지고 오기
     *
     * @param parentIndex
     * @param isAll
     * @returns {*}
     */
    static children (parentIndex, isAll) {
        isAll = (isAll === true);

        var parentDepth = parentIndex.split('.').length;

        if (isAll) {
            return filter(_group, function (it) {
                return it.index.indexOf(parentIndex + '.') > -1;		// 하위에 있고  sid 가 0보다 큰 애들
            });
        } else {
            return filter(_group, function (it) {
                return it.index.indexOf(parentIndex + '.') > -1 &&  it.depth  == (parentDepth+1);		// 하위에 있고  sid 가 0보다 큰 애들
            });
        }
    }

    /**
     * parentIndex 에 속한 sid 리스트 구하기
     *
     * aries.manager.domaingroup.getSidList();
     *
     *
     * @param parentIndex
     * @param isAll
     * @returns {Array}
     */
    static getSidList (parentIndex, isAll) {
        var sidList = [];
        each(this.children(parentIndex, isAll), function (i, item) {
            sidList = sidList.concat(item.sidList);
        });

        return sidList;
    }

    static setSelectedItem (index) {
        _selectedItem = this.item(index);

        if (_selectedItem) {
            _selectedDomainList = _selectedItem.sidList;
        }

        //aries.localStorage.save("selectedDomainGroupIndex", index);

        Observer.emit("aries.manager.domaingroup:setSelectedItem");
    }

    // 그룹을 선택해도 처음 sid 하나만 나오기 때문에 only one 을 설정
    // only one 을 설정하게 되면  getSelectedDomainList 에서 [ sid ] 배열 하나만 리턴
    static getSelectedDomainList () {

        // multi domain 셋팅이 항상 우선순위 1 순위
        if (_isMultiDomain) return _selectedAllDomainList;

        // 그 다음에 한개짜리 선택이 2순위
        if (_isOnlyOne) return [_selectedDomainList[0]];

        return _selectedDomainList;
    }

    // 선택된 도메인 리스트를 직접 설정한다.
    // aries.manager.domaingroup.setSelectedDomainList([ sid, sid, sid] );
    static setSelectedDomainList (sid) {
        _selectedDomainList = sid;
    }

    static getSelectedItem () {
        return _selectedItem;
    }

    static setOnlyOne (onlyOne) {
        _isOnlyOne = onlyOne || false;
    }

    static setMultiDomain (isMultiDomain) {
        _isMultiDomain = isMultiDomain;
        if (_isMultiDomain) {
            _selectedAllDomainList = this.domainList();
        } else {
            _selectedAllDomainList = [];
        }

    }

    static setFirstDomain () {
        var item = filterOne(_group, function (item) {
            return item.sid > 0;
        });

        if (item) {
            this.setSelectedItem(item.index);
        }

    }

    static setFirstGroup () {
        // 그룹을 쓰고 있다면
        _selectedItem = _group[0];		// 선택되어진게 없으면 가장 처음에 있는 그룹으로 선택한다.

        if (_selectedItem) {
            _selectedDomainList = _selectedItem.sidList;
        }
    }

    static isOnlyOne () {
        return _isOnlyOne;
    }

    static getSelectedIndexForDomain (selectedIndex) {
        var item = this.item(selectedIndex);

        if (!item) return "0";

        if (item.sid == -1) {  // group 이라면
            // sidList 중에 첫번째것을 선택한 node 로 한다.
            var childItem  = this.itemBySid(item.sidList[0]);

            selectedIndex = childItem.index;
        }

        return selectedIndex;
    }

    /**
     * sid를 이용해서 depth=1 인 도메인그룹 index를 알기 위해서 만듬.
     * 사용자 정의 대시보드에서 차트 수정시에 필요하다.
     *
     * @param sid
     */
    static getHighestDepthIndexBySid (sid) {

        return filterOne(_group, function (item) {
            return (item.depth === 1 && item.sidList.indexOf(sid) > -1);
        }).index;


    }
}

let _group = [], _selectedItem = null, _selectedDomainList = [], _selectedAllDomainList = [], _isOnlyOne = false, _isMultiDomain = false;

Observer.on('set.domainGroups', function () {
    DomainGroupManager.init (Observer.get('domainGroups') || []);
});

//////////////////////////////////////////
////
////  Private Functions
////
////////////////////////////////////////////

function each (arr, callback, context) {
    for(var i = 0, len = arr.length; i < len; i++) {
        var ret = callback.call(context, i, arr[i]);

        // 루프를 돌다가 나오고 싶으면 return false; 를 하면 된다.
        if (ret === false) {
            break;
        }
    }
}

function filter (arr, callback) {
    var list = [];
    each(arr, function (i, element) {
        if (callback(element)) {
            list.push(element);
        }
    })

    return list;
}

function filterOne(arr, callback) {
    return filter(arr, callback)[0];
}

function map (arr, callback) {
    var list = [];
    each(arr, function (i, element) {
        list.push(callback(element));
    });

    return list;
}



export {DomainGroupManager};