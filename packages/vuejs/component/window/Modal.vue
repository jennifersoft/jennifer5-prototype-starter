<template>
    <div
        class="aries-ui-modal"
        :class="{ show: isShow }"
        :style="{
            '--contents-width': contentsWidth + 'px',
            '--contents-height': contentsHeight + 'px',
            '--offset-top': offsetTop + 'px',
        }"
    >
        <window
            class="confirm-window"
            :close-btn-type="closeBtnType"
            :messages="{
                cancel: i18n.cancel,
                apply: i18n.apply,
            }"
            :draggable="false"
            :hide-footer="hideFooter"
            :hide-cancel-btn="hideCancelBtn"
            @apply="apply"
            @cancel="cancel"
        >
            <slot name="subject" />
            <slot />
        </window>
    </div>
</template>
<script>
import Window from '@vuejs/component/window/Window';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
export default {
    name: 'Modal',
    components: {
        Window,
    },
    props: {
        isShow: {
            type: Boolean,
            required: true,
        },
        contentsWidth: {
            type: Number,
            default: 300,
        },
        contentsHeight: {
            type: Number,
            default: 50,
        },
        offsetTop: {
            type: Number,
            default: 120,
        },
        closeBtnType: {
            type: String,
            default: 'none', // 'none' if don't need
        },
        hideCancelBtn: {
            type: Boolean,
            default: false,
        },
        hideFooter: {
            type: Boolean,
            default: false,
        },
    },
    inject: {
        i18n: {
            default: {
                apply: 'apply',
                cancel: 'cancel',
            },
        },
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },

        apply() {
            this.$emit('apply');
        },
    },
};
</script>
<style lang="scss" scoped>
.aries-ui-modal {
    &:not(.show) {
        //https://stackoverflow.com/questions/3331353/transitions-on-the-css-display-property
        //display: none 은 에니메이션이 show,hide 양쪽 다 불가
        visibility: hidden;
        transition: visibility 0s 0.3s;
        .confirm-window {
            opacity: 0;
            transform: translateY(-50px);
            transition: opacity 0.3s, transform 0.3s ease-out;
        }
    }

    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10000;
    top: 0;
    left: 0;
    transition: visibility 0s;
    .confirm-window {
        opacity: 1;
        left: calc(50% - var(--contents-width) * 0.5);
        top: var(--offset-top);
        transition: opacity 0.3s, transform 0.3s ease-out;
        transform: none;
        ::v-deep > {
            div.head {
                cursor: default;
            }
            div.body > div {
                width: var(--contents-width);
                height: var(--contents-height);
            }
        }
        z-index: 10001;
    }
}
</style>
