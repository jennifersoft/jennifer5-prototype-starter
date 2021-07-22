import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

export default {
    type: 1,
    time: {
        start: startOfDayjs(getDayjs(), 'date'),
        end: startOfDayjs(getDayjs().add(1, 'day'), 'date'),
    },
    resource: {
        oid: null,
        name: null,
    },
    poolNames: [],
    metrics: [],
    interval: 60,

    /*
    {
        resource: {
            oid,
            name,
        },
        pool: [],
        metrics: [],
        key: any,
    }[]
    */

    conditionQueue: [],
    conditionSet: new Set(),

    resourcesData: [{ resourceType: 'instance', tree: [] }],
    poolNamesData: [],
    metricsData: [],

    loadingPoolNames: false,

    tableData: [],
    filterCache: null,

    progress: 1,
    showStartTime: false,
};
