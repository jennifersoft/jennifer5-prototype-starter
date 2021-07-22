import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import state from './store/state';
import mutations from './store/mutations';
import actions from './store/actions';

export const NAMESPACE = 'domainSettings';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state,
    mutations,
    actions,
});
