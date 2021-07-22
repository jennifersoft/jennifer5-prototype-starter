import { createNamespacedHelpers } from 'vuex';

export const STORE_NAMESPACE = 'talk';
export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    STORE_NAMESPACE
);
export const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'];
