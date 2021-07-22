import { i18n } from '@common/utility';

export const DEFAULT_METRIC_DATA = [
    {
        label: `${i18n.get('ui.label.total')} (MB)`,
        value: 'totalSpace',
    },
    {
        label: `${i18n.get('ui.label.freeSpace')} (MB)`,
        value: 'unallocatedSpace',
    },
    {
        label: `${i18n.get('ui.label.availableSpace')} (MB)`,
        value: 'usableSpace',
    },
    {
        label: `${i18n.get('ui.label.currentUsage')} (MB)`,
        value: 'usedSpace',
    },
    {
        label: `${i18n.get('ui.label.currentUsage')} (%)`,
        value: 'usedSpaceRate',
    },
];
