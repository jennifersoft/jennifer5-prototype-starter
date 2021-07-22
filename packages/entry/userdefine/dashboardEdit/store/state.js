import {
    INSERT_TYPE_ON_UI,
    TOPBAR_TYPES,
} from '@entry/userdefine/dashboardEdit/const';
import { i18n } from '@common/utility';

export const state = {
    title: i18n.get('ui.label.no.title'),
    groupId: undefined,
    dashboardKey: undefined,

    serverValues: {
        configLimitChartCount: 36,
        useJenniferFrontOnDashboard: false,
    },

    topbar: TOPBAR_TYPES.NONE,

    selectedInsertTypeOnUI: INSERT_TYPE_ON_UI.GENERAL,

    isShowWindowWhenUseToolType: false,
    isShowWindowWhenBaselineChartEdit: false,
    isShowWindowWhenActiveServiceListChartEdit: false,

    componentsAreaSize: {
        width: 0,
        height: 0,
    },
    messageWhenNeedSelect: undefined,

    components: {},

    defaultComponentPosition: {
        startx: 33.33,
        endx: 66.66,
        starty: 33.33,
        endy: 66.66,
    },

    editingComponentDataKey: undefined,

    editingChartOptions: {
        dataKey: undefined,
        toolType: undefined,
        chartType: undefined,
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
    },

    editingCellOptionOnScoreBoard: {
        cellIndex: undefined,
        left: undefined,
        top: undefined,
    },

    editingTextOptions: {
        dataKey: undefined,
        toolType: 'textbox',
        color: undefined,
        fontSize: undefined,
        textAlign: undefined,
        textVerticalAlign: undefined,
        content: undefined,
    },

    editingIframeOptions: {
        dataKey: undefined,
        toolType: 'iframe',
        url: undefined,
    },

    editingPluginOptions: {
        dataKey: undefined,
        toolType: 'plugin',
        url: undefined,
    },
};
