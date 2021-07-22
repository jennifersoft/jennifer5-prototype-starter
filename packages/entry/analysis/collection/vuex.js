import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import axios from '@library/axios';
import { UIManager } from '@common/legacy/UIManager';
import { AgentFeatureCodeDef } from '@common/definition';
import { getDayjs, serverDateFormat } from '@common/base';

export const NAMESPACE = 'analysis/collection';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

function getColList(list, tmpColList) {
    for (var i = 0; i < list.length; i++) {
        if (!tmpColList[list[i].hash]) {
            tmpColList[list[i].hash] = list[i].size;
            list[i].dsize = 0;
        } else {
            list[i].dsize = list[i].size - tmpColList[list[i].hash];
        }
        list[i].nameWithType =
            list[i].elementTypeOrEmpty !== null &&
            list[i].elementTypeOrEmpty !== ''
                ? `${list[i].name} ${list[i].elementTypeOrEmpty}`
                : list[i].name;
    }

    return { data: list, tmpColList };
}

export const state = {
    domain: {
        sid: -1,
        oid: -1,
    },
    agentStatus: '',
    selectedRow: {},
    tmpColList: {},
    tableData: [],
    autoStacktraceCount: 0,
    minimumStacktraceCount: 0,
};

export const mutations = {
    updateDomain(state, config) {
        const { sid, oid } = config;
        state.domain.sid = sid;
        state.domain.oid = oid;
    },
    updateAgentStatus(state, status) {
        state.agentStatus = status;
    },
    updateSelectedRow(state, row = null) {
        state.selectedRow = row;
    },
    updateTmpColList(state, list = {}) {
        state.tmpColList = list;
    },
    updateTableData(state, list) {
        state.tableData = list;
    },
    updateAutoStacktraceCount(state, count) {
        state.autoStacktraceCount = count;
    },
    updateMinimumStacktraceCount(state, count) {
        state.minimumStacktraceCount = count;
    },
};

export const getters = {
    isDomainValid(state) {
        const { sid, oid } = state.domain;
        return sid !== -1 && oid !== -1;
    },
};

export const actions = {
    async loadCollectionData({ state, getters, commit }, updateConfig = false) {
        const { sid, oid } = state.domain;

        if (getters.isDomainValid) {
            const { data: json, status } = await axios.get(
                '/analysis/collection',
                {
                    params: {
                        format: 'json',
                        sid: sid,
                        agent: oid,
                    },
                }
            );

            // auto_stack_trace_count: 1000
            // list: Array(20)
            // 0: {stack: "", size: 654, application: "Unknown", name: "java.util.Vector", newstack: false, …}
            // 1: {stack: "", size: 137, application: "Unknown", name: "java.util.Vector", newstack: false, …}
            // minimum_trace_count: 100
            // start: 0
            // total: 21

            if (!!json?.list) {
                const {
                    auto_stack_trace_count,
                    list,
                    minimum_trace_count,
                } = json;
                const { data, tmpColList } = getColList(list, state.tmpColList);
                commit(
                    'updateTableData',
                    data.map(e => ({
                        ...e,
                        timestamp: getDayjs(e.time).format(
                            serverDateFormat.long
                        ),
                    }))
                );
                commit('updateTmpColList', tmpColList);
                if (updateConfig) {
                    commit('updateAutoStacktraceCount', auto_stack_trace_count);
                    commit('updateMinimumStacktraceCount', minimum_trace_count);
                }
            } else {
                commit('updateTableData', []);
                commit('updateAutoStacktraceCount', 0);
                commit('updateMinimumStacktraceCount', 0);
            }
        }
    },
    async checkAgentSupport({ state, getters, commit }) {
        const { sid, oid } = state.domain;

        if (getters.isDomainValid) {
            const { data: status } = await axios.get('/agent/feature', {
                params: {
                    format: 'json',
                    sid,
                    oid,
                    code: AgentFeatureCodeDef.SOCKET_NEW_ALL_STACK,
                },
            });
            commit('updateAgentStatus', status);
        }
    },
    async receiveStacktrace({ state, getters, dispatch }, { key }) {
        const { sid, oid: agent } = state.domain;

        if (getters.isDomainValid) {
            await axios.get('/analysis/collection/stacktrace', {
                params: {
                    format: 'json',
                    sid,
                    agent,
                    keys: key,
                },
            });
            dispatch('loadCollectionData');
        }
    },
    async receiveStacktraceAll({ state, getters, dispatch }) {
        const { sid, oid: agent } = state.domain;
        if (getters.isDomainValid) {
            await axios.get('/analysis/collection/stacktraceall', {
                params: {
                    format: 'json',
                    sid,
                    agent,
                },
            });
            dispatch('loadCollectionData');
        }
    },
    async clearStacktrace({ state, getters, dispatch }) {
        const { sid, oid: agent } = state.domain;
        if (getters.isDomainValid) {
            await axios.post('/analysis/collection/stackclear', null, {
                params: {
                    sid,
                    agent,
                },
            });
            dispatch('loadCollectionData');
        }
    },
    async gcStacktrace({ state, getters, dispatch }) {
        const { sid, oid: agent } = state.domain;
        if (getters.isDomainValid) {
            await axios.post('/analysis/collection/gc', null, {
                params: {
                    sid,
                    agent,
                },
            });
            dispatch('loadCollectionData');
        }
    },
    async saveStacktraceConfig(
        { state, getters, dispatch },
        { minimumStacktrace: mintracecnt, autoStacktrace: autotracecnt }
    ) {
        const { sid, oid: agent } = state.domain;
        await axios.post('/analysis/collection/savetraceinfo', null, {
            params: {
                sid,
                agent,
                mintracecnt,
                autotracecnt,
            },
        });
        dispatch('loadCollectionData', true);
    },
    openStacktraceDetail({ state }) {
        const { sid, oid } = state.domain;
        const { key, nameWithType } = state.selectedRow;
        UIManager.popup(
            '/popup/collection?sid=' +
                sid +
                '&agent=' +
                oid +
                '&key=' +
                key +
                '&name=' +
                nameWithType,
            800,
            600
        );
    },
};

store.registerModule(NAMESPACE, {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
});

export default store;
