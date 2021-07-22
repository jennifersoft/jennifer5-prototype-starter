export default {
    loadParameters(state, params) {
        state.domainIds = params.domainId === -1 ? [] : [params.domainId];
        state.instanceOids =
            params.instanceOid === -1 ? [] : [params.instanceOid];
    },
    updateServiceDumpFiles(state, files) {
        state.serviceDumpFiles = files;
    },
    updateSearchDates(state, dates) {
        state.startDate = dates[0];
        state.endDate = dates[1];
    },
    updateSearchLoading(state, active) {
        state.searchLoading = active;
    },
    updateMemoryDumpLoading(state, active) {
        state.memoryDumpLoading = active;
    },
    updateDumpLoading(state, active) {
        state.dumpLoading = active;
    },
    updateDeleteLoading(state, active) {
        state.deleteLoading = active;
    },
};
