import { getAllChildren } from '@vuejs/component/Resource/Tree/treeAction';
import { DomainGroupManager } from '@common/legacy/DomainGroupManager';
import { Observer } from '@common/legacy/Observer';
import { ElementManager } from '@common/legacy/ElementManager';
import { LocalStorageManager } from '@common/legacy/LocalStorageManager';
import { DataKeywordInObserver } from '@common/ObserverKeyword';

const domainGroupDataElement = document.querySelector(
    'textarea[name="domainGroupJson"]'
);
const domainGroupData = JSON.parse(
    domainGroupDataElement
        ? domainGroupDataElement.innerText
        : `{"domainGroupList": {"data": []}}`
).domainGroupList.data;
const domainListNormalized = domainGroupData.map(r => {
    let label = r.title;

    if (label === 'unknownGroup' || label === 'domainAll') {
        label = window.i18n.get(`ui.label.${label}`);
    }

    return {
        label,
        resourceType: r.sid === -1 ? 'domain-group' : 'domain',
        treeIndex: r.index,
        data: r,
    };
});

/**
 * batchjob domain 보여줄 페이지 목록
 */
const showAllPage = [
    'dashboard/multiDomain',
    'dashboard/topoloy',
    'realtime/xview',
    'analysis/xview',
    'analysis/service',
    'analysis/performanceBrowser',
    'analysis/regression',
    'analysis/applicationHistory',
    'analysis/userAgent',
    'analysis/dbmetrics',
    'analysis/event',
    'statistics/',
];
const excludeBatchjobPage = [
    'dashboard/realtimeAdmin',
    'dashboard/realtimeAdmin_php',
    'dashboard/realtimeAdmin_resource',
    'userdefine/dashboard',
    'realtime/memory',
    'realtime/user',
    'realtime/event',
    'realtime/systemResource',
    'realtime/dbsql',
    'realtime/dbConnection',
    'realtime/business',
    'analysis/loadedClasses',
    'analysis/env',
    'analysis/file',
    'analysis/socket',
    'analysis/thread',
    'analysis/methodStacktrace',
    'analysis/crud',
    'analysis/collection',
    'analysis/searchclass',
    'analysis/jarcheck',
    'analysis/modifyfile',
    'analysis/servicedump',
];
const onlyBatchjobPage = ['dashboard/batchjob'];

const BATCHJOB_TYPE = {
    ALL: 'ALL',
    NO_BATCHJOB: 'NO_BATCHJOB',
    ONLY_BATCHJOB: 'ONLY_BATCHJOB',
};
function getBatchJobPageType() {
    const href = window.location.href;
    for (const allHref of showAllPage) {
        if (href.includes(allHref)) {
            return BATCHJOB_TYPE.ALL;
        }
    }
    for (const noBatchHref of excludeBatchjobPage) {
        if (href.includes(noBatchHref)) {
            return BATCHJOB_TYPE.NO_BATCHJOB;
        }
    }
    for (const onlyBatchHref of onlyBatchjobPage) {
        if (href.includes(onlyBatchHref)) {
            return BATCHJOB_TYPE.ONLY_BATCHJOB;
        }
    }
    return BATCHJOB_TYPE.ALL;
}

const domainList = domainListNormalized
    .filter(d => {
        return !(
            d.data.sid === -1 &&
            getAllChildren(d.treeIndex, domainListNormalized).every(
                domain => domain.data.sid === -1
            )
        );
    })
    .map(d => {
        const batchJobPageType = getBatchJobPageType();
        let noInteraction = false;
        if (batchJobPageType === BATCHJOB_TYPE.NO_BATCHJOB) {
            noInteraction = d.data.batchjob;
        } else if (batchJobPageType === BATCHJOB_TYPE.ONLY_BATCHJOB) {
            noInteraction = !d.data.batchjob;
        }
        return {
            ...d,
            noInteraction,
        };
    });

