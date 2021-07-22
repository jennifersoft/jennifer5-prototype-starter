import state from '@entry/analysis/dbmetrics/error/store/state';
import mutations from '@entry/analysis/dbmetrics/error/store/mutations';
import actions from '@entry/analysis/dbmetrics/error/store/actions';
import getters from '@entry/analysis/dbmetrics/error/store/getters';

import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'db/error';
export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);
export const { mapGetters: mapRootGetters } = createNamespacedHelpers('domain');

export const store = {
    state,
    mutations,
    actions,
    getters,
    NAMESPACE,
};
