import { createNamespacedHelpers } from 'vuex'

export const STORE_NAMESPACE = 'themeTool'
export const { mapState, mapMutations } = createNamespacedHelpers(
    STORE_NAMESPACE
)
