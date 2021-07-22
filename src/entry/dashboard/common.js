import Vue from 'vue';
import { ariesuser, server } from '@common/base';
import { i18n } from '@common/utility';

import { Observer } from '@common/legacy/Observer';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';
import DbConnectionPoolComponent from '@entry/popup/dbConnectionPool/DbConnectionPoolComponent';
import ChartPopup from '@entry/popup/chartFromDashboard/ChartPopup';
import Vuex from 'vuex';
import $ from '@library/jquery';
import DashboardTemplate from '@entry/userdefine/dashboard/component/DashboardTemplate';

Vue.use(Vuex);

export const commonProvideProperties = {
    useExtendOrOriginInChartPosition: true,
    theme: ariesuser.theme,
    groupId: ariesuser.groupId,
    platform: server.platform,
    i18n: {
        exportCanvas: i18n.get('ui.label.export.canvas'),
        frontChartTooltip: i18n.get('ui.front.chart.tooltip'),

        chartPopup: i18n.get('ui.label.chartPopup'),
        realtimeMonitoring: i18n.get('ui.label.realtimeMonitoring'),
        setting: i18n.get('ui.label.setting'),
        load: i18n.get('ui.button.load'),
        autoPlacement: i18n.get('ui.button.autoPlacement'),
        displayName: i18n.get('ui.label.displayName'),
        showHiddenNode: i18n.get('ui.label.node.show.hidden'),

        subject: i18n.get('M0270'),
        contents: i18n.get('M0622'),
        mapConfigTime: i18n.get('ui.label.mapConfigTime'),
        apply: i18n.get('ui.label.apply'),
        cancel: i18n.get('ui.label.cancel'),
        recent: i18n.get('ui.label.recent'),
        minute: i18n.get('ui.label.unit.minute'),

        dashboard: i18n.get('ui.en.dashboard'),
        realtime: i18n.get('ui.en.realtime'),
        userdefined: i18n.get('ui.label.userdefineddashboard'),
        userdefinedCreate: i18n.get('ui.label.userdefineddashboard.create'),
        align: i18n.get('ui.label.align'),
        updatedTime: i18n.get('ui.labe.updatedTime'),
        name: i18n.get('ui.label.name'),
        viewAll: i18n.get('ui.label.viewAll'),
        viewMyGroup: i18n.get('ui.label.viewMyGroup'),
        edit: i18n.get('ui.label.edit'),
        delete: i18n.get('ui.button.delete'),

        business: i18n.get('ui.label.business'),
        domainGroup: i18n.get('ui.label.domainGroup'),
        more: i18n.get('ui.label.more'),
        dashboardMenu: i18n.get('ui.label.dashboard.menu'),
        bookmark: i18n.get('ui.label.bookmark'),
        help: i18n.get('ui.label.help'),

        confirmMessage: i18n.get('ui.label.confirmMessage'),
        searchDashboard: i18n.get('ui.label.dashboard.search'),

        bizSelect: i18n.get('ui.button.bizSelect'),
        make: i18n.get('ui.label.make'),

        configViewPoint: i18n.get('ui.label.viewpoint.config'),
        numberOfPoints: i18n.get('ui.label.numberOfPoints'),
        async: i18n.get('ui.label.async'),

        gc: i18n.get('ui.button.gc'),

        M0270: i18n.get('M0270'),

        M0308: i18n.get('M0308'),
        M0399: i18n.get('M0399'),
        M0450: i18n.get('M0450'),
        M0449: i18n.get('M0449'),
        M0453: i18n.get('M0453'),
        M0452: i18n.get('M0452'),
        M0451: i18n.get('M0451'),
        M458: i18n.get('M458'),
        M0473: i18n.get('M0473'),
        M0621: i18n.get('M0621'),
        M0654: i18n.get('M0654'),

        M0675: i18n.get('M0675'),
        M0676: i18n.get('M0676'),
    },
};

export const doChangeLayoutInBuiltInDashboard = store => {
    store.commit('dashboard/setOriginOrExtendInChartPosition', 'origin');
    Observer.on(ChartKeywordInObserver.CHANGE_DASHBOARD_LAYOUT_ORIGIN, () => {
        store.commit('dashboard/setOriginOrExtendInChartPosition', 'origin');
    });

    Observer.on(ChartKeywordInObserver.CHANGE_DASHBOARD_LAYOUT_EXTEND, () => {
        store.commit('dashboard/setOriginOrExtendInChartPosition', 'extend');
    });
};
export const fixDataForLegacy = (charts = []) => {
    return charts.map(chart => {
        if (typeof chart.sid === 'string') {
            chart.sid = chart.sid.split(',');
        }

        if (typeof chart.oid === 'string') {
            chart.oid = chart.oid.split(',');
        }
        //ARIES-10292
        if (chart.charttype === 'bar.daily') chart.charttype = 'column.daily';
        if (chart.chartType === 'bar.daily') chart.chartType = 'column.daily';

        return chart;
    });
};

export const buildGeneralDashboard = (
    store,
    dashboardProp,
    provideProperties,
    builtInDashboard = false
) => {
    if (
        dashboardProp.domainBar?.multi &&
        dashboardProp.domainBar?.type === 'agent'
    ) {
        dashboardProp.domainBar.multidomain = true;
        dashboardProp.domainBar.multiinstance = true;
    }

    const charts = fixDataForLegacy(dashboardProp.charts);
    store.commit('dashboard/setComponents', charts);
    store.commit('dashboard/setTopbar', dashboardProp.domainBar);

    if (builtInDashboard) doChangeLayoutInBuiltInDashboard(store);

    const menuName =
        location.pathname === '/labs' || location.pathname.includes('/plugin')
            ? i18n.get('ui.title.labs')
            : $('input[name=menuName]').val();
    const isDomainGroupUsage =
        $('input[name=isDomainGroupUsage]').val() === 'true';

    const includeDashboardMenusLink = true;
    const hideDomainGroupTree = dashboardProp.domainBar === undefined;

    new Vue({
        el: '#vue_app',
        store,
        components: {
            DashboardTemplate,
        },
        provide: {
            ...provideProperties,
            isDomainGroupUsage: isDomainGroupUsage,
            menuName: menuName,
            showRightMenusInHeader: includeDashboardMenusLink,
            hideDomainGroupTree: hideDomainGroupTree,
        },
    });
};

export const buildDBConnectionPool = (store, provideProperties) => {
    new Vue({
        el: '#app',
        store,
        provide: { ...provideProperties },
        components: {
            DbConnectionPoolComponent,
        },
    });
};

export const buildChartFromDashboard = (store, provideProperties) => {
    new Vue({
        el: '#app',
        store,
        provide: { ...provideProperties },
        components: {
            ChartPopup,
        },
    });
};
