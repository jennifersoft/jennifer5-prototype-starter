import store from '@vuejs/vuex/store';
import state from './store/state';
import mutations from './store/mutations';
import getters from './store/getters';
import actions from './store/actions';
import { createNamespacedHelpers } from 'vuex';

const NAMESPACE = 'regression';

store.registerModule(NAMESPACE, {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
});

export const {
    mapState,
    mapMutations,
    mapGetters,
    mapActions,
} = createNamespacedHelpers(NAMESPACE);

export default store;
