import { state } from '@entry/analysis/dbmetrics/disk/store/state';
import { mutations } from '@entry/analysis/dbmetrics/disk/store/mutations';
import { actions } from '@entry/analysis/dbmetrics/disk/store/actions';
import { getters } from '@entry/analysis/dbmetrics/disk/store/getters';
import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'db/disk';
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
