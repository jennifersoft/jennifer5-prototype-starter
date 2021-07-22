import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

export const state = {
    time: {
        start: startOfDayjs(getDayjs(), 'date'),
        end: startOfDayjs(getDayjs(), 'date').add(1, 'day'),
    },
    showStartTime: false,
    viewByDate: false,

    resourceData: [{ resourceType: 'instance', tree: [] }],
    partitionData: [],
    metricData: [],

    loadingPartitionList: false,

    selected: {
        resource: {
            sid: -1,
            instanceId: -1,
            shortName: '',
        },
        partitions: [],
        metrics: [],
    },
    conditionQueue: [],
    conditionSet: new Set(),

    filterCache: {
        viewByDate: false,
    },
    tableData: [],
    progress: 1,
};
