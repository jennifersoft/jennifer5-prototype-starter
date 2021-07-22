import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
// import store from '@vuejs/vuex/store';
import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'db/connPool';
export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);
export const { mapGetters: mapRootGetters } = createNamespacedHelpers('domain');

export const store = {
    NAMESPACE,
    state,
    mutations,
    actions,
    getters,
};
