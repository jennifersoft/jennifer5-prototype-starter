import { i18n } from '@common/utility';
import {
    StatisticsApplicationFields,
    StatisticsSqlTxFields,
} from '@common/definition';

export const INTERVAL_MAP = {
    HOUR: 60,
    TWO_HOUR: 60 * 2,
    THREE_HOUR: 60 * 3,
    SIX_HOUR: 60 * 6,
    HALF_DAY: 60 * 12,
    DAY: 60 * 24,
};

export const COMMON_COLUMNS = [
    { key: 'time', name: i18n.get('ui.label.time'), sort: true, active: true },
    { key: 'name', name: i18n.get('ui.label.name'), sort: true, active: true },
];

export const COMMON_COLUMN_CALLBACK = key => {
    return {
        key: key,
        name: i18n.get(`ui.stats.service.${key}`),
        sort: true,
        active: false,
    };
};

export const INTERVAL_TYPES = [
    { text: `1${i18n.get('ui.label.unit.hour')}`, value: 'HOUR' },
    { text: `2${i18n.get('ui.label.unit.hour')}`, value: 'TWO_HOUR' },
    { text: `3${i18n.get('ui.label.unit.hour')}`, value: 'THREE_HOUR' },
    { text: `6${i18n.get('ui.label.unit.hour')}`, value: 'SIX_HOUR' },
    { text: `12${i18n.get('ui.label.unit.hour')}`, value: 'HALF_DAY' },
    { text: `24${i18n.get('ui.label.unit.hour')}`, value: 'DAY' },
    { text: `${i18n.get('ui.label.all')}`, value: 'ALL' },
];

export const SERVICE_TYPES = [
    { text: i18n.get('ui.label.application'), value: 'application' },
    { text: i18n.get('ui.label.sql'), value: 'sql' },
    { text: i18n.get('ui.label.externalCall.mng'), value: 'externalCall' },
];

export const UTIL_LIST = [
    { text: i18n.get('ui.label.showStartTime'), value: 'showStartTime' },
    { text: i18n.get('ui.button.export'), value: 'export' },
];

export const METRIC_DATA_1 = Object.keys(StatisticsApplicationFields).map(
    key => {
        return {
            label: i18n.get(`ui.stats.service.${key}`),
            value: key,
        };
    }
);

export const METRIC_DATA_2 = Object.keys(StatisticsSqlTxFields).map(key => {
    return {
        label: i18n.get(`ui.stats.service.${key}`),
        value: key,
    };
});
