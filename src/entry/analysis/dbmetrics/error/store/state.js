import { startOfDayjs } from '@common/dayjsWrapper';
import { getDayjs } from '@common/base';

export default {
    timeFilter: {
        start: startOfDayjs(getDayjs(), 'date'),
        end: startOfDayjs(getDayjs(), 'date').add(1, 'day'),
    },
    searchType: 'list',
    gatheringInterval: 60,
    showZeroCount: false,
    onlyStartTime: false,
    resourceType: 'instance',
    resources: {},
    errorTypes: [],
    listTableData: [],
    countTableData: [],
    progress: 1,
    loading: false,
    selectedRow: null,
};
