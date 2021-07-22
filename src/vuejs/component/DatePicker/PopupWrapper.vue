<template>
    <transition name="fade" :appear="type !== 'inline'">
        <div class="popup-wrapper" :class="[type]">
            <div class="header">
                <svg-icon
                    :icon-type="arrowBackward"
                    :width="iconSize"
                    :height="iconSize"
                    @click.native="$emit('prev')"
                />
                <slot name="title"></slot>
                <svg-icon
                    :icon-type="arrowForward"
                    :width="iconSize"
                    :height="iconSize"
                    @click.native="$emit('next')"
                />
            </div>
            <slot name="calendar"></slot>
        </div>
    </transition>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'PopupWrapper',
    components: {
        SvgIcon,
    },
    props: {
        type: {
            type: String,
            default: 'single',
            validator: type => ['single', 'inline'].indexOf(type) !== -1,
        },
        applyI18nMessage: {
            type: String,
            default: '적용',
        },
        cancelI18nMessage: {
            type: String,
            default: '취소',
        },
    },
    data() {
        return {
            arrowBackward: ICON_TYPE.arrowBack,
            arrowForward: ICON_TYPE.arrowForward,
        };
    },
    computed: {
        iconSize() {
            return this.type === 'inline' ? 16 : 24;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.popup-wrapper {
    @include themify($themes) {
        position: absolute;
        z-index: 1000;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.08),
            0 1px 3px 0 rgba(0, 0, 0, 0.2);
        background: themed('window-background-color');
        max-width: 315px;
        min-width: 315px;
        box-sizing: border-box;
        overflow: hidden;
        .header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 24px;
            margin-bottom: 16px;
            color: themed('typography-color-primary');
            user-select: none;

            .icon {
                transition: color 0.2s;
                color: themed('typography-color-grey2');
                cursor: pointer;

                &:hover {
                    color: themed('typography-color-grey1');
                }
            }
        }
        .footer {
            float: right;
            margin: 40px -16px -16px;
        }

        &.inline {
            position: relative;
            box-shadow: none;
            max-width: 258px;
            min-width: 258px;
            padding: 16px;
            border: 1px solid themed('border-color');
            background: none;
            border-radius: 3px;
            height: 100%;
            .header {
                margin-bottom: 11px;
                line-height: 16px;
            }
        }
    }
}

.fade-enter-active {
    transition: all 0.3s;
}
.fade-leave-active {
    transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
