import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

export const state = {
    filters: {
        searchType: 'list',
        time: {
            start: startOfDayjs(getDayjs(), 'date'),
            end: startOfDayjs(getDayjs(), 'date').add(1, 'day'),
        },
        gatheringInterval: 60,
        resourceType: 'instance',
        resources: {
            grouped: {},
        },

        /*
        data: {
            text: "Metrics Compare EVENT"
            value: -2
        }[]
         */
        eventTypes: [],

        /*
        data: {
            text: "Fatal"
            value: 5 or 3 or 1
        }[]
         */
        eventLevels: [],
        showStartTime: false,
        checkZeroCount: false,
    },
    resourceData: { instance: [], business: [] },
    eventTypeData: [],
    eventLevelData: [],
    gatheringIntervalData: [],
    loading: false,
    progress: 1,
    tableData: [],
};
