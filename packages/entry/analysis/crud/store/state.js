import { getDayjs } from '@common/base';
import { OTypeDef } from '@common/definition';
import { startOfDayjs } from '@common/dayjsWrapper';

export default {
    domainId: -1,
    startDate: startOfDayjs(getDayjs(), 'day'),
    endDate: startOfDayjs(getDayjs(), 'day'),

    otype: OTypeDef.SYSTEM,
    oidMap: {},

    instanceData: [],
    businessData: [],
    crudData: [],
    filteredCrudData: [],
    searchProgress: 1,

    applicationFilter: '',
    tableFilter: '',
    functionFilter: '',
    crudFilter: {
        C: true,
        R: true,
        U: true,
        D: true,
    },

    mainHeight: 600,
};
