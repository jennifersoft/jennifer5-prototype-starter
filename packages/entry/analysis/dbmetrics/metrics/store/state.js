import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

export const state = {
    filters: {
        time: {
            start: startOfDayjs(getDayjs(), 'date'),
            end: startOfDayjs(getDayjs(), 'date').add(1, 'day'),
        },
        operatingTime: {
            from: 0,
            to: 24,
        },
        gatheringInterval: 60,
        otype: 'instance',
        oidList: {
            grouped: {},
            length: 0,
            names: [],
        },
        metric: null,

        showStartTime: false,
        excludes: [],
    },
    searchConditionQueue: [],
    conditionSet: new Set(),

    resourceData: { instance: [], business: [] },
    metricsData: [],
    gatheringIntervalData: [],
    progress: 1,
    indexMap: {},
    tableData: { column: ['time'], content: [] },

    searchCache: {
        time: {
            start: startOfDayjs(getDayjs(), 'date'),
            end: startOfDayjs(getDayjs(), 'date').add(1, 'day'),
        },
        operatingTime: {
            from: 0,
            to: 24,
        },
        gatheringInterval: 60,
    },
};
