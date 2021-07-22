import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import axios from '@library/axios';

export const NAMESPACE = 'collection';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        params: {
            sid: '',
            agent: '',
            key: '',
        },
        codes: [],
    },
    mutations: {
        updateParams(state, params) {
            state.params = params;
        },
        updateCodes(state, codes) {
            state.codes = codes;
        },
    },
    actions: {
        async loadCodes({ commit }, config) {
            const { data } = await axios.get('/analysis/find/collection', {
                params: {
                    ...config,
                    format: 'json',
                },
            });
            const ret = [];
            for (let i = 0; i < data.length; i++) {
                ret.push(`<pre class="left">${data[i].stack}</pre>`);
            }
            commit('updateCodes', ret);
        },
    },
});

export default store;
