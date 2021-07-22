import store from '@vuejs/vuex/store';
import state from './store/state';
import mutations from './store/mutations';
import actions from './store/actions';
import getters from './store/getters';
import { createNamespacedHelpers } from 'vuex';

const NAMESPACE = 'service';

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
