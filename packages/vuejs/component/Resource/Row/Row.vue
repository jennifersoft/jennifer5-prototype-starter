<template>
    <div
        class="row"
        :class="[
            {
                disabled,
                active,
                tail: selected || tailStyle,
                hide,
                noMovingRow,
                noInteraction,
                noFoldPadding,
                large,
            },
        ]"
        @click="rowClickHandler"
    >
        <span v-for="d in indent" :key="d" class="indent" />

        <span v-if="!foldable && !noFoldPadding" class="fold-padding"></span>
        <span v-if="foldable" class="fold-box" @click.stop="foldClickHandler">
            <svg-icon
                :icon-type="openIcon"
                :width="iconSize"
                :height="iconSize"
                :class="['carrot', fold]"
            />
        </span>

        <checkbox
            v-if="checkable"
            :active="check === 'on'"
            :disabled="disabled"
        />
        <Icon :resource-type="resourceType"
              :status="status" />
        <span class="row-label">{{ label }}</span>

        <img
            v-if="disabled && showWarningIcon"
            class="warning-notation"
            src="./assets/warning.svg"
            name="warning"
            :title="warningMessageText"
        />
        <div v-if="disabled" class="disabled-panel"></div>
    </div>
</template>

<script>
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Icon from '../Icon/ResourceIcon.vue';
import { RESOURCE_TYPES, RESOURCE_STATUS_TYPES } from '../types';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
const FOLD_STATES = ['no-fold', 'close', 'open'];
const CHECK_STATES = ['no-check', 'on', 'off'];

export default {
    inject: {
        warningMessageText: {
            default: '삭제되었거나 정지된 Instance입니다.', //M0437
        },
    },
    components: {
        SvgIcon,
        Checkbox,
        Icon,
    },
    props: {
        hide: {
            type: Boolean,
            default: false,
        },
        indent: {
            type: Number,
            default: 0,
        },
        resourceType: {
            type: String,
            validator: v => RESOURCE_TYPES.includes(v),
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        fold: {
            type: String,
            validator: v => FOLD_STATES.includes(v),
            default: FOLD_STATES[0],
        },
        noFoldPadding: {
            type: Boolean,
            default: false,
        },
        check: {
            type: String,
            validator: v => CHECK_STATES.includes(v),
            default: CHECK_STATES[0],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        showWarningIcon: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Boolean,
            default: false,
        },
        tailStyle: {
            type: Boolean,
            default: false,
        },
        noMovingRow: {
            type: Boolean,
            default: false,
        },
        noInteraction: {
            type: Boolean,
            default: false,
        },
        large: {
            type: Boolean,
            default: false,
        },
        status: {
            type: [String, undefined],
            default: undefined,
            validator(s) {
                return s === undefined
                    || RESOURCE_STATUS_TYPES.includes(s);
            }
        }
    },
    computed: {
        foldable() {
            return this.fold !== FOLD_STATES[0];
        },
        checkable() {
            return this.check !== CHECK_STATES[0];
        },
        checked() {
            return this.check === CHECK_STATES[1];
        },
        active() {
            return this.selected || this.check === 'on';
        },
        iconSize() {
            return this.large ? 16 : 12;
        }
    },
    data() {
        return {
            openIcon: ICON_TYPE.hierarchyOpen,
        };
    },
    methods: {
        rowClickHandler() {
            if (this.disabled) {
                return;
            }
            if (this.checkable) {
                this.$emit('checkClicked');
                return;
            }
            if (this.noInteraction) {
                this.$emit('foldClicked');
            }
            this.$emit('rowClicked');
        },
        foldClickHandler() {
            this.$emit('foldClicked');
        },
        checkClickHandler() {
            if (this.disabled) {
                return;
            }
            this.$emit('checkClicked');
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$border-radius: 4px;

$themes: (
    classic: (
            typography-color-primary: #212121,
            typography-color-purple: #6330ee,
            typography-color-grey1: #616161,
            behaviors-hover-color: rgba(0, 0, 0, 0.05),
            background-color-lightpurple: #ede2ff,
            bg-color-disabled: white,
    ),
    dark: (
            typography-color-primary: #e8e8e8,
            typography-color-purple: #a47cff,
            typography-color-grey1: #999999,
            behaviors-hover-color: rgba(255, 255, 255, 0.05),
            background-color-lightpurple: #35294d,
            bg-color-disabled: black,
    ),
);

.row {

    --row-height: 24px;
    --indent-width: 16px;
    --font-size: 12px;
    --padding: 4px;
    --fold-margin: 4px;
    --label-margin: 6px;

    &.large {
        --row-height: 40px;
        --indent-width: 22px;
        --font-size: 14px;
        --padding: 12px;
        --fold-margin: 6px;
        --label-margin: 8px;
    }

    @include themify($themes) {
        z-index: 1;
        transition: 0.2s ease-out;
        transition-property: background-color, color, transform, opacity,
            border-radius;
        position: relative;
        display: flex !important;
        align-items: center;
        font-size: 0;
        height: var(--row-height, 24px);
        padding: 0 var(--padding, 4px);
        border-radius: $border-radius;
        margin: 0 !important;
        cursor: pointer;
        user-select: none;
        color: themed('typography-color-grey1');

        &.noMovingRow {
            transition-property: background-color, color, opacity;
        }

        &.noFoldPadding {
            padding-left: 8px;
        }

        &:hover:not(.disabled):not(.active):not(.noInteraction) {
            background-color: themed('behaviors-hover-color');
            color: themed('typography-color-primary');
        }

        &.disabled {
            cursor: not-allowed !important;
            opacity: unset !important;
        }

        &.active:not(.disabled) {
            color: themed('typography-color-purple');
            background-color: themed('background-color-lightpurple');
        }

        &.hide {
            pointer-events: none;
            opacity: 0;
            height: 0;
            width: 0;
            overflow: hidden;
        }
        &.noInteraction {
            opacity: 0.65;
            &:after {
                display: block !important;
                content: '';
                border-radius: 4px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
        }

        &.active {
            border-radius: 0;
            &.tail {
                border-bottom-left-radius: $border-radius;
                border-bottom-right-radius: $border-radius;
            }
        }

        > .disabled-panel {
            z-index: 2;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            background-color: themed('bg-color-disabled');
            opacity: 0.5;
        }
    }

    > .indent, > .fold-padding {
        min-width: var(--indent-width, 16px);
        height: var(--row-height, 24px);
    }

    > .fold-box {
        display: flex;
        align-items: center;
        height: 100%;

        > .carrot {
            z-index: 3;
            margin-right: var(--fold-margin, 4px);

            transition: 0.2s ease-out;
            transform: rotate(-90deg);
            &.open {
                transform: rotate(0);
            }
        }
    }

    > .row-label {
        -webkit-font-smoothing: antialiased;
        font-size: var(--font-size, 12px);
        line-height: var(--row-height, 24px);
        margin-left: var(--label-margin, 6px);
        white-space: nowrap;
        flex: 1;
    }

    > .warning-notation {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 4px;
        z-index: 3;
        cursor: help;
    }
}

.row.active:first-of-type,
.row:not(.active) + .row.active {
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
}
</style>
