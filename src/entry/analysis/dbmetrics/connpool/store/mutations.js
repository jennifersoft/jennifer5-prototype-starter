export function getJoinedKey(item) {
    const { resource, pool, metrics } = item;
    return `${resource.oid}
    -${pool.map(e => e.value).join(',')}
    -${metrics.map(e => e.key).join(',')}`;
}

export default {
    updateStartTime(state, start) {
        state.time = {
            ...state.time,
            start,
        };
    },
    updateEndTime(state, end) {
        state.time = {
            ...state.time,
            end,
        };
    },
    updateResource(state, selected) {
        if (!selected) {
            state.resource = {
                oid: null,
                name: null,
            };
            return;
        }
        const { oid, shortName: name } = selected;
        state.resource = {
            oid,
            name,
        };
    },
    updatePoolNames(state, list = []) {
        state.poolNames = list;
    },
    updateMetrics(state, list = []) {
        state.metrics = list;
    },
    pushCondition: (state, newCondition) => {
        state.conditionQueue = state.conditionQueue.concat([newCondition]);
        state.conditionSet.add(getJoinedKey(newCondition));
    },
    removeCondition: (state, { item, index }) => {
        state.conditionQueue = state.conditionQueue.filter(
            (_, i) => i !== index
        );
        state.conditionSet.delete(getJoinedKey(item));
    },
    updateInterval(state, { value: interval }) {
        state.interval = interval;
    },
    updateResourcesData(state, resources) {
        state.resourcesData = resources;
    },
    updatePoolNamesData(state, list = []) {
        state.poolNamesData = list;
    },
    updateMetricsData(state, list = []) {
        state.metricsData = list;
    },
    updateLoadingPoolNames(state, loading = true) {
        state.loadingPoolNames = loading;
    },
    updateShowStartTime(state, flag) {
        state.showStartTime = flag;
    },
    updateTableData(state, list = []) {
        state.tableData = list;
    },
    updateFilterCache(state, options = null) {
        if (!options) {
            state.filterCache = null;
            return;
        }
        const { endTime, interval, showStartTime } = options;
        state.filterCache = {
            endTime,
            interval,
            showStartTime,
        };
    },
    updateProgress(state, progress) {
        state.progress = progress;
    },
};
