import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

const now = getDayjs()
    .minute(0)
    .second(0)
    .millisecond(0);

export default {
    domainId: -1,
    instanceOids: [],
    instanceData: [],
    startDate: now.clone().add(-1, 'hour'),
    endDate: now,
    searchProgress: 1,
    tableRows: [],
    tableHeight: 500,
};
