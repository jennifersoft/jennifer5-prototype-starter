import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';

export const NAMESPACE = 'servicedumpDetail';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        text: '',
    },
    mutations: {
        updateText(state, text) {
            state.text = text;
        },
    },
    actions: {
        async loadText({ commit }, payload) {
            const { data } = await axios.get('/analysis/servicedump/get', {
                params: {
                    format: 'json',
                    sid: payload.domainId,
                    agent: payload.instanceOid,
                    fileName: payload.fileName,
                },
            });

            commit('updateText', data.detail);
        },
    },
});

export default store;
