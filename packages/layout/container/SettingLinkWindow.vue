<template>
    <div class="setting-link-window" v-if="activeWindow">
        <confirm-window
            :message="i18n.M0673"
            @apply="onApplySettingPageLink"
            @cancel="() => $emit('close')"
        ></confirm-window>
    </div>
</template>

<script>
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import { mapState, mapMutations } from '@layout/vuex';
import { SIDEBAR_ITEM_TYPE } from '@layout/constant';

export default {
    inject: ['i18n'],
    components: {
        ConfirmWindow,
    },
    props: {
        url: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...mapState({
            activeLayer: state => state.activeLayer,
        }),
        activeWindow() {
            return (
                this.activeLayer === SIDEBAR_ITEM_TYPE.MANAGEMENT &&
                this.url !== ''
            );
        },
    },
    methods: {
        ...mapMutations(['updateMngData', 'updateActiveLayer']),
        onApplySettingPageLink() {
            this.updateMngData(null);
            this.updateActiveLayer(null);
            this.$emit('close');
            location.href = this.url;
        },
    },
};
</script>

<style lang="scss" scoped>
.setting-link-window {
    ::v-deep .confirm-window {
        z-index: 10000 !important;
    }
}
</style>
