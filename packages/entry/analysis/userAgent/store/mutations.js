import { BrowserTypeDef, DeviceTypeDef, OSTypeDef } from '@common/definition';

export const mutations = {
    updateDomains: (state, { sidList, sid }) => {
        state.domains = { sidList, sid };
    },
    updateTimeFilter: (state, { start, end }) => {
        state.filters = {
            ...state.filters,
            time: {
                start,
                end,
            },
        };
    },
    updateStartTime: (state, start) => {
        state.filters = {
            ...state.filters,
            time: {
                ...state.filters.time,
                start,
            },
        };
    },
    updateEndTime: (state, end) => {
        state.filters = {
            ...state.filters,
            time: {
                ...state.filters.time,
                end,
            },
        };
    },
    updateFilteredResource: (state, { oidList, otypeString }) => {
        state.filters = {
            ...state.filters,
            oidList,
            otypeString,
        };
    },
    updateFilteredDetails: (state, filtered) => {
        state.filters = {
            ...state.filters,
            details: {
                ...state.filters.details,
                ...filtered,
            },
        };
    },
    updateResourceData: (state, resources) => {
        state.resourceData = resources;
    },
    updateCurrentTab: (state, tab) => {
        state.currentTab = tab;
    },
    updateLoading: (state, loading) => {
        state.loading = loading;
    },
    updateProgress: (state, progress) => {
        state.progress = progress;
    },
    updateData: (state, data) => {
        state.data = data;
    },
    updateDonutFilter: (state, donutFilter) => {
        state.donutFilter = donutFilter;
    },
    setTabData: (state, tabs) => {
        state.tabData = tabs;
        state.donutFilter = [];
    },
    setDetailFilterData: (state, _) => {
        const deviceData = [],
            osData = [],
            browserData = [];

        for (let key in DeviceTypeDef) {
            deviceData.push({
                label: key,
                data: DeviceTypeDef[key],
            });
        }

        for (let key in OSTypeDef) {
            osData.push({
                label: key,
                data: OSTypeDef[key],
            });
        }

        for (let key in BrowserTypeDef) {
            browserData.push({
                label: key,
                data: BrowserTypeDef[key],
            });
        }
        state.detailFilterData = [
            { category: 'browser', list: browserData },
            { category: 'os', list: osData },
            { category: 'device', list: deviceData },
        ];
        state.filters = {
            ...state.filters,
            details: {
                browser: browserData.map(b => b.data),
                os: osData.map(o => o.data),
                device: deviceData.map(d => d.data),
            },
        };
    },
};