let currentTreeIndex = (
    window.localStorage.getItem('selectedDomainGroupIndex') || ''
).replace(/\"/g, '');
if (!domainList.some(d => d.treeIndex === currentTreeIndex)) {
    currentTreeIndex = domainList[0] ? domainList[0].treeIndex : '0';
} else {
    // 선택한 정보 저장
    DomainGroupManager.setSelectedItem(currentTreeIndex);
}

function selectDomainMutationLogic(state, domainTreeIndex, noCache = false) {
    let selectedIndex = domainTreeIndex;
    const { multiDomainFlag, domainList } = state;

    // 도메인 그룹 정보에서 onlyOne 설정이 되면 순수하게 domain 만 선택할 수 있다.
    if (DomainGroupManager.isOnlyOne()) {
        selectedIndex = DomainGroupManager.getSelectedIndexForDomain(
            selectedIndex
        );
    }

    // 트리 재선택
    let selectedOne =
        domainList.find(d => d.treeIndex === selectedIndex) ||
        state.domainList[0];
    if (!multiDomainFlag && selectedOne.data.sid === -1) {
        selectedOne = getAllChildren(selectedOne.treeIndex, domainList).filter(
            d => d.data.sid !== -1
        )[0];
    }
    state.selectedOne = selectedOne;

    const selectedDomainGroupIndexKeyName = window.batchJobMode
        ? 'selectedDomainGroupIndexForBatchJob'
        : 'selectedDomainGroupIndex';

    if (!noCache) {
        // 현재 선택한 노드 세션이 저장하기
        LocalStorageManager.save(
            selectedDomainGroupIndexKeyName,
            selectedIndex
        );

        // 선택한 정보 저장
        // 꼭 ElementManager.generateCache() 함수 보다 먼저 실행한다!
        DomainGroupManager.setSelectedItem(selectedIndex);

        // domain 를 위한 모델  캐쉬 설정
        ElementManager.generateCache();

        // 도메인이 바뀌는 것이기 때문에  domainbar 의 세션정보도 삭제된다.
        if (Observer.get('domainbar')) {
            Observer.get('domainbar').cleanSession();
        }
    }

    // 변경된 이벤트 날림
    Observer.emit('domain.tree.select');

    // 도메인 그룹바에 이벤트 날림
    Observer.emit(DataKeywordInObserver.DOMAIN_BAR_CHANGE);
}

export default {
    namespaced: true,
    state: {
        multiDomainFlag: true,
        domainList,
        selectedOne: domainList.find(d => d.treeIndex === currentTreeIndex),
    },
    mutations: {
        _updateMultiDomainFlag(state, flag) {
            state.multiDomainFlag = flag;
        },
        updateDomainList(state, domainList) {
            state.domainList = domainList;
        },
        selectDomain(state, domainTreeIndex) {
            selectDomainMutationLogic(state, domainTreeIndex);
        },
        selectDomainWithoutCache(state, domainTreeIndex) {
            return selectDomainMutationLogic(state, domainTreeIndex, true);
        },
    },
    getters: {
        allSidList: state => {
            return state.domainList
                .filter(domain => domain.data.sid !== -1)
                .map(domain => domain.data.sid);
        },
        sidList({ domainList, selectedOne }) {
            /**
             * 도메인 선택되어있으면 -> [해당 도메인 sid]
             * 도메인 그룹 선택되어있으면 -> [해당 도메인 자식들의 sid들 전부]
             */
            if (!selectedOne || !selectedOne.data) {
                return [];
            }
            if (selectedOne.data.sid === -1) {
                return getAllChildren(selectedOne.treeIndex, domainList)
                    .filter(d => {
                        if (
                            getBatchJobPageType() ===
                            BATCHJOB_TYPE.ONLY_BATCHJOB
                        ) {
                            return d.data.batchjob;
                        } else if (
                            getBatchJobPageType() === BATCHJOB_TYPE.NO_BATCHJOB
                        ) {
                            return !d.data.batchjob;
                        } else {
                            return true;
                        }
                    })
                    .map(d => d.data.sid)
                    .filter(sid => sid !== -1);
            }
            return [selectedOne.data.sid];
        },
        batchJobPageType() {
            return getBatchJobPageType();
        },
    },
    actions: {
        updateMultiDomainFlag({ commit, state }, flag) {
            commit('_updateMultiDomainFlag', flag);
            if (state.selectedOne)
                commit('selectDomain', state.selectedOne.treeIndex);
        },
    },
};
