<template>
    <span class="thread-status-badge">
        <label class="status-label">{{ label }}</label>
        <span class="status-value"
              :class="color">
            {{ value.toLocaleForAries() }}
        </span>
    </span>
</template>

<script>
    export default {
        name: "StatusBadge",
        props: {
            label: String,
            value: Number,
            color: {
                type: String,
                default: 'primary',
                validator(c) {
                    return ['primary', 'red', 'blue'].includes(c);
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
@import "~@vuejs/component/themes.scss";
.thread-status-badge {
    @include themify($themes) {
        height: 26px;
        line-height: 26px;
        padding: 0 8px;
        display: inline-flex;
        align-items: center;
        .status-label {
            color: themed('typography-color-grey2');
            margin-right: 8px;
        }
        .status-value {
            font-weight: bold;
            color: themed('typography-color-primary');
            &.red {
                color: themed('typography-color-red');
            }
            &.blue {
                color: themed('background-color-blue');
            }
        }
    }
}
</style>