export default {
    updateStartTime(state, start) {
        state.timeFilter = {
            ...state.timeFilter,
            start,
        };
    },
    updateEndTime(state, end) {
        state.timeFilter = {
            ...state.timeFilter,
            end,
        };
    },
    updateSearchType(state, { value }) {
        state.searchType = value;
    },
    updateGatheringInterval(state, { value }) {
        state.gatheringInterval = value;
    },
    updateShowZeroCount(state, flag) {
        state.showZeroCount = flag;
    },
    updateOnlyStartTime(state, flag) {
        state.onlyStartTime = flag;
    },
    updateResourceType(state, type = 'instance') {
        state.resourceType = type;
    },
    updateResources(state, group = {}) {
        state.resources = group;
    },
    updateErrorTypes(state, list = []) {
        state.errorTypes = list.map(e => e.value);
    },
    updateListTableData(state, list = []) {
        state.listTableData = list;
    },
    updateCountTableData(state, list = []) {
        state.countTableData = list;
    },
    updateProgress(state, progress) {
        state.progress = progress;
    },
    updateLoading(state, flag) {
        state.loading = flag;
    },
    updateSelectedRow(state, data = null) {
        if (!data) {
            state.selectedRow = null;
            return;
        }
        const { timeFormat, errorTypeName, detailMessage } = data;
        state.selectedRow = {
            time: timeFormat,
            errorType: errorTypeName,
            content: detailMessage,
        };
    },
};
