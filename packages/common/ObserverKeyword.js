export const DataKeywordInObserver = {
    TOP_BAR_CONFIGURE: 'topbar.configure',
    DOMAIN_BAR_CHANGE: 'domainbar.change',
    DOMAIN_BAR_RESIZE: 'domainbar.resize',
    LISTEN_INSTANCE_INFOMATION_IN_DOMAINS: 'load.domainAgentList',
    INSTANCE_INFO_IN_DOMAIN: 'aries.manager.element:callback',
    SEND_REALTIME_ON_SOCKET: 'send.realtime.socket',
    SEND_TOPOLOGY_ON_SOCKET: 'send.topology.socket',
    SEND_BIGDATA_ON_SOCKET: 'send.bigdata.socket',
    REQUEST_RATE_DATA_ON_SOCKET: 'request.rate.data.socket',
    REALTIME_RATE_DATA_KEY: 'realtime_rate_by_section',
    EXTERNAL_AJAX_PRE: 'external_ajax:',
    SHOW_MESSAGE_WHEN_WS_CLOSE: 'show.message.when.ws.close',
    HIDE_MESSAGE_WHEN_WS_CLOSE: 'hide.message.when.ws.close',
};

export const ChartKeywordInObserver = {
    TOGGLE_LINE_MERGE: 'chart.toggle.line.merge.',
    TOGGLE_VIEW_DOMAIN_EQUALIZER: 'chart.toggle.equalizer.view.domain.',
    TOGGLE_EVENT_LIST: 'chart.toggle.event.list.',
    CLEAR_SELECTED_TARGET: 'chart.clear.selected',
    STOP_ALL_RENDER: 'stopCharts',
    START_ALL_RENDER: 'startCharts',
    EXTERNAL_CHARTS_OBJECT: 'external.charts',
    REALTIME_CHARTS_OBJECT: 'realtime.charts',
    BIGDATA_CHARTS_OBJECT: 'bigdata.charts',
    XVIEW_CHART_ANALYSIS: 'XViewChartInAnalysis',
    SHOW_LIVE_INSTANCE: 'showLiveInstance',
    EXPORT_CHART: chartKey => chartKey + '.export.chart',

    RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE:
        'render.in.analysis.xview.when.fetch.or.resize',
    SELECT_ONE_INSTANCE_OR_BUSINESS_IN_CHART: 'selectedAgent',
    UNSELECT_ONE_INSTANCE_OR_BUSINESS_IN_CHART: 'unselectedAgent',

    SELECT_LINE_IN_PERFORMANCE_CHART: 'select.line.in.performance.chart',

    CHANGE_SELECT_DOMAIN_OR_INSTANCE_ON_ELEMENT:
        'aries.manager.element:generateCache',
    CHANGE_SELECT_BUSINESS_ON_ELEMENT: 'aries.manager.business:generateCache',
    CHANGE_SELECT_DOMAIN_OR_INSTANCE_FROM_CONFIG:
        'change.select.instance.from.config',
    CHANGE_SELECT_BUSINESS_FROM_CONFIG: 'change.select.business.from.config',
    CHANGE_DASHBOARD_LAYOUT_ORIGIN: 'dashboard.change.layout.origin',
    CHANGE_DASHBOARD_LAYOUT_EXTEND: 'dashboard.change.layout.extend',
    FOCUS_TIME_AREA_IN_PERFORMANCE_CHART:
        'focus.time.area.in.performance.chart',
};

export const XViewChartKeywordInObserver = {
    CHANGE_Y_AXIS_MAX_VALUE_FROM_VUE: 'change.y.axis.max.value.from.vue',
    CHANGE_Y_AXIS_MAX_VALUE_FROM_EVENT_LISTENER:
        'change.y.axis.max.value.from.eventListener',
    BIG_X_POINT_IN_DASHBOARD: 'aries.options.xview.bigSize',
    FILTER_WHITE_IP_LIST: 'filter.white.ip.list',
    FILTER_USERID_LIST: 'filter.userid.list',
    FILTER_GUID_LIST: 'filter.guid.list',
    FILTER_SERVICENAME_LIST: 'filter.servicename.list',
    FILTER_EXCLUDE_SERVICENAME_LIST: 'filter.exclude.servicename.list',
    FILTER_SERVICENAME_LIST_ON_APPLICATION_LIST:
        'filter.servicename.list.on.application',
    FILTER_CUSTOM_FUNC_LIST: 'filter.custom.func.list',
    END_XVIEW_ANALYSIS: 'xview.analysis.end',
    NUMBER_OF_POINT_WITH_CHARTKEY: chartKey => chartKey + 'number.of.point',
    FUCUS_ON_XVIEW_CHART_WITH_CHARTKEY: chartKey =>
        chartKey + 'focus.on.xview.chart',
    FUCUS_OUT_XVIEW_CHART_WITH_CHARTKEY: chartKey =>
        chartKey + 'focus.out.xview.chart',
    SHOW_ONLY_ERROR_IN_XVIEW_WITH_CHARTKEY: chartKey =>
        chartKey + ':show.only.error.in.xview',
    SHOW_ONLY_ASYNC_IN_XVIEW_WITH_CHARTKEY: chartKey =>
        chartKey + ':show.only.async.in.xview',
    SHOW_ONLY_TRANSACTION_IN_XVIEW_WITH_CHARTKEY: chartKey =>
        chartKey + ':show.only.transaction.in.xview',
};

export const keywordInVuebus = {
    EXPORT_CHART_DASHBOARD: 'export.chart.dashboard',
    MOVE_TO_TALK_WHEN_EXPORT_CHART: 'move.to.talk.when.export.chart',
};
