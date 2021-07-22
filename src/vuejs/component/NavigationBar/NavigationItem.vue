<template>
    <div class="navigation-item">
        <span v-if="label !== undefined" class="navigation-item-label">{{
            label
        }}</span>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'NavigationItem',
    props: {
        label: {
            type: String,
            default: undefined,
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.navigation-item {
    @include themify($themes) {
        .navigation-item-label {
            border: 1px solid themed('border-color');
            border-right: none;
            border-radius: 2px 0 0 2px;
            background-color: themed('field-background-color-disabled');
            color: themed('typography-color-grey1');
            font-size: 12px;
            line-height: 24px;
            padding: 0 6px;
        }
        .navigation-item-label + * {
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
        }

        .date-input-wrapper + .date-input-wrapper,
        .aries-ui-format-number-input + .aries-ui-format-number-input {
            margin-left: 18px;
            &::before {
                content: '~';
                color: themed('typography-color-primary');
                width: 18px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                left: -18px;
            }
        }
    }
}
</style>
