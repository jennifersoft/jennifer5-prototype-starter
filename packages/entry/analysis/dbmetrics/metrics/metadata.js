import { i18n } from '@common/utility';

export const searchTypes = [
    { text: i18n.get('ui.label.period'), value: 'period' },
    { text: i18n.get('ui.label.operatingTime'), value: 'operatingTime' },
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
