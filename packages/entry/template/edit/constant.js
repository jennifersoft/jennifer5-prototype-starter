import { i18n } from '@common/utility';

export const HOURS = [...Array(25).keys()].map(value => {
    return { text: value < 10 ? `0${value}` : `${value}`, value: value };
});

export const DATES = [...Array(31).keys()].map(value => {
    return { text: `${value}`, value: value };
});

export const DAYS = [
    { text: i18n.get('ui.label.time.sunday'), value: 1 },
    { text: i18n.get('ui.label.time.monday'), value: 2 },
    { text: i18n.get('ui.label.time.tuesday'), value: 3 },
    { text: i18n.get('ui.label.time.wednesday'), value: 4 },
    { text: i18n.get('ui.label.time.thursday'), value: 5 },
    { text: i18n.get('ui.label.time.friday'), value: 6 },
    { text: i18n.get('ui.label.time.saturday'), value: 7 },
];

export const PERIODS = [
    { text: i18n.get('ui.label.time.aDay'), value: 1 },
    { text: i18n.get('ui.label.time.aWeek'), value: 2 },
    { text: i18n.get('ui.label.time.aMonth'), value: 3 },
    { text: i18n.get('ui.label.time.user'), value: 4 },
];

export const SERVICE_TYPES = [
    { text: i18n.get('ui.label.application'), value: '1' },
    { text: i18n.get('ui.label.sql'), value: '2' },
    { text: i18n.get('ui.label.externalTransaction'), value: '3' },
];

// all 타입 때문에 문자열로 value 값을 설정했음
export const INTERVALS = [
    { text: `1${i18n.get('ui.label.unit.minute')}`, value: '1' },
    { text: `5${i18n.get('ui.label.unit.minute')}`, value: '5' },
    { text: `10${i18n.get('ui.label.unit.minute')}`, value: '10' },
    { text: `30${i18n.get('ui.label.unit.minute')}`, value: '30' },
    { text: `1${i18n.get('ui.label.unit.hour')}`, value: '60' },
    { text: `2${i18n.get('ui.label.unit.hour')}`, value: '120' },
    { text: `3${i18n.get('ui.label.unit.hour')}`, value: '180' },
    { text: `6${i18n.get('ui.label.unit.hour')}`, value: '360' },
    { text: `12${i18n.get('ui.label.unit.hour')}`, value: '720' },
    { text: `24${i18n.get('ui.label.unit.hour')}`, value: '1440' },
    { text: `${i18n.get('ui.label.all')}`, value: 'all' },
];

export const APPLICATION_FIELDS = [
    { label: i18n.get('ui.stats.service.count'), value: 'count' },
    { label: i18n.get('ui.stats.service.cpuSum'), value: 'cpuSum' },
    {
        label: i18n.get('ui.stats.service.averageResponseTime'),
        value: 'averageResponseTime',
    },
    {
        label: i18n.get('ui.stats.service.maxResponseTime'),
        value: 'maxResponseTime',
    },
    {
        label: i18n.get('ui.stats.service.responseTimeStandardDeviation'),
        value: 'responseTimeStandardDeviation',
    },
    { label: i18n.get('ui.stats.service.elapseSum'), value: 'elapseSum' },
    { label: i18n.get('ui.stats.service.errCount'), value: 'errCount' },
    { label: i18n.get('ui.stats.service.slowCount'), value: 'slowCount' },
    {
        label: i18n.get('ui.stats.service.averageSqlCount'),
        value: 'averageSqlCount',
    },
    {
        label: i18n.get('ui.stats.service.averageSqlTime'),
        value: 'averageSqlTime',
    },
    { label: i18n.get('ui.stats.service.sqlCount'), value: 'sqlCount' },
    { label: i18n.get('ui.stats.service.sqlSum'), value: 'sqlSum' },
    {
        label: i18n.get('ui.stats.service.averageTxcallCount'),
        value: 'averageTxcallCount',
    },
    {
        label: i18n.get('ui.stats.service.averageTxcallTime'),
        value: 'averageTxcallTime',
    },
    { label: i18n.get('ui.stats.service.txcallCount'), value: 'txcallCount' },
    { label: i18n.get('ui.stats.service.txcallSum'), value: 'txcallSum' },
    {
        label: i18n.get('ui.stats.service.averageFetchCount'),
        value: 'averageFetchCount',
    },
    {
        label: i18n.get('ui.stats.service.averageFetchTime'),
        value: 'averageFetchTime',
    },
    { label: i18n.get('ui.stats.service.fetchCount'), value: 'fetchCount' },
    { label: i18n.get('ui.stats.service.fetchSum'), value: 'fetchSum' },
    {
        label: i18n.get('ui.stats.service.frontEndMeasureCount'),
        value: 'frontEndMeasureCount',
    },
    {
        label: i18n.get('ui.stats.service.averageFrontEndTime'),
        value: 'averageFrontEndTime',
    },
    {
        label: i18n.get('ui.stats.service.averageFrontEndDomTime'),
        value: 'averageFrontEndDomTime',
    },
    {
        label: i18n.get('ui.stats.service.averageFrontEndRenderTime'),
        value: 'averageFrontEndRenderTime',
    },
    {
        label: i18n.get('ui.stats.service.averageFrontEndNetworkTime'),
        value: 'averageFrontEndNetworkTime',
    },
    {
        label: i18n.get('ui.stats.service.averageCpuTime'),
        value: 'averageCpuTime',
    },
    {
        label: i18n.get('ui.stats.service.averageMethodTime'),
        value: 'averageMethodTime',
    },
];

export const SQL_TX_FIELDS = [
    { label: i18n.get('ui.stats.service.count'), value: 'count' },
    { label: i18n.get('ui.stats.service.elapseSum'), value: 'elapseSum' },
    { label: i18n.get('ui.stats.service.errCount'), value: 'errCount' },
    { label: i18n.get('ui.stats.service.slowCount'), value: 'slowCount' },
    {
        label: i18n.get('ui.stats.service.averageResponseTime'),
        value: 'averageResponseTime',
    },
    {
        label: i18n.get('ui.stats.service.maxResponseTime'),
        value: 'maxResponseTime',
    },
    {
        label: i18n.get('ui.stats.service.responseTimeStandardDeviation'),
        value: 'responseTimeStandardDeviation',
    },
];
