import Vue from 'vue';

export const mutations = {
    setTitle: (state, title) => {
        state.title = title;
    },

    setGroupId: (state, groupId) => {
        state.groupId = groupId;
    },

    setDashboardKey: (state, dashboardKey) => {
        state.dashboardKey = dashboardKey;
    },

    configureServerValues: (state, data) => {
        state.serverValues = data;
    },

    configureTopbar: (state, type) => {
        state.topbar = type;
    },

    emitInsertTypeOnUI: (state, insertTypeOnUI) => {
        state.selectedInsertTypeOnUI = insertTypeOnUI;
    },

    setTargetTypeOnEditingChart: (state, data) => {
        state.editingChartOptions.otype = data.otype;
        state.editingChartOptions.targetType = data.targetType;
    },

    setTargetOnEditingChart: (state, data) => {
        state.editingChartOptions.sid = data.sid;
        state.editingChartOptions.oid = data.oid;
        state.editingChartOptions.otype = data.otype;
        state.editingChartOptions.targetType = data.targetType;
    },

    setChartTypeOnEditingChart: (state, charttype) => {
        state.editingChartOptions.chartType = charttype;
        state.editingChartOptions.charttype = charttype;
    },

    setMetricsOnEditingChart: (state, metrics) => {
        state.editingChartOptions.metrics = metrics;
    },

    setMetricsFromJenniferFrontOnEditingChart: (state, metrics) => {
        state.editingChartOptions.metricsFromJenniferFront = metrics;
    },

    setExternalChartTypeOnEditingChart: (state, externalChartType) => {
        state.editingChartOptions.externalChartType = externalChartType;
    },

    setEditingChart: (state, dataKey) => {
        const componentOptions = state.components[dataKey];

        state.editingComponentDataKey = dataKey;
        state.editingChartOptions = Object.assign({ ...componentOptions });
    },

    setEditingTextbox: (state, dataKey) => {
        const componentOptions = state.components[dataKey];

        state.editingComponentDataKey = dataKey;
        state.editingTextOptions = Object.assign({ ...componentOptions });
    },

    setEditingIframe: (state, dataKey) => {
        const componentOptions = state.components[dataKey];

        state.editingComponentDataKey = dataKey;
        state.editingIframeOptions = Object.assign({ ...componentOptions });
    },

    setEditingPlugin: (state, dataKey) => {
        const componentOptions = state.components[dataKey];

        state.editingComponentDataKey = dataKey;
        state.editingPluginOptions = Object.assign({ ...componentOptions });
    },

    clearEditingComponentDataKey: state => {
        state.editingComponentDataKey = undefined;
    },

    clearAllOnEditingChart: state => {
        state.editingChartOptions = {
            dataKey: undefined,
            toolType: undefined,
            charttype: undefined,
            domainBarSync: false,
            title: '',
            targetType: 'instance',
            sid: [],
            oid: [],
            metrics: undefined,
            metricsFromJenniferFront: undefined,
            otype: undefined,
            ptype: undefined,
            pkey: undefined,
            externalChartType: undefined,
            perspective: undefined,
            contentFontSize: undefined,
            minElapsedSec: undefined,
            columns: undefined,
            viewpoint: undefined,
            fixedmax: undefined,
            rowcount: 1,
            columncount: 1,
            cellConfigureArray: undefined,
            isDivideByDomain: false,
            showDomainNameInSpeedMeter: false,
            showInstanceNameInSpeedMeter: false,
            dateConditionList: undefined,
            labelDateConditionList: undefined,
        };
    },

    clearAllOnEditingText: state => {
        state.editingTextOptions = {
            dataKey: undefined,
            toolType: 'textbox',
            color: undefined,
            fontSize: undefined,
            textAlign: undefined,
            textVerticalAlign: undefined,
            content: undefined,
        };
    },

    setTopbarSyncOnEditingChart: (state, domainBarSync) => {
        state.editingChartOptions.domainBarSync = domainBarSync;
    },

    setChartTitleOnEditingChart: (state, title) => {
        state.editingChartOptions.title = title;
    },

    setComponent: (state, componentOption) => {
        //FIXME 대시보드 로드에서 대소문자 구분이 안되서 이렇게 예외처리.
        // componentOption.domainBarSync = componentOption.domainBarSync || componentOption.topBarSync;
        componentOption.charttype =
            componentOption.charttype || componentOption.chartType;
        componentOption.chartType =
            componentOption.charttype || componentOption.chartType;
        componentOption.tooltype = componentOption.toolType;

        Vue.set(state.components, componentOption.dataKey, componentOption);
    },

    removeComponent: (state, dataKey) => {
        Vue.delete(state.components, dataKey);
    },

    initComponents: state => {
        state.components = {};
    },

    setPTypeOnEditingChart: (state, ptype) => {
        state.editingChartOptions.ptype = ptype;
    },

    setPKeyOnEditingChart: (state, pkey) => {
        state.editingChartOptions.pkey = pkey;
    },

    setPerspectiveOnEditingChart: (state, perspective) => {
        state.editingChartOptions.perspective = perspective;
    },

    setFontSizeOnEditingChart: (state, contentFontSize) => {
        state.editingChartOptions.contentFontSize = contentFontSize;
    },

    setMinElapsedSecOnEditingChart: (state, minElapsedSec) => {
        state.editingChartOptions.minElapsedSec = minElapsedSec;
    },

    toggleIsDivideByDomainOnEditingChart: state => {
        state.editingChartOptions.isDivideByDomain = !state.editingChartOptions
            .isDivideByDomain;
    },

    toggleShowDomainNameInSpeedMeterOnEditingChart: state => {
        state.editingChartOptions.showDomainNameInSpeedMeter = !state
            .editingChartOptions.showDomainNameInSpeedMeter;
    },

    toggleShowInstanceNameInSpeedMeterOnEditingChart: state => {
        state.editingChartOptions.showInstanceNameInSpeedMeter = !state
            .editingChartOptions.showInstanceNameInSpeedMeter;
    },

    configureBaselineConditionOnEditingChart: (state, data) => {
        state.editingChartOptions.dateConditionList = data.dateConditionList;
        state.editingChartOptions.labelDateConditionList =
            data.labelDateConditionList;

        Vue.set(
            state.components,
            state.editingChartOptions.dataKey,
            state.editingChartOptions
        );
    },

    setRowCountOnEditingChart: (state, rowcount) => {
        state.editingChartOptions.rowcount = rowcount;

        state.editingChartOptions.cellConfigureArray = new Array(
            state.editingChartOptions.rowcount *
                state.editingChartOptions.columncount
        );
    },

    setColumnCountOnEditingChart: (state, columncount) => {
        state.editingChartOptions.columncount = columncount;

        state.editingChartOptions.cellConfigureArray = new Array(
            state.editingChartOptions.rowcount *
                state.editingChartOptions.columncount
        );
    },

    setColumnsOnEditingChart: (state, columns) => {
        state.editingChartOptions.columns = columns;
    },

    setViewpointOnEditingChart: (state, viewpoint) => {
        state.editingChartOptions.viewpoint = viewpoint;
    },

    setFixedmaxOnEditingChart: (state, fixedmax) => {
        state.editingChartOptions.fixedmax = fixedmax;
    },

    setEditingCellOptionOnScoreBoard: (state, cellOptions) => {
        state.editingCellOptionOnScoreBoard.cellIndex = cellOptions.cellIndex;
        state.editingCellOptionOnScoreBoard.left = cellOptions.left;
        state.editingCellOptionOnScoreBoard.top = cellOptions.top;
    },

    nonSelectEditingCellOptionOnScoreBoard: state => {
        state.editingCellOptionOnScoreBoard.cellIndex = undefined;
        state.editingCellOptionOnScoreBoard.left = undefined;
        state.editingCellOptionOnScoreBoard.top = undefined;
    },

    setCellOptionOnScoreBoard: (state, cellOptions) => {
        const chartOptions =
            state.components[state.editingChartOptions.dataKey];
        const cellIndex = state.editingCellOptionOnScoreBoard.cellIndex;

        if (chartOptions.cellConfigureArray === undefined)
            chartOptions.cellConfigureArray = new Array(
                chartOptions.rowcount * chartOptions.columncount
            );
        chartOptions.cellConfigureArray[cellIndex] = cellOptions;

        Vue.set(state.components, chartOptions.dataKey, chartOptions);
    },

    emitShowWindowWhenUseToolType: (state, isShow) => {
        state.isShowWindowWhenUseToolType = isShow;
    },

    emitShowWindowWhenBaselineChartEdit: (state, isShow) => {
        state.isShowWindowWhenBaselineChartEdit = isShow;
    },

    emitShowWindowWhenActiveServiceListChartEdit: (state, isShow) => {
        state.isShowWindowWhenActiveServiceListChartEdit = isShow;
    },

    setComponentsAreaSize: (state, componentsAreaSize) => {
        state.componentsAreaSize = componentsAreaSize;
    },

    setContentOnTextbox: (state, content) => {
        state.editingTextOptions.content = content;
    },

    setFontSizeOnTextbox: (state, size) => {
        state.editingTextOptions.fontSize = size;
    },

    setColorOnTextbox: (state, color) => {
        state.editingTextOptions.color = color;
    },

    setAlignTypeOnTextbox: (state, textAlign) => {
        state.editingTextOptions.textAlign = textAlign;
    },

    setVerticalAlignTypeOnTextbox: (state, textVerticalAlign) => {
        state.editingTextOptions.textVerticalAlign = textVerticalAlign;
    },

    setIframeURL: (state, url) => {
        state.editingIframeOptions.url = url;
    },

    setPluginURL: (state, url) => {
        state.editingPluginOptions.url = url;
    },

    showCheckWindowWithMessage: (state, message) => {
        state.messageWhenNeedSelect = message;
    },
};
