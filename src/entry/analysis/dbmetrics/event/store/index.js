import { state } from '@entry/analysis/dbmetrics/event/store/state';
import { mutations } from '@entry/analysis/dbmetrics/event/store/mutations';
import { getters } from '@entry/analysis/dbmetrics/event/store/getters';
import { actions } from '@entry/analysis/dbmetrics/event/store/actions';
export const NAMESPACE = 'db/event';

export const store = {
    state,
    mutations,
    getters,
    actions,
    NAMESPACE,
};

import { createNamespacedHelpers } from 'vuex';
export const {
    mapState,
    mapGetters,
    mapActions,
    mapMutations,
} = createNamespacedHelpers(NAMESPACE);
export const { mapGetters: mapRootGetters } = createNamespacedHelpers('domain');
