import { ID } from '@common/legacy/ID';
import { gcCommitAgent } from '@entry/userdefine/dashboard/http';
import { Observer } from '@common/legacy/Observer';
import {
    ChartKeywordInObserver,
    XViewChartKeywordInObserver,
} from '@common/ObserverKeyword';

export default {
    namespaced: true,
    state: {
        originOrExtendInChartPosition: undefined,
        title: '',
        topbar: undefined,
        groupId: undefined,
        dashboardKey: undefined,
        components: [],

        gcContextMenu: {
            position: undefined,
            instanceList: [],
            keys: [],
        },
        searchConditionInXView: {
            otype: undefined,
            oidsBySid: undefined,
            minResponseTime: undefined,
            advanceSearchCondition: undefined,
            startTime: undefined,
            endTime: undefined,
        },
    },
    mutations: {
        configureSearchConditionInXView: (
            state,
            {
                otype,
                oidsBySid,
                minResponseTime,
                advanceSearchCondition,
                startTime,
                endTime,
            }
        ) => {
            state.searchConditionInXView.otype = otype;
            state.searchConditionInXView.oidsBySid = oidsBySid;
            state.searchConditionInXView.minResponseTime = minResponseTime;
            state.searchConditionInXView.advanceSearchCondition = advanceSearchCondition;
            state.searchConditionInXView.startTime = startTime;
            state.searchConditionInXView.endTime = endTime;
        },

        setGcContextMenu: (state, { position, instanceList, keys }) => {
            state.gcContextMenu.position = position;
            state.gcContextMenu.instanceList = instanceList;
            state.gcContextMenu.keys = keys;
        },
        clearGcContextMenu: state => {
            state.gcContextMenu.instanceList = [];
            state.gcContextMenu.keys = [];
            state.gcContextMenu.position = undefined;
        },

        setOriginOrExtendInChartPosition: (state, originOrExtend) => {
            state.originOrExtendInChartPosition = originOrExtend;
        },

        setTitle: (state, title) => {
            state.title = title;
        },

        setTopbar: (state, topbar) => {
            state.topbar = topbar;
        },

        setDashboardKey: (state, dashboardKey) => {
            state.dashboardKey = dashboardKey;
        },

        setComponents: (state, components) => {
            state.components = components;
        },
    },
    getters: {
        gcContextMenuPosition: state => {
            return state.gcContextMenu.position;
        },

        chartComponents: state => {
            return Object.values(state.components).filter(
                component => component.charttype !== undefined
            );
        },

        textComponents: state => {
            return Object.values(state.components).filter(
                component => component.toolType === 'textbox'
            );
        },

        iframeComponents: state => {
            return Object.values(state.components).filter(
                component =>
                    component.toolType === 'iframe' ||
                    component.toolType === 'plugin'
            );
        },
    },
    actions: {
        gcCommit: ({ state, commit }, index) => {
            const id = ID.parse(state.gcContextMenu.keys[index]);
            const params = {
                sid: id.sid,
                agent: id.oid,
            };

            gcCommitAgent(params).then(r =>
                console.log(
                    `gc commit => sid: ${params.sid}, oid : ${params.agent}`
                )
            );

            commit('clearGcContextMenu');
        },
        updateYAxisInXView: ({ state }, { chartKey, yAxisType }) => {
            const xviewCharts = Observer.get(
                ChartKeywordInObserver.BIGDATA_CHARTS_OBJECT
            );

            xviewCharts[chartKey].renderer.setViewPoint(yAxisType);
        },

        updateAutoMaxYAxisInXView: ({ state }, { chartKey, useAutoMax }) => {
            const xviewCharts = Observer.get(
                ChartKeywordInObserver.BIGDATA_CHARTS_OBJECT
            );

            xviewCharts[chartKey].updateAutoMax(useAutoMax);
        },

        showOnlyErrorInXView: ({ state }, { chartKey, showOnly }) => {
            Observer.emit(
                XViewChartKeywordInObserver.SHOW_ONLY_ERROR_IN_XVIEW_WITH_CHARTKEY(
                    chartKey
                ),
                [showOnly]
            );
        },

        showOnlyAsyncInXView: ({ state }, { chartKey, showOnly }) => {
            Observer.emit(
                XViewChartKeywordInObserver.SHOW_ONLY_ASYNC_IN_XVIEW_WITH_CHARTKEY(
                    chartKey
                ),
                [showOnly]
            );
        },
        showOnlyTransactionInXView: ({ state }, { chartKey, showOnly }) => {
            Observer.emit(
                XViewChartKeywordInObserver.SHOW_ONLY_TRANSACTION_IN_XVIEW_WITH_CHARTKEY(
                    chartKey
                ),
                [showOnly]
            );
        },
        showDeployInXView: ({ state }, { chartKey, showDeploy }) => {
            const xviewCharts = Observer.get(
                ChartKeywordInObserver.BIGDATA_CHARTS_OBJECT
            );

            xviewCharts[chartKey].model.deployData.show = showDeploy;
        },
    },
};
