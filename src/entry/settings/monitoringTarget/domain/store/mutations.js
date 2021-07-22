function createDefaultDomain() {
    return {
        sid: 1000,
        shortName: '',
        longName: '',
        ip: '',
        port: 8000,
        order: 0,

        autoRemove: false,
        autoRemoveTimeInMinute: 0,
        newAssignForDuplication: false,
        batchJob: false,
        namingRule: 1, // 1(Instance 이름), 2(Host 이름), 3(설정 파일 이름), 4(IP)
        visitUserRule: 1, // 1(클라이언트 ID), 2(클라이언트 IP)
        initialAgent: -1,
    };
}

export default {
    setUseDomainGroup(state, active) {
        state.useDomainGroup = active;
    },
    updateDomainGroupTree(state, tree) {
        state.domainGroupTree = tree;
    },
    updateDomainList(state, { data, status }) {
        state.domainList = data.map(item => {
            return {
                status: status[item.sid],
                ...item,
            };
        });
    },
    addCheckedDomainIds(state, rows) {
        const domainIdSet = new Set();

        state.checkedDomainIds.forEach(domainId => {
            domainIdSet.add(domainId);
        });
        rows.filter(row => !row.checked).forEach(row => {
            domainIdSet.delete(row.sid);
        });
        rows.filter(row => row.checked).forEach(row => {
            domainIdSet.add(row.sid);
        });

        state.checkedDomainIds = domainIdSet;
    },
    resetCheckedDomainIds(state) {
        state.checkedDomainIds = new Set();
    },
    selectDetailDomain(state, payload) {
        state.screenMode = 'modify';
        state.selectedDomain = payload;
    },
    addDetailDomain(state) {
        state.screenMode = 'write';
        state.selectedDomain = createDefaultDomain();
    },
    backToScreenMode(state) {
        state.screenMode = 'list';
        state.checkedDomainIds = new Set();
        state.selectedDomain = null;
    },
};
