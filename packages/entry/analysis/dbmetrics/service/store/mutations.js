function getHashKey(item) {
    return item.hash;
}

export const mutations = {
    updateDomainIds: (state, domainIds) => {
        state.domainIds = domainIds;
    },
    updateGroupData: (state, tree) => {
        const grouped = {};

        const checked = tree.filter(t => {
            return t.data.oid !== -1 && t.check === 'on';
        });

        const sids = tree
            .filter(t => {
                return t.data.oid === -1 && t.check === 'on';
            })
            .map(t => t.data.sid);
        sids.forEach(s => {
            grouped[s] = [];
        });

        checked.forEach(c => {
            grouped[c.data.sid] = [];
        });
        checked.forEach(c => {
            let id = c.data.oid;

            if (grouped.hasOwnProperty(c.data.sid)) {
                grouped[c.data.sid].push(id);
            } else {
                grouped[c.data.sid] = [id];
            }
        });

        state.groupData = grouped;
    },
    updateServiceMetrics: (state, data) => {
        state.serviceMetrics = data.map(row => row.value);
    },
    updateStartTime: (state, date) => {
        state.startTime = date;
    },
    updateEndTime: (state, date) => {
        state.endTime = date;
    },
    updateShowStartTimeOnly: (state, isActive) => {
        state.showStartTimeOnly = isActive;
    },
    updateIntervalType: (state, { value: type }) => {
        state.intervalType = type;
    },
    updateServiceType: (state, { value: type }) => {
        state.serviceType = type;
    },
    updateServiceNames: (state, data) => {
        state.serviceHashSet.clear();
        state.serviceHashes = data.map(e => {
            state.serviceHashSet.add(getHashKey(e));
            return { ...e, key: e.hash };
        });
    },
    removeServiceName: (state, { item: { hash } }) => {
        const newServiceHashes = [];

        state.serviceHashes.forEach(data => {
            if (data.hash != hash) {
                newServiceHashes.push(data);
            }
        });
        state.serviceHashes = newServiceHashes;
        state.serviceHashSet.delete(hash);
    },
    resetServiceNames: state => {
        state.serviceHashes = [];
    },
    updateServiceNameData(state, list) {
        state.serviceNameData = list;
    },
    updateTableData(state, list = []) {
        state.tableData = list;
    },
    updateServiceLoading(state, loading) {
        state.serviceLoading = loading;
    },
    updateTableLoading(state, loading) {
        state.tableLoading = loading;
    },
};
