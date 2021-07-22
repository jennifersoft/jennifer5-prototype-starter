import { createNamespacedHelpers } from "vuex";

export const STORE_NAMESPACE = 'qb';
export const { mapState, mapMutations } = createNamespacedHelpers(STORE_NAMESPACE);