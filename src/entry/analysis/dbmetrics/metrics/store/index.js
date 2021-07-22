import { state } from '@entry/analysis/dbmetrics/metrics/store/state';
import { mutations } from '@entry/analysis/dbmetrics/metrics/store/mutations';
import { getters } from '@entry/analysis/dbmetrics/metrics/store/getters';
import { actions } from '@entry/analysis/dbmetrics/metrics/store/actions';

import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'db/metrics';
export const {
    mapState,
    mapGetters,
    mapActions,
    mapMutations,
} = createNamespacedHelpers(NAMESPACE);
export const { mapGetters: mapRootGetters } = createNamespacedHelpers('domain');

export const store = {
    state,
    mutations,
    getters,
    actions,
    NAMESPACE,
};
