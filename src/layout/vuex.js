import store from '@vuejs/vuex/store';
import { state, getters, mutations, actions } from './store';
import { createNamespacedHelpers } from 'vuex';

const NAMESPACE = 'layout';

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters,
});

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export default store;
