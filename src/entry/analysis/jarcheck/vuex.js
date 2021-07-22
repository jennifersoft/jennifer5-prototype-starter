import store from '@vuejs/vuex/store';
import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';
import * as methodTreeStore from '@entry/analysis/loadedClasses/store/methodTree';

export const NAMESPACE = 'analysis/jarcheck';
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
        searchClass: '',
        tableData: [],
        loading: false,
    },
    mutations: {
        updateDomain(state, config) {
            const { sid, oid } = config;
            state.domain.sid = sid;
            state.domain.oid = oid;
        },
        updateSearchClass(state, text) {
            state.searchClass = text;
        },
        pushTableDataItem(state, [name, value]) {
            const cloned = state.tableData.slice();
            cloned.unshift({ key: name, value });
            state.tableData = cloned;
        },
        resetTableData(state) {
            state.tableData = [];
        },
        updateLoading(state, loading) {
            state.loading = loading;
        },
    },
    getters: {
        isDomainValid(state) {
            const { sid, oid } = state.domain;
            return sid !== -1 && oid !== -1;
        },
        isExist: state => ([name, _]) => {
            return state.tableData.map(e => e.key).includes(name);
        },
    },
    actions: {
        async loadJarcheckData({ state, commit, getters }) {
            if (getters.isDomainValid) {
                commit('updateLoading', true);

                const { sid, oid: agent } = state.domain;
                const { data: json } = await axios.get('/analysis/jarcheck', {
                    params: {
                        format: 'json',
                        sid,
                        agent,
                        clazz: state.searchClass,
                    },
                });
                if (!!json?.[1] && !getters.isExist(json)) {
                    commit('pushTableDataItem', json);
                }
                commit('updateLoading', false);
            } else {
                commit('resetTableData');
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
