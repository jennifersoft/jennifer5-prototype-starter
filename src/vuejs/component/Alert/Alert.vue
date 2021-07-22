<template>
    <transition :name="transitionName" appear>
        <div class="aries-ui-alert"
             :class="[type, { toast }]"
             :style="cssValue">
            <div class="alert-content">
                <svg-icon :icon-type="infoIcon" :width="16" :height="16" />
                <span class="alert-message">{{ message }}</span>
            </div>
            <btn
                v-if="showCloseBtn"
                :items="[{ iconType: closeIcon }]"
                class="close-btn transparent"
                @click="$emit('close')"
            />
        </div>
    </transition>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Btn from '@vuejs/component/button/Btn';

export default {
    name: 'Alert',
    components: {
        SvgIcon,
        Btn,
    },
    props: {
        width: {
            type: Number,
            default: undefined,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'normal',
            validator(t) {
                return [
                    'normal',
                    'danger',
                    'warning',
                    'success',
                    'info',
                ].includes(t);
            },
        },
        showCloseBtn: {
            type: Boolean,
            default: false,
        },
        fadeDown: {
            type: Boolean,
            default: false,
        },
        toast: {
            type: Boolean,
            default: false,
        },
        fitContent: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        cssValue() {
            return {
                '--alert-width': !!this.width
                    ? this.width + 'px' : this.fitContent
                    ? 'fit-content' : '100%',
            };
        },
        transitionName() {
            return this.fadeDown ? 'fade-down' : 'default';
        }
    },
    created() {
        this.infoIcon = ICON_TYPE.info;
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
@import '~@vuejs/transition/fade-down.scss';

@include fade-down;

.aries-ui-alert {
    @include themify($themes) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: min-content;
        width: var(--alert-width);
        box-sizing: border-box;
        padding: 12px;
        border-radius: 4px;
        color: themed('typography-color-primary');

        .alert-content {
            display: flex;
            align-items: center;
            .alert-message {
                line-height: 22px;
                font-size: 12px;
                margin-left: 4px;
            }
            .icon {
                flex-shrink: 0;
            }
        }
        .close-btn {
            float: right;
            margin: -2px;
            ::v-deep .icon {
                color: themed('alert-close-btn-color');
            }
        }

        &.normal {
            background: themed('alert-background-normal');
        }
        &.danger {
            background: themed('alert-background-danger');
        }
        &.success {
            background: themed('alert-background-success');
        }
        &.info {
            background: themed('alert-background-info');
        }
        &.warning {
            background: themed('alert-background-warning');
            color: #212121;
        }

        &.toast {
            position: fixed;
            bottom: 120px;
            width: 360px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
        }
    }
}
</style>
