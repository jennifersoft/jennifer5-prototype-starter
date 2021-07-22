export function getJoinedKey(item) {
    const { resources, metric } = item;
    return `${metric.value}-${JSON.stringify(resources.grouped)}`;
}

export const mutations = {
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
    updateOperatingTimeFrom: (state, from) => {
        state.filters = {
            ...state.filters,
            operatingTime: {
                ...state.filters.operatingTime,
                from,
            },
        };
    },
    updateOperatingTimeTo: (state, to) => {
        state.filters = {
            ...state.filters,
            operatingTime: {
                ...state.filters.operatingTime,
                to,
            },
        };
    },
    updateGatheringInterval: (state, interval) => {
        state.filters = {
            ...state.filters,
            gatheringInterval: interval,
        };
    },
    updateExcludes: (state, list) => {
        state.filters = {
            ...state.filters,
            excludes: list,
        };
    },
    updateOtype: (state, updated = 'instance') => {
        state.filters = {
            ...state.filters,
            otype: updated,
        };
    },
    updateOidList: (state, selected) => {
        if (!selected) {
            state.filters = {
                ...state.filters,
                oidList: {
                    grouped: {},
                    length: 0,
                    names: 0,
                },
            };
            return;
        }
        state.filters = {
            ...state.filters,
            oidList: selected,
        };
    },
    updateMetric: (state, metric = null) => {
        state.filters = {
            ...state.filters,
            metric,
        };
    },
    pushCondition: (state, newCondition) => {
        state.searchConditionQueue = state.searchConditionQueue.concat([
            newCondition,
        ]);
        state.conditionSet.add(getJoinedKey(newCondition));
    },
    removeCondition: (state, { item, index }) => {
        state.searchConditionQueue = state.searchConditionQueue.filter(
            (_, i) => i !== index
        );
        state.conditionSet.delete(getJoinedKey(item));
    },
    updateResourceData: (state, resources) => {
        state.resourceData = resources;
    },
    updateMetricsData: (state, metrics) => {
        state.metricsData = metrics;
    },
    updateShowStartTime: (state, updated) => {
        state.filters = {
            ...state.filters,
            showStartTime: updated,
        };
    },
    updateGatheringIntervalData: (state, list) => {
        state.gatheringIntervalData = list;
    },
    updateProgress: (state, progress) => {
        state.progress = progress;
    },
    updateNameMap: (state, map) => {
        state.nameMap = map;
    },
    addTableColumn: (state, column) => {
        state.tableData = {
            ...state.tableData,
            column: state.tableData.column.concat([column]),
        };
    },
    resetTableColumn: state => {
        state.tableData = {
            ...state.tableData,
            column: ['time'],
        };
    },
    updateIndexMap: (state, map) => {
        state.indexMap = map;
    },
    updateTableData: (state, list = []) => {
        state.tableData = {
            ...state.tableData,
            content: list,
        };
    },
    setSearchCache: (state, searchCache = {}) => {
        state.searchCache = {
            ...searchCache,
            time: {
                ...searchCache.time,
            },
            operatingTime: {
                ...searchCache.operatingTime,
            },
        };
    },
};
