import { i18n } from '@common/utility';
import { MxDef } from '@common/definition';

export const TABLE_COLUMNS = {
    application: [
        {
            name: i18n.get('ui.label.no'),
            key: 'no',
            width: '50px',
        },
        {
            name: i18n.get('ui.label.application'),
            key: 'name',
            width: '20%',
            isNumber: false,
        },
        {
            name: i18n.get('ui.mx.service_count'),
            key: 'count',
            className: 'xview-link',
        },
        {
            name: i18n.get('ui.mx.service_err_count'),
            key: 'errCount',
            className: 'xview-fail-link',
        },
        {
            name: i18n.get('ui.mx.service_slow_count'),
            key: 'slowCount',
        },
        {
            name: i18n.get('ui.mx.service_time'),
            key: 'averageResponseTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.stats.service.maxResponseTime'),
            key: 'maxResponseTime',
        },
        {
            name: i18n.get('ui.stats.service.responseTimeStandardDeviation'),
            key: 'responseTimeStandardDeviation',
        },
        {
            name: i18n.get('ui.stats.service.responseTimeSum'),
            key: 'responseTimeSum',
            isHide: true,
        },
        {
            name: i18n.get('ui.mx.frontend_measure_count'),
            key: 'frontEndMeasureCount',
        },
        {
            name: i18n.get('ui.mx.average_frontend_time'),
            key: 'averageFrontEndTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.mx.average_frontend_network_time'),
            key: 'averageFrontEndNetworkTime',
        },
        {
            name: i18n.get('ui.stats.service.averageMethodTime'),
            key: 'averageMethodTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.stats.service.averageSqlCount'),
            key: 'averageSqlCount',
        },
        {
            name: i18n.get('ui.stats.service.averageSqlTime'),
            key: 'averageSqlTime',
        },
        {
            name: i18n.get('ui.stats.service.sqlSum'),
            key: 'sqlSum',
            isHide: true,
        },
        {
            name: i18n.get('ui.stats.service.averageFetchTime'),
            key: 'averageFetchTime',
        },
        {
            name: i18n.get('ui.stats.service.averageTxcallCount'),
            key: 'averageTxcallCount',
        },
        {
            name: i18n.get('ui.stats.service.averageTxcallTime'),
            key: 'averageTxcallTime',
        },
        {
            name: i18n.get('ui.stats.service.txcallSum'),
            key: 'txcallSum',
        },
        {
            name: i18n.get('ui.stats.service.averageCpuTime'),
            key: 'averageCpuTime',
        },
    ],
    sql: [
        {
            name: i18n.get('ui.label.no'),
            key: 'no',
            width: '50px',
        },
        {
            name: i18n.get('ui.label.sql'),
            key: 'name',
            width: '50%',
            isNumber: false,
            className: 'sql-link',
        },
        {
            name: i18n.get('ui.label.xtype'),
            key: 'xtype',
            isNumber: false,
        },
        {
            name: i18n.get('ui.mx.service_count'),
            key: 'count',
            className: 'xview-link',
        },
        {
            name: i18n.get('ui.mx.service_time'),
            key: 'averageResponseTime',
        },
        {
            name: i18n.get('ui.stats.service.maxResponseTime'),
            key: 'maxResponseTime',
        },
        {
            name: i18n.get('ui.stats.service.responseTimeStandardDeviation'),
            key: 'responseTimeStandardDeviation',
        },
        {
            name: i18n.get('ui.mx.service_err_count'),
            key: 'errCount',
        },
        {
            name: i18n.get('ui.mx.service_slow_count'),
            key: 'slowCount',
        },
    ],
    externalCall: [
        {
            name: i18n.get('ui.label.no'),
            key: 'no',
            width: '50px',
        },
        {
            name: i18n.get('ui.label.name'),
            key: 'name',
            width: '50%',
            isNumber: false,
        },
        {
            name: i18n.get('ui.label.xtype'),
            key: 'xtype',
            isNumber: false,
        },
        {
            name: i18n.get('ui.mx.service_count'),
            key: 'count',
            className: 'xview-link',
        },
        {
            name: i18n.get('ui.mx.service_time'),
            key: 'averageResponseTime',
        },
        {
            name: i18n.get('ui.stats.service.maxResponseTime'),
            key: 'maxResponseTime',
        },
        {
            name: i18n.get('ui.stats.service.responseTimeStandardDeviation'),
            key: 'responseTimeStandardDeviation',
        },
        {
            name: i18n.get('ui.mx.service_err_count'),
            key: 'errCount',
        },
        {
            name: i18n.get('ui.mx.service_slow_count'),
            key: 'slowCount',
        },
    ],
    error: [
        {
            name: i18n.get('ui.label.no'),
            key: 'no',
            width: '50px',
        },
        {
            name: i18n.get('ui.label.errorType'),
            key: 'name',
            isNumber: false,
        },
        {
            name: i18n.get('ui.label.occurRate'),
            key: 'rate',
            isNumber: false,
            width: '300px',
            className: 'bar-chart',
        },
        {
            name: i18n.get('ui.mx.error_count'),
            key: 'count',
            width: '200px',
        },
    ],
    cics: [
        {
            name: i18n.get('ui.label.no'),
            key: 'no',
            width: '50px',
        },
        {
            name: i18n.get('ui.label.application'),
            key: 'name',
            isNumber: false,
            width: '20%',
        },
        {
            name: i18n.get('ui.label.callCount'),
            key: 'callCount',
        },
        {
            name: i18n.get('ui.cics.avgExecutionCount'),
            key: 'avgExecutionCount',
        },
        {
            name: i18n.get('ui.cics.avgDb2RequestCount'),
            key: 'avgDb2RequestCount',
        },
        {
            name: i18n.get('ui.cics.avgLinkCount'),
            key: 'avgCicsLinkCount',
        },
        {
            name: i18n.get('ui.cics.avgFileAccessCount'),
            key: 'avgFileAccessCount',
        },
        {
            name: i18n.get('ui.cics.avgSyncPointCount'),
            key: 'avgSyncPointCount',
        },
        {
            name: i18n.get('ui.cics.totalCpuTime'),
            key: 'totalCpuTime',
        },
        {
            name: i18n.get('ui.cics.ziipCpuTime'),
            key: 'ziipCpuTime',
        },
        {
            name: i18n.get('ui.cics.gcpTime'),
            key: 'generalCpuTime',
        },
        {
            name: i18n.get('ui.cics.avgTotalCpuTime'),
            key: 'avgTotalCpuTime',
        },
        {
            name: i18n.get('ui.cics.avgZiipCpuTime'),
            key: 'avgZiipCpuTime',
        },
        {
            name: i18n.get('ui.cics.avgGcpTime'),
            key: 'avgGeneralCpuTime',
        },
        {
            name: i18n.get('ui.cics.avgSuspendTime'),
            key: 'avgTotalSuspendTime',
        },
        {
            name: i18n.get('ui.cics.avgDispatchTime'),
            key: 'avgDispatchWaitTime',
        },
        {
            name: i18n.get('ui.cics.avgTcbSwitchCount'),
            key: 'avgTcbSwitchCount',
        },
        {
            name: i18n.get('ui.cics.avgFirstWaitTime'),
            key: 'avgFirstDispatchWaitTime',
        },
        {
            name: i18n.get('ui.cics.avgRmiSuspendTime'),
            key: 'avgResourceSuspendTime',
        },
        {
            name: i18n.get('ui.cics.avgStartWaitTime'),
            key: 'avgStartWaitTime',
        },
        {
            name: i18n.get('ui.cics.avgMroWaitTime'),
            key: 'avgMroLinkWaitTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.cics.avgJavaClassCount'),
            key: 'avgJavaClassRequestCount',
            isHide: true,
        },
        {
            name: i18n.get('ui.cics.avgJvmElapsedTime'),
            key: 'avgJvmElapsedTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.cics.avgJvmSuspendTime'),
            key: 'avgJvmSuspendTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.cics.avgMaxTcbDelayTime'),
            key: 'avgMaxTcbDelayTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.cics.avgJvmThreadWaitTime'),
            key: 'avgJvmThreadWaitTime',
            isHide: true,
        },
        {
            name: i18n.get('ui.cics.avgPthreadWaitTime'),
            key: 'avgPthreadWaitTime',
            isHide: true,
        },
    ],
};

