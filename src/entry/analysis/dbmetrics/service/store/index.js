import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'db/service';
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);
export const { mapGetters: mapRootGetters } = createNamespacedHelpers('domain');

import { state } from './state';
import { mutations } from './mutations';
import { actions } from './actions';

export const store = {
    NAMESPACE,
    state,
    mutations,
    actions,
};
