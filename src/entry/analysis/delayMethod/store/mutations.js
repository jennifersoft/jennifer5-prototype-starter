export default {
    changeDomainId(state, domainId) {
        state.domainId = domainId;
    },
    updateInstanceOids(state, oids) {
        state.instanceOids = oids;
    },
    updateInstanceData(state, data) {
        state.instanceData = data;
    },
    updateSearchDates(state, dates) {
        state.startDate = dates[0];
        state.endDate = dates[1];
    },
    updateSearchProgress(state, progress) {
        state.searchProgress = progress;
    },
    updateTableRows(state, rows) {
        state.tableRows = rows
            .map(row => {
                return {
                    ...row,
                    callCountFormat: row.callCount.toLocaleForAries(),
                    percentageFormat: `${row.percentage.toFixed(2)}%`,
                };
            })
            .sort((a, b) => b.callCount - a.callCount);
    },
    resizePage(state) {
        state.tableHeight = window.innerHeight - 208;
    },
};