export const EXPAND_TABLE_COLUMNS = {
    service: [
        {
            name: i18n.get('ui.label.no'),
            key: 'no',
            width: '50px',
        },
        {
            name: i18n.get('ui.label.type'),
            key: 'type',
            isNumber: false,
        },
        {
            name: i18n.get('ui.mx.service_count'),
            key: 'count',
        },
        {
            name: i18n.get('ui.mx.service_time'),
            key: 'averageResponseTime',
        },
        {
            name: i18n.get('ui.stats.service.maxResponseTime'),
            key: 'maxResponseTime',
        },
        {
            name: i18n.get('ui.stats.service.responseTimeStandardDeviation'),
            key: 'responseTimeStandardDeviation',
        },
        {
            name: i18n.get('ui.mx.service_err_count'),
            key: 'errCount',
        },
        {
            name: i18n.get('ui.mx.service_slow_count'),
            key: 'slowCount',
        },
        {
            name: i18n.get('ui.label.detail'),
            key: 'name',
            width: '30%',
            isNumber: false,
        },
    ],
    error: [
        {
            name: i18n.get('ui.label.no'),
            key: 'no',
            width: '50px',
        },
        {
            name: i18n.get('ui.label.application'),
            key: 'applicationName',
            isNumber: false,
            className: 'error-link',
        },
        {
            name: i18n.get('ui.label.occurRate'),
            key: 'rate',
            isNumber: false,
            width: '200px',
            className: 'bar-chart',
        },
        {
            name: i18n.get('ui.mx.error_count'),
            key: 'count',
            width: '150px',
        },
    ],
};

export const TRANSACTION_LIMIT = 1000000;

export const FIVE_MINUTE_INTERVAL_METRICS = [
    MxDef.concurrent_user,
    MxDef.service_rate,
    MxDef.active_service,
];

export const STORAGE_KEYS = {
    application: 'vue/applicationActiveColumns',
    cics: 'vue/cicsActiveColumns',
};

export const EXPAND_WINDOW_SIZE = {
    width: 1024,
    height: 670,
};

export const EXPAND_NAME_HASH_KEYS = {
    application: 'serviceHash',
    sql: 'remoteCallNameKey',
    externalCall: 'remoteCallNameKey',
    error: 'type',
};
