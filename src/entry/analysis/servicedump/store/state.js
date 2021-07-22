import { getDayjs } from '@common/base';
import { startOfDayjs, endOfDayjs } from '@common/dayjsWrapper';

const endDate = endOfDayjs(getDayjs(), 'date');
const startDate = startOfDayjs(endDate.clone().add(-1, 'week'), 'date');

export default {
    domainIds: [],
    instanceOids: [],
    serviceDumpFiles: [],
    startDate: startDate,
    endDate: endDate,
    searchLoading: false,
    memoryDumpLoading: false,
    dumpLoading: false,
    deleteLoading: false,
};
