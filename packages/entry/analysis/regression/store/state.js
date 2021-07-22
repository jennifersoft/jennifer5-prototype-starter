import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

const date = startOfDayjs(getDayjs(), 'date');

export default {
    domainId: -1,
    instanceOid: -1,
    targetName: '',
    period: 1,
    startHour: 0,
    endHour: 24,
    searchTime: date.valueOf(),
    intervalType: 5,
    comparisonType: 1,
    metricNames: [],
    metricValues: [],
    currentResource: 'instance',
    heatmapValues: [],

    toolbarFold: false,
    scrollHeight: 500,

    fetching: false,
};
