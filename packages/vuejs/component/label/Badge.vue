<template>
    <span class="badge" :class="type">
        {{ value }}
    </span>
</template>

<script>
export default {
    name: 'Badge',
    props: {
        value: {
            type: [Number, String],
            required: true,
        },
        type: {
            type: String,
            default: 'primary',
            validator(t) {
                return (
                    [
                        'primary',
                        'secondary',
                        'success',
                        'warning',
                        'danger',
                        'info',
                    ].indexOf(t) !== -1
                );
            },
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.badge {
    @include themify($themes) {
        display: inline-block;
        padding: 0 4px;
        text-align: center;
        background: themed('background-color-purple');
        color: themed('typography-color-white');
        font-weight: normal;
        font-size: 11px;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;

        &.primary {
            background: themed('background-color-purple');
        }

        &.secondary {
            background: themed('toggle-color-disabled');
        }

        &.danger {
            background: themed('background-color-red');
        }

        &.success {
            background: themed('background-color-green');
        }

        &.info {
            background: themed('background-color-blue');
        }

        &.warning {
            background: themed('background-color-yellow');
            color: #212121;
        }
    }
}
</style>
