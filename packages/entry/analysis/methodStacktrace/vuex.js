import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import axios from '@library/axios';
import { UIManager } from '@common/legacy/UIManager';
import * as methodTreeStore from '@entry/analysis/loadedClasses/store/methodTree';
import { getDayjs, serverDateFormat } from '@common/base';

export const NAMESPACE = 'analysis/methodStacktrace';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        domain: {
            sid: -1,
            oid: -1,
        },
        tableData: [],
        loading: false,
        selectedRow: null,
    },
    mutations: {
        updateDomain(state, config) {
            const { sid, oid } = config;
            state.domain.sid = sid;
            state.domain.oid = oid;
        },
        updateTableData(state, list = []) {
            state.tableData = list;
        },
        updateLoading(state, flag) {
            state.loading = flag;
        },
        updateSelectedRow(state, data = null) {
            state.selectedRow = data;
        },
    },
    getters: {
        isDomainValid(state) {
            const { sid, oid } = state.domain;
            return sid !== -1 && oid !== -1;
        },
    },
    actions: {
        async loadMethodStacktraceData({ state, commit, getters }) {
            if (getters.isDomainValid) {
                commit('updateLoading', true);

                const { sid, oid } = state.domain;
                const { status, data: json } = await axios.get(
                    '/analysis/methodStacktrace/list',
                    {
                        params: {
                            format: 'json',
                            sid,
                            oid,
                        },
                    }
                );
                if (status === 200) {
                    commit(
                        'updateTableData',
                        json.map(e => ({
                            ...e,
                            timestamp: getDayjs(e.time).format(
                                serverDateFormat.long
                            ),
                        }))
                    );
                }
                commit('updateLoading', false);
            } else {
                commit('updateTableData');
            }
        },
        async receiveStacktrace({ state, commit, getters }, { key }) {
            if (getters.isDomainValid) {
                const { sid, oid } = state.domain;
                const { data: status } = await axios.post(
                    '/analysis/methodStacktrace/receive',
                    null,
                    {
                        params: {
                            format: 'json',
                            sid,
                            oid,
                            key,
                        },
                    }
                );
                if (status) {
                    commit(
                        'updateTableData',
                        state.tableData.map(e => {
                            if (e.key !== key) return e;
                            return {
                                ...e,
                                stack: '',
                                newStack: '1',
                            };
                        })
                    );
                }
            }
        },
        async removeStacktrace({ state, getters, dispatch }) {
            if (getters.isDomainValid) {
                const { sid, oid } = state.domain;
                await axios.post('/analysis/methodStacktrace/clear', null, {
                    params: {
                        format: 'json',
                        sid,
                        oid,
                    },
                });
                await dispatch('loadMethodStacktraceData');
            }
        },
        async addStacktraceClass({ state, getters, dispatch }, name) {
            if (getters.isDomainValid) {
                const { sid, oid } = state.domain;
                const { data: res } = await axios.post(
                    '/analysis/methodStacktrace/add',
                    null,
                    {
                        params: {
                            format: 'json',
                            sid,
                            oid,
                            clazz: name,
                        },
                    }
                );
                if (res) await dispatch('loadMethodStacktraceData');
            }
        },
        async removeStacktraceClasses(
            { state, commit, getters, dispatch },
            keys
        ) {
            if (getters.isDomainValid) {
                const { sid, oid } = state.domain;
                const { data: res } = await axios.post(
                    '/analysis/methodStacktrace/remove',
                    null,
                    {
                        params: {
                            format: 'json',
                            sid,
                            oid,
                            keys,
                        },
                    }
                );
                if (res) await dispatch('loadMethodStacktraceData');
            }
        },
        openStacktracePopup({ state, getters }, data) {
            if (getters.isDomainValid) {
                const { sid, oid } = state.domain;
                UIManager.methodStacktraceDetail(
                    '/popup/methodStacktrace?sid=' + sid + '&oid=' + oid,
                    data
                );
            }
        },
    },
});

export const {
    mapState: mapMethodTreeState,
    mapMutations: mapMethodTreeMutations,
    mapActions: mapMethodTreeActions,
    mapGetters: mapMethodTreeGetters,
} = createNamespacedHelpers(methodTreeStore.NAMESPACE);

store.registerModule(methodTreeStore.NAMESPACE, {
    namespaced: true,
    state: methodTreeStore.state,
    getters: methodTreeStore.getters,
    mutations: methodTreeStore.mutations,
    actions: methodTreeStore.actions,
});

export default store;
