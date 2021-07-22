import { i18n } from '@common/utility';

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

export const connectionPoolMetrics = [
    {
        label: i18n.get('ui.label.avgConfiguredConnection'),
        key: 2,
    },
    {
        label: i18n.get('ui.label.avgIdleConnection'),
        key: 1,
    },
    {
        label: i18n.get('ui.label.avgActiveConnection'),
        key: 0,
    },
    {
        label: i18n.get('ui.label.maxActiveConnection'),
        key: 3,
    },
];

export const UTIL_LIST = [
    { text: i18n.get('ui.label.showStartTime'), value: 'showStartTime' },
    { text: i18n.get('ui.button.export'), value: 'export' },
];
