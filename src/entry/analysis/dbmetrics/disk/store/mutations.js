export function getJoinedKey(item) {
    const { resource, partitions, metrics } = item;
    return `${resource.instanceId}-${partitions
        .map(e => e.value)
        .join(',')}-${metrics.map(e => e.value).join(',')}`;
}

export const mutations = {
    updateDomainIds: (state, domainIds) => {
        state.domainIds = domainIds;
    },
    updateStartTime: (state, start) => {
        state.time = {
            ...state.time,
            start,
        };
    },
    updateEndTime: (state, end) => {
        state.time = {
            ...state.time,
            end,
        };
    },
    updateShowStartTime: (state, isActive) => {
        state.showStartTime = isActive;
    },
    updateViewByDate: (state, isActive) => {
        state.viewByDate = isActive;
    },
    updateResourceData(state, tree) {
        state.resourceData = [{ resourceType: 'instance', tree }];
    },
    updatePartitionData(state, list = []) {
        state.partitionData = list;
    },
    updateMetricData(state, list = []) {
        state.metricData = list;
    },
    updateLoadingPartitionList(state, loading = true) {
        state.loadingPartitionList = loading;
    },
    updateSelectedResource(
        state,
        { sid = -1, instId: instanceId = -1, shortName = '' }
    ) {
        state.selected = {
            ...state.selected,
            resource: {
                sid,
                instanceId,
                shortName,
            },
        };
    },
    updateSelectedPartitions(state, list = []) {
        state.selected = {
            ...state.selected,
            partitions: list,
        };
    },
    updateSelectedMetrics(state, list = []) {
        state.selected = {
            ...state.selected,
            metrics: list,
        };
    },
    addSearchCondition: (state, param) => {
        state.conditionQueue.push({ ...param, key: Date.now() });
        state.conditionSet.add(getJoinedKey(param));
    },
    removeSearchCondition: (state, { item, index }) => {
        state.conditionQueue.splice(index, 1);
        state.conditionSet.delete(getJoinedKey(item));
    },
    updateFilterCache(state, viewByDate) {
        state.filterCache = {
            viewByDate,
        };
    },
    updateTableData(state, list = []) {
        state.tableData = list;
    },
    updateProgress(state, progress) {
        state.progress = progress;
    },
};
