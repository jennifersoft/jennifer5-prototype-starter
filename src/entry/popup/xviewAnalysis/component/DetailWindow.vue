<template>
    <window
        class="detail-window"
        draggable
        :open-w="width"
        :open-h="height"
        :open-x="left"
        :open-y="top"
        :min-top="minTop"
        :messages="{
            apply: i18n.apply,
            cancel: i18n.cancel,
        }"
        @cancel="() => $emit('cancel')"
    >
        <loading-indicator v-if="loading" />
        <template #subject><slot name="subject"></slot></template>
        <slot name="contents"></slot>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import LoadingIndicator from "@vuejs/component/Loading/LoadingIndicator";

export default {
    components: {
        Window,
        LoadingIndicator,
    },
    inject: {
        i18n: {
            default: {
                apply: 'Apply',
                cancel: 'Cancel',
                sqlDetail: 'SQL Detail',
            },
        },
    },
    props: {
        top: {
            type: Number,
            required: false,
            default: 24,
        },
        left: {
            type: Number,
            required: false,
            default: 24,
        },
        width: {
            type: Number,
            required: false,
            default: 610,
        },
        height: {
            type: Number,
            required: false,
            default: 440,
        },
        minTop: {
            type: Number,
            required: false,
            default: undefined,
        },
        loading: {
            type: Boolean,
            default: false,
        }
    },
};
</script>

<style lang="scss">
@import '../themes.scss';

.detail-window {
    @include themify($themes) {
        pre {
            width: calc(100% - 20px);
            height: 310px;
            overflow: auto;
            font-size: 12px;
            border-radius: 4px;
            border: 1px solid themed('detail-window-pre-border-color');
            padding: 13px 10px;
        }

        .foot {
            display: none !important;
        }
    }
}
</style>
