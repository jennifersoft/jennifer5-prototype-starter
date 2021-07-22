import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

const startDate = startOfDayjs(getDayjs(), 'date');
const endDate = startDate.add(1, 'day');

export const state = {
    domainIds: {},
    groupData: {},
    startTime: startDate,
    endTime: endDate,
    showStartTimeOnly: false,
    intervalType: 'HOUR',
    serviceType: 'application',

    serviceHashes: [],
    serviceHashSet: new Set(),

    serviceMetrics: [],
    serviceNameData: [],
    tableData: [],
    serviceLoading: false,
    tableLoading: false,
};
