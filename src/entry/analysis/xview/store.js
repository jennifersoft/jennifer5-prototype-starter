import vuestore from '@vuejs/vuex/store';
import { startOfDayjs } from '@common/dayjsWrapper';
import { getDayjs } from '@common/base';
import { Business, Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { xSocket } from '@common/legacy/xSocket';
import { v4 as uuidv4 } from 'uuid';
import {
    ChartKeywordInObserver,
    XViewChartKeywordInObserver,
} from '@common/ObserverKeyword';
import { Observer } from '@common/legacy/Observer';
import { generateIP } from '@entry/analysis/xview/common';
import { OTypeDef, WebSocketCloseCode } from '@common/definition';
import { ID } from '@common/legacy/ID.js';
import {
    CHECK_COMPARE_TIME_WITH_CONDITION_ARRAY,
    CHECK_ERROR_CODE,
    CHECK_FIELD_EQUALS_WITH_CONDITION_ARRAY,
    CHECK_FIELD_INDEXOF_WITH_CONDITION_ARRAY,
    CHECK_FOCUS_TIME,
    CHECK_ID,
    CHECK_IP_LIST,
    CHECK_WHEN_SELECTED_INDEX_IN_TABLE,
    filterTransactions,
    filterTransactionsFlat,
    MAKE_IP_FILTER_LIST,
} from '@entry/analysis/xview/filter';
import { UIManager } from '@common/legacy/UIManager';
import {
    extractFieldsFromTransactionsGroupArray,
    makeDomainIdNOidNName,
    makeTransactionArrayFromResponse,
    makeTransactionGroup,
    MAX_XVIEW_UNIT_COUNT,
} from '@entry/analysis/xview/transaction';

let lastRenderTimeWhenFetch = Date.now();

vuestore.registerModule('xviewAnalysis', {
    namespaced: true,
    state: {
        searchedCondition: {
            chartKey: uuidv4(),
            time: {
                start: startOfDayjs(getDayjs(), 'date'),
                end: startOfDayjs(getDayjs(), 'date'),
            },
            oidList: {},
            nameList: {},
            otypeString: 'instance',
            minResponseTime: 0,
            advanced: {
                //트랜잭션 검색
                txid: undefined,
                applicationName: undefined,
                ip: undefined,
                userId: undefined,
                guid: undefined,

                //프로파일 검색
                method: undefined,
                sqlBoundParameter: undefined,
                externalCall: undefined,
                file: undefined,
                message: undefined,
                excludeBot: false,
                sql: undefined,
            },
        },
        lastSearchingTime: undefined,
        loadingData: false,
        loadingDataProgress: 1,
        rawTransactions: {},
        filterServiceNamesOnBar: [],
        filterIdsOnTopbar: [],
        filteredCondition: {
            showOnlyException: false,
            serviceName: [],
            excludeServiceName: [],
            ip: [],
            userId: [],
            guid: [],
            compareTime: [],
        },
        selectedIndexArray: [],
        //jui 'grid.xtable' 테이블의 컬럼 width, 설정한 컬럼값 반영을 위해 key를 사용함.
        tableKey: 0,
        tabDisabled: {
            clientId: true,
            application: true,
            guid: true,
            userId: true,
            clientIp: true,
        },

        isDragInteractionAboutPopup: true,

        resourceData: [
            { resourceType: 'instance', tree: [] },
            { resourceType: 'business', tree: [] },
        ],

        closeAdvancedSearchCondition: true,
        closeShareUrlWindow: true,
        closeLimitCountWindow: true,
        closeFilter: true,
        currentTab: 'transaction',
        currentView: 'chart',
        viewData: [
            {
                text: i18n.get('ui.label.view.application.chart'),
                value: 'application-n-chart',
            },
            { text: i18n.get('ui.label.view.chart'), value: 'chart' },

            { text: i18n.get('ui.label.view.table'), value: 'table' },
        ],
        yAxisInTransactionTab: 'elapsedTime',
        yAxisInGroupTab: 'averageElapsedTime',
        focusTimeStack: [],
    },
    getters: {
        tabData: (state, getters) => {
            return [
                {
                    key: 'transaction',
                    value: i18n.get('ui.label.transaction'),
                },
                {
                    key: 'clientId',
                    value: i18n.get('ui.label.clientId'),
                    disabled: state.tabDisabled.clientId,
                },
                {
                    key: 'application',
                    value: i18n.get('ui.label.application'),
                    disabled: state.tabDisabled.application,
                },
                {
                    key: 'guid',
                    value: i18n.get('ui.label.guid'),
                    disabled: state.tabDisabled.guid,
                },
                {
                    key: 'userId',
                    value: i18n.get('ui.label.userId'),
                    disabled: state.tabDisabled.userId,
                },
                {
                    key: 'clientIp',
                    value: i18n.get('ui.label.clientIp'),
                    disabled: state.tabDisabled.clientIp,
                },
            ];
        },
        pointCount: (state, getters) => {
            const currentTab = state.currentTab;
            if (currentTab === 'transaction')
                return getters.filteredTransactions.length;
            else if (currentTab === 'clientId')
                return getters.transactionsGroupByClientId.length;
            else if (currentTab === 'application')
                return getters.transactionsGroupByApplication.length;
            else if (currentTab === 'guid')
                return getters.transactionsGroupByGUID.length;
        },
        searchedIdNameList: state => {
            const otype =
                state.searchedCondition.otypeString === 'instance'
                    ? OTypeDef.SYSTEM
                    : OTypeDef.BUSINESS;
            return Object.keys(state.searchedCondition.oidList)
                .map(sid => {
                    return state.searchedCondition.oidList[sid].map(oid => {
                        return {
                            id: new ID(sid, otype, oid).toString(),
                            name: state.searchedCondition.nameList[sid][oid],
                        };
                    });
                })
                .flat();
        },
        filterFuncList: (state, getters) => {
            const funcList = [];
            [
                {
                    key: 'serviceName',
                    keyInTransaction: 'serviceName',
                    isExclude: false,
                },
                {
                    key: 'excludeServiceName',
                    keyInTransaction: 'serviceName',
                    isExclude: true,
                },
                {
                    key: 'userId',
                    keyInTransaction: 'userId',
                    isExclude: false,
                },
                {
                    key: 'guid',
                    keyInTransaction: 'guid',
                    isExclude: false,
                },
                {
                    key: 'ip',
                    keyInTransaction: 'ip',
                    isExclude: false,
                },

                {
                    key: 'compareTime',
                },
            ].forEach(({ key, keyInTransaction, isExclude }) => {
                const activeFilterList = state.filteredCondition[key].filter(
                    filter => filter.active === true
                );

                if (activeFilterList.length > 0) {
                    const filterFunction =
                        key === 'ip'
                            ? CHECK_IP_LIST(
                                  MAKE_IP_FILTER_LIST(
                                      activeFilterList.map(
                                          filter => filter.data
                                      )
                                  )
                              )
                            : key === 'compareTime'
                            ? CHECK_COMPARE_TIME_WITH_CONDITION_ARRAY(
                                  activeFilterList
                              )
                            : CHECK_FIELD_INDEXOF_WITH_CONDITION_ARRAY(
                                  keyInTransaction,
                                  activeFilterList.map(filter => filter.data),
                                  isExclude
                              );

                    funcList.push(filterFunction);
                }
            });

            if (state.filterIdsOnTopbar.length > 0) {
                funcList.push(CHECK_ID(state.filterIdsOnTopbar));
            }

            if (state.filteredCondition.showOnlyException) {
                funcList.push(CHECK_ERROR_CODE);
            }

            if (getters.focusTimeRange) {
                const { stime, etime } = getters.focusTimeRange;
                funcList.push(CHECK_FOCUS_TIME(stime, etime));
            }
            return funcList;
        },
        contentFilterFuncList: (state, getters) => {
            const filterFuncList = [...getters.filterFuncList];
            if (state.filterServiceNamesOnBar.length > 0) {
                filterFuncList.push(
                    CHECK_FIELD_EQUALS_WITH_CONDITION_ARRAY(
                        'serviceName',
                        state.filterServiceNamesOnBar
                    )
                );
            }

            return filterFuncList;
        },
        filteredUnitsBySid: (state, getters) => {
            const filterFuncList = getters.contentFilterFuncList;
            const result = filterTransactions(
                state.rawTransactions,
                filterFuncList
            );

            return Object.freeze(result);
        },

        filteredTransactions: (state, getters) => {
            const filterFuncList = getters.contentFilterFuncList;

            const result = filterTransactionsFlat(
                state.rawTransactions,
                filterFuncList
            );

            return Object.freeze(result);
        },

        viewDataByCurrentTab: state => {
            if (state.currentTab === 'transaction') return state.viewData;
            else if (
                state.currentTab === 'clientId' ||
                state.currentTab === 'guid'
            )
                return state.viewData.filter(item => item.value === 'chart');
            else if (state.currentTab === 'application')
                return state.viewData.filter(
                    item => item.value !== 'application-n-chart'
                );
            else if (
                state.currentTab === 'userId' ||
                state.currentTab === 'clientIp'
            )
                return state.viewData.filter(item => item.value === 'table');
            else {
                console.error(
                    `cannot support tab in xview => ${state.currentTab}`
                );
                return [];
            }
        },
        transactionsGroupByClientId: (state, getters) => {
            return makeTransactionGroup(
                getters.filteredTransactions,
                'wmonId',
                ['wmonId']
            );
        },
        transactionsGroupByApplication: (state, getters) => {
            return makeTransactionGroup(
                getters.filteredTransactions,
                'serviceHash',
                ['serviceHash', 'serviceName']
            );
        },
        transactionsGroupByApplicationWithoutFilterServiceNamesOnBar: (
            state,
            getters
        ) => {
            const filterFuncList = getters.filterFuncList;
            const filteredTransactions = Object.values(
                filterTransactions(state.rawTransactions, filterFuncList)
            ).flat();

            return makeTransactionGroup(filteredTransactions, 'serviceHash', [
                'serviceHash',
                'serviceName',
            ]);
        },
        transactionsGroupByUserId: (state, getters) => {
            return makeTransactionGroup(
                getters.filteredTransactions,
                'userId',
                ['userId']
            );
        },
        transactionsGroupByClientIp: (state, getters) => {
            return makeTransactionGroup(getters.filteredTransactions, 'ip', [
                'ip',
                'ipType',
            ]).map(transaction => {
                const ipaddr = generateIP(transaction.ip, transaction.ipType);
                return {
                    ...transaction,
                    ipaddr,
                };
            });
        },

        transactionsGroupByGUID: (state, getters) => {
            return makeTransactionGroup(getters.filteredTransactions, 'guid', [
                'guid',
            ]);
        },

        range: (state, getters) => {
            return (
                getters.startTimeNEndTime.etime -
                getters.startTimeNEndTime.stime
            );
        },
        endTime: (state, getters) => {
            return getters.startTimeNEndTime.etime;
        },
        startTimeNEndTime: (state, getters) => {
            return getters.focusTimeRange
                ? getters.focusTimeRange
                : {
                      stime: state.searchedCondition.time.start.valueOf(),
                      etime: state.searchedCondition.time.end.valueOf(),
                  };
        },

        focusTimeRange: state => {
            return state.focusTimeStack.length > 0
                ? Object.assign(
                      {},
                      state.focusTimeStack[state.focusTimeStack.length - 1]
                  )
                : undefined;
        },
        domainIdNOidNNameAbountInstance: state => {
            return makeDomainIdNOidNName(state.resourceData[0]?.tree);
        },
        domainIdNOidNNameAbountBusiness: state => {
            return makeDomainIdNOidNName(state.resourceData[1]?.tree);
        },
    },
    mutations: {
        tabDisableByCaculateCount: state => {
            state.tabDisabled.clientId = true;
            state.tabDisabled.application = true;
            state.tabDisabled.guid = true;
            state.tabDisabled.userId = true;
            state.tabDisabled.clientIp = true;
        },

        increaseTableKey: state => {
            state.tableKey = state.tableKey + 1;
        },

        searchingTime: (state, time) => {
            state.lastSearchingTime = time;
        },

        selectIndexInTable: (state, selectIndex) => {
            const foundIndex = state.selectedIndexArray.findIndex(
                index => index === selectIndex
            );

            foundIndex > -1
                ? state.selectedIndexArray.splice(foundIndex, 1)
                : state.selectedIndexArray.push(selectIndex);

            state.selectedIndexArray.sort((a, b) => a - b);
        },
        clearSelectIndexInTable: state => {
            state.selectedIndexArray = [];
        },
        updateAdvancedSearchCondition: (state, conditions) => {
            state.searchedCondition.advanced = {
                ...conditions,
            };
        },
        updateStartTimeInSearchedCondition: (state, start) => {
            state.searchedCondition = {
                ...state.searchedCondition,
                time: {
                    ...state.searchedCondition.time,
                    start,
                },
            };
        },
        updateEndTimeInSearchedCondition: (state, end) => {
            state.searchedCondition = {
                ...state.searchedCondition,
                time: {
                    ...state.searchedCondition.time,
                    end,
                },
            };
        },

        updateResourceData: (state, resources) => {
            state.resourceData = resources;
        },
        updateMinResponseTimeInSearchedCondition: (state, minResponseTime) => {
            state.searchedCondition = {
                ...state.searchedCondition,
                minResponseTime,
            };
        },
        appendTransactions: (state, { domainId, rawTransactions }) => {
            const rawTransactionsByDomainId = {};
            rawTransactionsByDomainId[domainId] = state.rawTransactions[
                domainId
            ]
                ? state.rawTransactions[domainId].concat(rawTransactions)
                : rawTransactions;

            state.rawTransactions = Object.freeze({
                ...state.rawTransactions,
                ...rawTransactionsByDomainId,
            });
        },
        clearTransactions: state => {
            state.rawTransactions = [];
        },

        updateYAxisInTransactionTab: (state, { value }) => {
            state.yAxisInTransactionTab = value;
            Observer.emit(
                ChartKeywordInObserver.RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE
            );
        },
        updateYAxisInGroupTab: (state, { value }) => {
            state.yAxisInGroupTab = value;
            Observer.emit(
                ChartKeywordInObserver.RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE
            );
        },

        toggleFilterUI: state => {
            state.closeFilter = !state.closeFilter;
        },
        closeFilterUI: state => {
            state.closeFilter = true;
        },

        toggleDragInteraction: state => {
            state.isDragInteractionAboutPopup = !state.isDragInteractionAboutPopup;
        },

        appendFocusTimeStack: (state, focusTime) => {
            state.focusTimeStack.push(focusTime);
        },

        popFocusTimeStack: state => {
            state.focusTimeStack.pop();
        },

        clearFocusTimeStack: state => {
            state.focusTimeStack = [];
        },
        openAdvancedSearchCondition: state => {
            state.closeAdvancedSearchCondition = false;
        },
        closeAdvancedSearchCondition: state => {
            state.closeAdvancedSearchCondition = true;
        },
        openLimitCountWindow: state => {
            state.closeLimitCountWindow = false;
        },
        closeLimitCountWindow: state => {
            state.closeLimitCountWindow = true;
        },
        openShareUrlWindow: state => {
            state.closeShareUrlWindow = false;
        },
        closeShareUrlWindow: state => {
            state.closeShareUrlWindow = true;
        },
        calculateProgress: (state, { domainId, collectTime }) => {
            const sidList = Object.keys(state.searchedCondition.oidList);
            const index = sidList.findIndex(sid => sid === String(domainId));
            const ratioInDomainUnit = index / sidList.length;

            const stime = state.searchedCondition.time.start.valueOf();
            const etime = state.searchedCondition.time.end.valueOf();

            const ratioInTime =
                (collectTime - stime) / (etime - stime) / sidList.length;

            state.loadingDataProgress = ratioInDomainUnit + ratioInTime;
        },
    },
    actions: {
        tabEnableByCaculateCount: ({ state, getters }) => {
            state.tabDisabled.clientId =
                getters.transactionsGroupByClientId.length === 0;
            state.tabDisabled.application =
                getters.transactionsGroupByApplication.length === 0;
            state.tabDisabled.guid =
                getters.transactionsGroupByGUID.length === 0;
            state.tabDisabled.userId =
                getters.transactionsGroupByUserId.length === 0;
            state.tabDisabled.clientIp =
                getters.transactionsGroupByClientIp.length === 0;
        },

        popupFromTable: ({ state, getters, dispatch }) => {
            const selectedIndexArray = state.selectedIndexArray;
            const filterFunc = CHECK_WHEN_SELECTED_INDEX_IN_TABLE(
                selectedIndexArray
            );
            return dispatch('popup', { filterFunc });
        },

        popup: (
            { state, getters },
            { filterFunc, dragStartTime, dragEndTime }
        ) => {
            const currentTab = state.currentTab;
            const startTime = dragStartTime ?? getters.startTimeNEndTime.stime;
            const endTime = dragEndTime ?? getters.startTimeNEndTime.etime;
            const chartKey = state.searchedCondition.chartKey;

            if (currentTab === 'transaction') {
                const transactions = getters.filteredTransactions.filter(
                    (item, index) => filterFunc.call(this, item, index)
                );
                const txidsBySid = transactions.reduce((acc, transaction) => {
                    const sid = transaction.sid;
                    const txid = transaction.txid;
                    acc[sid] = acc[sid] ?? [];
                    acc[sid].push(txid);
                    return acc;
                }, {});

                if (Object.keys(txidsBySid).length > 0) {
                    UIManager.getXViewPointListForMultiDomain(
                        txidsBySid,
                        startTime,
                        endTime,
                        undefined,
                        chartKey
                    );
                }
            } else if (currentTab === 'clientId') {
                const transactionsGroupArray = getters.transactionsGroupByClientId.filter(
                    (item, index) => filterFunc.call(this, item, index)
                );
                if (transactionsGroupArray.length > 0) {
                    const {
                        wmonIdList = [],
                        txidsList = [],
                        startTimes = [],
                        lastTimes = [],
                    } = extractFieldsFromTransactionsGroupArray(
                        transactionsGroupArray
                    );

                    UIManager.getXViewCLIENTIDPointList(
                        wmonIdList,
                        txidsList,
                        startTimes,
                        lastTimes,
                        startTime,
                        endTime
                    );
                }
            } else if (currentTab === 'application') {
                const transactionsGroupArray = getters.transactionsGroupByApplication.filter(
                    (item, index) => filterFunc.call(this, item, index)
                );

                if (transactionsGroupArray.length > 0) {
                    const {
                        serviceHashList = [],
                        serviceNameList = [],
                        txidsList = [],
                        avgResTimes = [],
                        recentResTimes = [],
                        maxResTimes = [],
                        startTimes = [],
                        lastTimes = [],
                        sqlTimes = [],
                        fetchTimes = [],
                        cpuTimes = [],
                        errorCounts = [],
                    } = extractFieldsFromTransactionsGroupArray(
                        transactionsGroupArray
                    );

                    UIManager.getXViewAppPointList(
                        serviceHashList,
                        serviceNameList,
                        txidsList,
                        avgResTimes,
                        recentResTimes,
                        maxResTimes,
                        startTimes,
                        lastTimes,
                        sqlTimes,
                        cpuTimes,
                        fetchTimes,
                        errorCounts,
                        startTime,
                        endTime
                    );
                }
            } else if (currentTab === 'guid') {
                const transactionsGroupArray = getters.transactionsGroupByGUID.filter(
                    (item, index) => filterFunc.call(this, item, index)
                );

                if (transactionsGroupArray.length > 0) {
                    const {
                        guidsList = [],
                        txidsList = [],
                        avgResTimes = [],
                        recentResTimes = [],
                        maxResTimes = [],
                        startTimes = [],
                        lastTimes = [],
                    } = extractFieldsFromTransactionsGroupArray(
                        transactionsGroupArray
                    );

                    UIManager.getXViewGUIDPointList(
                        guidsList,
                        txidsList,
                        avgResTimes,
                        recentResTimes,
                        maxResTimes,
                        startTimes,
                        lastTimes,
                        startTime,
                        endTime
                    );
                }
            } else if (currentTab === 'userId') {
                const transactionsGroupArray = getters.transactionsGroupByUserId.filter(
                    (item, index) => filterFunc.call(this, item, index)
                );

                if (transactionsGroupArray.length > 0) {
                    const {
                        userIdsList = [],
                        txidsList = [],
                        avgResTimes = [],
                        recentResTimes = [],
                        maxResTimes = [],
                        startTimes = [],
                        lastTimes = [],
                    } = extractFieldsFromTransactionsGroupArray(
                        transactionsGroupArray
                    );

                    UIManager.getXViewUserPointList(
                        userIdsList,
                        txidsList,
                        avgResTimes,
                        recentResTimes,
                        maxResTimes,
                        startTimes,
                        lastTimes,
                        startTime,
                        endTime
                    );
                }
            } else if (currentTab === 'clientIp') {
                const transactionsGroupArray = getters.transactionsGroupByClientIp.filter(
                    (item, index) => filterFunc.call(this, item, index)
                );

                if (transactionsGroupArray.length > 0) {
                    const {
                        clientIPList = [],
                        txidsList = [],
                        avgResTimes = [],
                        recentResTimes = [],
                        maxResTimes = [],
                        startTimes = [],
                        lastTimes = [],
                    } = extractFieldsFromTransactionsGroupArray(
                        transactionsGroupArray
                    );

                    UIManager.getXViewCLIENTIPPointList(
                        clientIPList,
                        txidsList,
                        avgResTimes,
                        recentResTimes,
                        maxResTimes,
                        startTimes,
                        lastTimes,
                        startTime,
                        endTime
                    );
                }
            }
        },
        updateResourceInSearchedCondition: (
            { state, getters },
            { oidList, otypeString }
        ) => {
            const domainIdNOidNName =
                otypeString === 'instance'
                    ? getters.domainIdNOidNNameAbountInstance
                    : getters.domainIdNOidNNameAbountBusiness;

            const nameList = {};
            Object.keys(oidList).forEach(sid => {
                nameList[sid] = {};
                oidList[sid].forEach(oid => {
                    nameList[sid][oid] = domainIdNOidNName[sid]?.[oid];
                });
            });

            state.searchedCondition = {
                ...state.searchedCondition,
                oidList,
                nameList,
                otypeString,
            };
        },
        deleteAllFilterList: ({ state, commit, dispatch }) => {
            state.filteredCondition.serviceName = [];
            state.filteredCondition.excludeServiceName = [];
            state.filteredCondition.ip = [];
            state.filteredCondition.userId = [];
            state.filteredCondition.guid = [];
            state.filteredCondition.compareTime = [];
            commit('increaseTableKey');
            return dispatch('requestChartRenderWhenChartView');
        },
        appendFilter: (
            { state, commit, dispatch },
            { type, value, standardTime, inequality }
        ) => {
            const filter = {
                key: uuidv4(),
                data: value,
                standardTime: standardTime,
                inequality: inequality,
                active: true,
            };
            state.filteredCondition[type].push(filter);
            commit('increaseTableKey');
            return dispatch('requestChartRenderWhenChartView');
        },
        toggleFilter: ({ state, commit, dispatch }, { type, key }) => {
            const filter = state.filteredCondition[type].find(
                filter => filter.key === key
            );
            filter.active = !filter.active;
            commit('increaseTableKey');
            return dispatch('requestChartRenderWhenChartView');
        },
        removeFilter: ({ state, commit, dispatch }, { type, key }) => {
            const removeIndex = state.filteredCondition[type].findIndex(
                filter => filter.key === key
            );
            state.filteredCondition[type].splice(removeIndex, 1);
            commit('increaseTableKey');
            return dispatch('requestChartRenderWhenChartView');
        },
        updateShowOnlyExceptionInFilter: (
            { state, commit, dispatch },
            showOnlyException
        ) => {
            state.filteredCondition.showOnlyException = showOnlyException;
            commit('increaseTableKey');
            return dispatch('requestChartRenderWhenChartView');
        },
        toggleFilterIdOnTopbar: ({ state, dispatch }, id) => {
            const index = state.filterIdsOnTopbar.indexOf(id);
            index > -1
                ? state.filterIdsOnTopbar.splice(index, 1)
                : state.filterIdsOnTopbar.push(id);
            return dispatch('requestChartRenderWhenChartView');
        },
        clearFilterIdsOnTopbar: ({ state, dispatch }) => {
            state.filterIdsOnTopbar = [];
            return dispatch('requestChartRenderWhenChartView');
        },
        toggleFilterServiceNameOnBar: ({ state, dispatch }, serviceName) => {
            const index = state.filterServiceNamesOnBar.indexOf(serviceName);
            index > -1
                ? state.filterServiceNamesOnBar.splice(index, 1)
                : (state.filterServiceNamesOnBar = [serviceName]);

            return dispatch('requestChartRenderWhenChartView');
        },
        clearFilterServiceNameOnBar: ({ state, dispatch }) => {
            state.filterServiceNamesOnBar = [];
            return dispatch('requestChartRenderWhenChartView');
        },
        appendFocusTimeStack: ({ state, commit, dispatch }, focusTime) => {
            commit('appendFocusTimeStack', focusTime);
            state.isDragInteractionAboutPopup = true;
            return dispatch('focusOnOrOut');
        },
        popFocusTimeStack: ({ commit, dispatch }) => {
            commit('popFocusTimeStack');
            return dispatch('focusOnOrOut');
        },
        clearFocusTimeStack: ({ commit, dispatch }) => {
            commit('clearFocusTimeStack');
            return dispatch('focusOnOrOut');
        },
        focusOnOrOut({ state, getters }) {
            const { stime, etime } = getters.startTimeNEndTime;
            const chartKey = state.searchedCondition.chartKey;
            Observer.emit(
                XViewChartKeywordInObserver.FUCUS_ON_XVIEW_CHART_WITH_CHARTKEY(
                    chartKey
                ),
                [stime, etime]
            );
            Observer.emit(
                ChartKeywordInObserver.RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE
            );
        },

        fetchTransaction({ state, getters, commit, dispatch }) {
            commit('tabDisableByCaculateCount');

            const oidList = state.searchedCondition.oidList;
            const commonCMD = {
                isAnalysisXview: true,
                key: state.searchedCondition.chartKey,
                stime: state.searchedCondition.time.start.valueOf(),
                etime: state.searchedCondition.time.end.valueOf(),
                isPreviousData: false,
                minResponseTime: state.searchedCondition.minResponseTime,
                //고급 검색 조건
                searchCondition: {
                    ...state.searchedCondition.advanced,
                },
            };
            const otypeString = state.searchedCondition.otypeString;
            const cmdList = Object.keys(oidList).map(domainId => {
                const oidStringNArray = {};
                oidStringNArray[otypeString] = oidList[domainId];
                const newValues = {
                    sid: Number(domainId),
                    oid: oidStringNArray,
                    requestKey: uuidv4(),
                };
                return {
                    ...commonCMD,
                    ...newValues,
                };
            });

            const bigdataWS = new xSocket('/ws/bigdata');
            bigdataWS.onOpenCallback = () => {
                state.loadingData = true;
                state.loadingDataProgress = 0;
                bigdataWS.socket.binaryType = 'arraybuffer';

                nextDomainReqest();
            };
            bigdataWS.onCloseCallback = () => {
                state.loadingData = false;
                state.loadingDataProgress = 1;
                console.log('onCloseCallback');
            };
            bigdataWS.onMessageCallback = e => {
                if (e.data instanceof ArrayBuffer) {
                    var buffer = e.data,
                        dataView = new DataView(buffer),
                        chartKeyLength = dataView.getInt16(0),
                        chartKey = dataView.getString(2, chartKeyLength),
                        chartKeyOffset = 2 + chartKeyLength;

                    var requestKeyLength = dataView.getInt16(chartKeyOffset),
                        requestKey = dataView.getString(
                            2 + chartKeyOffset,
                            requestKeyLength
                        );

                    var keyOffset = chartKeyOffset + 2 + requestKeyLength,
                        sid = dataView.getInt16(keyOffset),
                        isNext = Boolean(
                            dataView.getInt8(keyOffset + 2)
                        ).valueOf(),
                        isPreviousData = Boolean(
                            dataView.getInt8(keyOffset + 3)
                        ).valueOf(),
                        count = dataView.getInt32(keyOffset + 4),
                        searchingTime = dataView.getFloat64(keyOffset + 8),
                        xviewCacheDone = Boolean(
                            dataView.getInt8(keyOffset + 16)
                        ).valueOf();

                    const dataFirstOffset = keyOffset + 17;
                    const transactionArray = makeTransactionArrayFromResponse(
                        dataView,
                        dataFirstOffset,
                        sid,
                        count
                    );

                    const totalCount = Object.values(
                        state.rawTransactions
                    ).reduce((count, arr) => {
                        count += arr.length;
                        return count;
                    }, 0);
                    if (totalCount >= MAX_XVIEW_UNIT_COUNT) {
                        Observer.emit(
                            XViewChartKeywordInObserver.END_XVIEW_ANALYSIS
                        );
                        commit('openLimitCountWindow');
                        return;
                    }

                    commit('searchingTime', searchingTime);
                    if (transactionArray.length > 0) {
                        commit('appendTransactions', {
                            domainId: sid,
                            rawTransactions: transactionArray,
                        });

                        commit('calculateProgress', {
                            domainId: sid,
                            collectTime: transactionArray[0].collectTime,
                        });
                    }

                    const interval = Math.ceil(totalCount * 0.01);
                    if (isNext === false) {
                        nextDomainReqest();
                    } else {
                        dispatch('requestRenderWhenFetch', interval);
                    }
                }
            };
            bigdataWS.init();

            const nextDomainReqest = () => {
                const cmd = cmdList.shift();
                if (cmd) {
                    console.log('request ' + cmd.sid);
                    bigdataWS.send(JSON.stringify(cmd));
                } else {
                    console.log('request socket close');
                    Observer.emit(
                        XViewChartKeywordInObserver.END_XVIEW_ANALYSIS
                    );
                }
            };

            Observer.on(XViewChartKeywordInObserver.END_XVIEW_ANALYSIS, () => {
                bigdataWS.socket.close(WebSocketCloseCode.ARIES_NORMAL);
                commit('increaseTableKey');
                commit('searchingTime', undefined);
                dispatch('tabEnableByCaculateCount');
            });
        },
        async fetchResource({ commit, state }, sidList) {
            const { start, end } = state.searchedCondition.time;

            const res = await Instance.get(
                sidList,
                start.valueOf(),
                end.valueOf()
            );
            const n = normalizeOidConfigResponse(res, 'instance');
            const res2 = await Business.get(
                sidList,
                start.valueOf(),
                end.valueOf()
            );
            const n2 = normalizeOidConfigResponse(res2, 'business');

            commit('updateResourceData', [
                {
                    resourceType: 'instance',
                    tree: Array.from(n),
                },
                {
                    resourceType: 'business',
                    tree: Array.from(n2),
                },
            ]);
        },
        updateCurrentTab: async ({ state, getters, commit, dispatch }, tab) => {
            state.currentTab = tab;

            commit('clearSelectIndexInTable');
            await dispatch(
                'updateCurrentView',
                getters.viewDataByCurrentTab[0]
            );

            return dispatch('requestChartRenderWhenChartView');
        },

        updateCurrentView: ({ state, commit, dispatch }, { value }) => {
            state.currentView = value;
            commit('clearSelectIndexInTable');
            return dispatch('requestChartRenderWhenChartView');
        },
        requestRenderWhenFetch: ({ state, dispatch }, timeout) => {
            if (
                state.currentView === 'chart' ||
                state.currentView === 'application-n-chart'
            ) {
                if (lastRenderTimeWhenFetch + timeout < Date.now()) {
                    lastRenderTimeWhenFetch = Date.now();
                    Observer.emit(
                        ChartKeywordInObserver.RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE
                    );
                }
            }
        },

        requestChartRenderWhenChartView: ({ state, dispatch }) => {
            if (
                state.currentView === 'chart' ||
                state.currentView === 'application-n-chart'
            ) {
                Observer.emit(
                    ChartKeywordInObserver.RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE
                );
            }
        },
    },
});

export default vuestore;
