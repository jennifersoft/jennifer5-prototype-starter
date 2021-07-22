import { createNamespacedHelpers } from 'vuex';
export const NAMESPACE = 'socketAnalysis';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);
