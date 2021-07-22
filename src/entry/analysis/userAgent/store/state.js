import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

export const state = {
    domains: {
        sidList: [],
        sid: -1,
    },
    filters: {
        time: {
            start: startOfDayjs(getDayjs(), 'date'),
            end: startOfDayjs(getDayjs(), 'date'),
        },
        oidList: {},
        otypeString: 'instance',
        details: {
            browser: [],
            os: [],
            device: [],
        },
    },
    resourceData: [
        { resourceType: 'instance', tree: [] },
        { resourceType: 'business', tree: [] },
    ],
    tabData: [
        { key: 'browser', value: '' },
        { key: 'os', value: '' },
        { key: 'device', value: '' },
    ],
    detailFilterData: [
        { category: 'browser', list: [] },
        { category: 'os', list: [] },
        { category: 'device', list: [] },
    ],
    loading: false,
    progress: 1,
    currentTab: 'browser',
    data: { browser: [], os: [], device: [] },
    donutFilter: [],
};
