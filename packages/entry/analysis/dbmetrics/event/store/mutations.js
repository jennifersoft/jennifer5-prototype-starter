export const mutations = {
    updateSearchType: (state, { value }) => {
        state.filters = {
            ...state.filters,
            searchType: value,
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
    updateGatheringInterval: (state, { value }) => {
        state.filters = {
            ...state.filters,
            gatheringInterval: value,
        };
    },
    updateResourceType: (state, updated = 'instance') => {
        state.filters = {
            ...state.filters,
            resourceType: updated,
        };
    },
    updateResources: (state, selected = { grouped: {} }) => {
        state.filters = {
            ...state.filters,
            resources: selected,
        };
    },
    updateEventTypes: (state, list = []) => {
        state.filters = {
            ...state.filters,
            eventTypes: list,
        };
    },
    updateEventLevels: (state, list = []) => {
        state.filters = {
            ...state.filters,
            eventLevels: list,
        };
    },
    updateResourceData: (state, resources) => {
        state.resourceData = resources;
    },
    updateEventTypeData: (state, types) => {
        state.eventTypeData = types;
    },
    updateEventLevelData: (state, levels) => {
        state.eventLevelData = levels;
    },
    updateShowStartTime: (state, updated) => {
        state.filters = {
            ...state.filters,
            showStartTime: updated,
        };
    },
    updateCheckZeroCount: (state, updated) => {
        state.filters = {
            ...state.filters,
            checkZeroCount: updated,
        };
    },
    updateGatheringIntervalData: (state, list) => {
        state.gatheringIntervalData = list;
    },
    updateLoading: (state, loading) => {
        state.loading = loading;
    },
    updateProgress: (state, progress) => {
        state.progress = progress;
    },
    updateTableData: (state, list = []) => {
        state.tableData = list;
    },
};
