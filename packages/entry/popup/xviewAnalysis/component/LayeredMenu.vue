<template>
    <div class="layered-menu" :style="style">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        top: {
            type: [Number, String],
            required: false,
            default: 'auto',
        },
        left: {
            type: [Number, String],
            required: false,
            default: 'auto',
        },
        right: {
            type: [Number, String],
            required: false,
            default: 'auto',
        },
        bottom: {
            type: [Number, String],
            required: false,
            default: 'auto',
        },
        width: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    computed: {
        style() {
            const top =
                typeof this.top == 'number' ? `${this.top}px` : this.top;
            const left =
                typeof this.left == 'number' ? `${this.left}px` : this.left;
            const right =
                typeof this.right == 'number' ? `${this.right}px` : this.right;
            const bottom =
                typeof this.bottom == 'number'
                    ? `${this.bottom}px`
                    : this.bottom;
            const width = this.width === 0 ? 'auto' : `${this.width}px`;
            return {
                top,
                left,
                right,
                bottom,
                width,
                'z-index': 1001,
            };
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';

.layered-menu {
    @include themify($themes) {
        position: absolute;
        background-color: themed('window-background-color');
        border: 1px solid themed('border-color');
        border-radius: 3px;
        .row-list {
            position: relative !important;
            width: 100%;
            border: none;
            border-radius: 0;
            &:last-child {
                border-radius: 0 0 3px 3px;
            }
            &:not(:first-child) {
                border-top: 1px solid themed('tab-border-bottom-color');
            }
            ::v-deep li.row {
                /* TODO: JUI 스타일 적용으로 인한 스타일 버그 수정 */
                width: 100% !important;
                display: block !important;
            }
        }
        .aries-ui-btn {
            width: inherit;
        }
    }
}
</style>
