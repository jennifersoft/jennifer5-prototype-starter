<template>
    <div :class="nodeClass" :style="nodeStyle" @click.stop="onClickNodeLabel">
        <span v-if="!leaf" class="fold-box">
            <svg-icon
                :icon-type="foldBox"
                :width="14"
                :height="14"
                :class="['carrot', fold ? 'close' : 'open']"
                @click.native="onClickFoldIcon"
            />
        </span>
        <span v-else class="fold-empty"></span>

        <checkbox v-if="useCheckBox" :active="check" :disabled="disable" />

        <span v-if="iconBox != null" class="icon-box">
            <svg-icon :icon-type="iconBox" :width="16" :height="16" />
        </span>

        <span class="node-label" :title="label">{{ label }}</span>
    </div>
</template>

<script>
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    inject: {
        useCheckBox: {
            default: false,
        },
    },
    components: {
        Checkbox,
        SvgIcon,
    },
    props: {
        nodeKey: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: false,
            default: '',
        },
        depth: {
            type: Number,
            required: false,
            default: 0,
        },
        leaf: {
            type: Boolean,
            required: false,
            default: true,
        },
        fold: {
            type: Boolean,
            required: false,
            default: true,
        },
        check: {
            type: Boolean,
            required: false,
            default: false,
        },
        disable: {
            type: Boolean,
            required: false,
            default: false,
        },
        icon: {
            type: String,
            required: false,
            default: null,
        },
    },
    computed: {
        iconBox() {
            return ICON_TYPE.hasOwnProperty(this.icon)
                ? ICON_TYPE[this.icon]
                : null;
        },
        nodeStyle() {
            return {
                'padding-left': `${this.depth * 16 + 4}px`,
            };
        },
        nodeClass() {
            return [
                'node',
                this.check ? 'active' : '',
                this.disable ? 'disabled' : '',
            ];
        },
    },
    data() {
        return {
            foldBox: ICON_TYPE.hierarchyOpen,
        };
    },
    methods: {
        onClickFoldIcon() {
            this.$emit('change-node-fold', this.nodeKey);
        },
        onClickNodeLabel(e) {
            if (!this.disable) {
                const clazz = e.target.className;
                // 체크박스 아이콘과 노드 텍스트만 클릭 이벤트를 허용한다.
                if (
                    clazz === 'node-label' ||
                    clazz === 'icon' ||
                    clazz === 'checkbox on' ||
                    clazz === 'checkbox off'
                ) {
                    this.$emit('click-node-label', [this.nodeKey, !this.check]);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';

$node-height: 24px;
$border-radius: 4px;

.node {
    @include themify($themes) {
        color: themed('typography-color-grey1');

        &:hover:not(.disabled):not(.active):not(.noInteraction) {
            background-color: themed('behaviors-hover-color');
            color: themed('typography-color-primary');
        }
        &.active:not(.disabled) {
            color: themed('typography-color-purple');
            background-color: themed('background-color-lightpurple');
        }
    }

    display: flex;
    align-items: center;
    user-select: none;
    z-index: 1;
    border-radius: $border-radius;
    margin-right: 4px;
    cursor: pointer;
    transition: 0.2s ease-out;
    transition-property: background-color, color, transform, opacity,
        border-radius;

    &.disabled {
        > *:not(.fold-box) {
            opacity: 0.5 !important;
        }
        > .aries-checkbox,
        .node-label {
            cursor: not-allowed !important;
        }
    }

    > .fold-box {
        display: flex;
        align-items: center;

        > .carrot {
            z-index: 3;
            margin: 0 6px 0 3px;
            transition: 0.2s ease-out;
            transform: rotate(-90deg);
            &.open {
                transform: rotate(0);
            }
        }
    }
    > .fold-empty {
        width: 23px;
    }

    > .icon-box {
        display: flex;
        align-items: center;
        height: $node-height;
        margin-right: 6px;
    }

    > .node-label {
        height: $node-height;
        line-height: $node-height;
        font-size: 12px;
        -webkit-font-smoothing: antialiased;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
    }
}
</style>
