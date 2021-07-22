import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'userAgent';
export const {
    mapState,
    mapGetters,
    mapActions,
    mapMutations,
} = createNamespacedHelpers(NAMESPACE);
