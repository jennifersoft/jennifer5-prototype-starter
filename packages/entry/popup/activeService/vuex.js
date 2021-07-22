import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import state from './store/state';
import mutations from './store/mutations';
import actions from './store/actions';

import {
    state as xviewState,
    mutations as xviewMutations,
    actions as xviewActions,
    getters as xviewGetters,
    NAMESPACE as xviewNamespace,
} from '@entry/popup/xviewAnalysis/store/base';

const NAMESPACE = 'activeService';

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
});

store.registerModule(xviewNamespace, {
    namespaced: true,
    state: xviewState,
    mutations: xviewMutations,
    actions: xviewActions,
    getters: xviewGetters,
});

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

export const xviewStoreHelper = createNamespacedHelpers(xviewNamespace);

export default store;
