import {
    deleteDashboard,
    saveDashboard,
} from '@entry/userdefine/dashboardEdit/http';
import { GenerateKey } from '@module/global/GenerateKey';
import {
    CUSTOM_CHART_TYPE,
    INSERT_TYPE_ON_UI,
    TOPBAR_TYPES,
} from '@entry/userdefine/dashboardEdit/const';
import { ExternalChartType } from '@module/chart/external/ExternalChartType';
import { saveThumbnail } from '@entry/userdefine/dashboardEdit/thumbnail';
import { ariesuser, getServerTime } from '@common/base';

export const actions = {
    getRedirectURLAfterSaveDashboard: async context => {
        const dashboardProp = {};
        dashboardProp.title = context.state.title;
        dashboardProp.charts = Object.values(context.state.components);

        if (context.state.topbar === TOPBAR_TYPES.DOMAIN_INSTANCE_SINGLE) {
            dashboardProp.domainBar = {};
            dashboardProp.domainBar.type = 'agent';
            dashboardProp.domainBar.multi = false;
        } else if (
            context.state.topbar === TOPBAR_TYPES.DOMAIN_INSTANCE_MULTI
        ) {
            dashboardProp.domainBar = {};
            dashboardProp.domainBar.type = 'agent';
            dashboardProp.domainBar.multi = true;
        }

        dashboardProp.lastUpdatedTime = getServerTime();
        const params = {
            key: context.state.dashboardKey
                ? context.state.dashboardKey
                : GenerateKey.makeLongKeyByTime(),
            groupId: context.state.groupId,
            dashboardInfo: dashboardProp,
        };

        await saveThumbnail(document.querySelector('.grid-area'), params.key);
        await saveDashboard(params);

        return params.groupId === ariesuser.groupId
            ? '/userdefine/dashboard?key=' + params.key
            : '/dashboard/';
    },

    getRedirectURLAfterDeleteDashboard: async context => {
        const params = { key: context.state.dashboardKey };
        await deleteDashboard(params);

        return '/dashboard';
    },

    emitShowEditUI: context => {
        const activeComponent =
            context.state.components[context.state.editingComponentDataKey];

        const tooType = activeComponent.toolType,
            charttype = activeComponent.charttype;
        if (tooType) {
            if (tooType === 'textbox') {
                context.commit('emitInsertTypeOnUI', INSERT_TYPE_ON_UI.TEXT);
            } else if (tooType === 'iframe') {
                context.commit('emitInsertTypeOnUI', INSERT_TYPE_ON_UI.IFRAME);
            } else if (tooType === 'plugin') {
                context.commit('emitInsertTypeOnUI', INSERT_TYPE_ON_UI.PLUGIN);
            }
        } else if (charttype) {
            if (activeComponent.charttype === 'line.external') {
                context.commit('emitInsertTypeOnUI', INSERT_TYPE_ON_UI.FRONT);
            } else if (
                Object.values(CUSTOM_CHART_TYPE).includes(charttype) ||
                activeComponent.pkey !== undefined
            ) {
                context.commit('emitInsertTypeOnUI', INSERT_TYPE_ON_UI.CUSTOM);
            } else {
                context.commit('emitInsertTypeOnUI', INSERT_TYPE_ON_UI.GENERAL);
            }
        }
    },

    emitNonSelectComponent: ({ commit }) => {
        commit('clearEditingComponentDataKey');

        commit('setChartTitleOnEditingChart', '');
    },

    emitChartOptionWhenClickJenniferFront: context => {
        context.commit('setChartTypeOnEditingChart', 'line.external');
        context.commit(
            'setMetricsFromJenniferFrontOnEditingChart',
            'page-load-time'
        );
        context.commit(
            'setExternalChartTypeOnEditingChart',
            ExternalChartType.JENNIFER_FRONT
        );
        context.commit('setTargetTypeOnEditingChart', {
            otype: OType.SYSTEM,
            targetType: 'domain',
        });
    },

    setChartTypeAndClearValueWhenClickThumnail: ({ commit }, charttype) => {
        commit('setChartTypeOnEditingChart', charttype);

        //Jennifer-front 사용하는 값들 clear
        commit('setMetricsFromJenniferFrontOnEditingChart', undefined);
        commit('setExternalChartTypeOnEditingChart', undefined);

        commit('setFixedmaxOnEditingChart', undefined);
        commit('setPTypeOnEditingChart', undefined);
        commit('setPerspectiveOnEditingChart', undefined);
        commit('setFontSizeOnEditingChart', undefined);

        commit('setColumnsOnEditingChart', undefined);
        commit('setViewpointOnEditingChart', undefined);
        commit('setFontSizeOnEditingChart', undefined);
    },

    emitRemoveComponent: ({ commit }, dataKey) => {
        commit('removeComponent', dataKey);
        commit('clearEditingComponentDataKey');
    },

    saveEditingAfterTypeCheck: context => {
        const dataKey = context.state.editingComponentDataKey;
        const componentOptions = context.state.components[dataKey];

        if (componentOptions.charttype !== undefined)
            context.commit('setEditingChart', dataKey);
        else if (componentOptions.tooltype === 'textbox')
            context.commit('setEditingTextbox', dataKey);
        else if (componentOptions.tooltype === 'iframe')
            context.commit('setEditingIframe', dataKey);
    },

    initialAllComponent: context => {
        context.state.components.map(component => component.dataKey);
    },
};
