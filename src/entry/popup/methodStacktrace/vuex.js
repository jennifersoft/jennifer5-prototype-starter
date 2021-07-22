import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';

export const NAMESPACE = 'methodStacktraceDetail';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        stackTrace: '',
    },
    mutations: {
        updateMethodStacktrace(state, data) {
            state.stackTrace = data.stack;
        },
    },
    actions: {
        async loadMethodStacktrace({ commit }, payload) {
            const { data } = await axios.get(
                '/analysis/find/methodStacktrace',
                {
                    params: {
                        format: 'json',
                        sid: payload.domainId,
                        oid: payload.instanceOid,
                        key: payload.methodKey,
                    },
                }
            );

            commit('updateMethodStacktrace', data);
        },
    },
});

export default store;
