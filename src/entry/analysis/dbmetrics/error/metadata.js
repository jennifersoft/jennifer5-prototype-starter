import { i18n } from '@common/utility';

export const listTableColumns = [
    { name: i18n.get('ui.label.hour'), key: 'timeFormat', sort: true },
    { name: i18n.get('ui.label.object'), key: 'nameWithDomain', sort: true },
    { name: i18n.get('ui.label.errorType'), key: 'errorTypeName', sort: true },
    { name: i18n.get('ui.label.message'), key: 'detailMessage', sort: true },
    { name: i18n.get('ui.label.value'), key: 'value', sort: true },
    { name: i18n.get('ui.label.transaction'), key: 'relevantTxId', sort: true },
    { name: i18n.get('ui.label.application'), key: 'serviceName', sort: true },
];
export const countTableColumns = [
    { name: i18n.get('ui.label.hour'), key: 'timeFormat', sort: true },
    { name: i18n.get('ui.label.target'), key: 'nameWithDomain', sort: true },
    { name: i18n.get('ui.label.errorType'), key: 'errorTypeName', sort: true },
    { name: i18n.get('ui.label.count'), key: 'count', sort: true },
];

export const gatheringIntervalList = [
    { text: 1 + i18n.get('ui.label.unit.minute'), value: 1 },
    { text: 5 + i18n.get('ui.label.unit.minute'), value: 5 },
    { text: 10 + i18n.get('ui.label.unit.minute'), value: 10 },
    { text: 30 + i18n.get('ui.label.unit.minute'), value: 30 },
    { text: 1 + i18n.get('ui.label.unit.hour'), value: 60 },
    { text: 2 + i18n.get('ui.label.unit.hour'), value: 120 },
    { text: 3 + i18n.get('ui.label.unit.hour'), value: 180 },
    { text: 6 + i18n.get('ui.label.unit.hour'), value: 360 },
    { text: 12 + i18n.get('ui.label.unit.hour'), value: 720 },
    { text: 24 + i18n.get('ui.label.unit.hour'), value: 1440 },
    { text: i18n.get('ui.label.all'), value: 0 },
];
export const searchTypeList = [
    { text: i18n.get('ui.label.list'), value: 'list' },
    { text: i18n.get('ui.label.count'), value: 'count' },
];
