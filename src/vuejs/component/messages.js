import { i18n } from '@common/utility';

export const dayLabels = [
    i18n.get('ui.label.time.sunday.short'),
    i18n.get('ui.label.time.monday.short'),
    i18n.get('ui.label.time.tuesday.short'),
    i18n.get('ui.label.time.wednesday.short'),
    i18n.get('ui.label.time.thursday.short'),
    i18n.get('ui.label.time.friday.short'),
    i18n.get('ui.label.time.saturday.short'),
];
export const apply = i18n.get('ui.label.apply');
export const cancel = i18n.get('ui.label.cancel');

export const confirm = i18n.get('ui.button.confirm');
export const alertMessage = i18n.get('ui.label.alertMessage');
export const confirmMessage = i18n.get('ui.label.confirmMessage');

export default {
    dayLabels,
    apply,
    cancel,
};
