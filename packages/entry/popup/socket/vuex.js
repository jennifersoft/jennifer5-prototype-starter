import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';

export const NAMESPACE = 'socketDetail';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        stackTraces: [],
    },
    mutations: {
        updateSocketDetail(state, data) {
            state.stackTraces = data.map(row => row.stack);
        },
    },
    actions: {
        async loadSocketDetail({ commit }, payload) {
            const { data } = await axios.get('/analysis/find/socket', {
                params: {
                    format: 'json',
                    sid: payload.domainId,
                    agent: payload.instanceOid,
                    key: payload.socketKey,
                },
            });

            commit('updateSocketDetail', data);
        },
    },
});

export default store;
