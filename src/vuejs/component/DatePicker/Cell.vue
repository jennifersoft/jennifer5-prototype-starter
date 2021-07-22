<template>
    <td class="datepicker-cell"
        :class="[
            {primary},
            {secondary},
            {'current': isToday},
            {'disabled': disabled || !isThisMonth}
        ]"
        @click="$emit('click')"
    >
        {{ isThisMonth ? digit : '' }}
    </td>
</template>

<script>
    export default {
        name: "DateCell",
        props: {
            value: {
                type: Object,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            primary: {
                type: Boolean,
                default: false
            },
            secondary: {
                type: Boolean,
                default: false
            },
            isToday: {
                type: Boolean,
                default: false
            },
            isThisMonth: {
                type: Boolean,
                default: true
            },
            type: {
                type: String,
                default: 'date'
            }
        },
        computed: {
            digit() {
                return this.type === 'date' ? this.value.date() : this.value.month() + 1;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@vuejs/component/themes.scss";
.datepicker-cell {
    @include themify($themes) {
        box-sizing: border-box;
        font-size: 12px;
        text-align: center;
        user-select: none;
        color: themed('typography-color-primary');
        border: 1px solid themed('tab-border-bottom-color');
        cursor: pointer;
        transition: background .2s, color .2s, border .2s;

        &:hover:not(.disabled):not(.primary):not(.secondary) {
            background: themed('toggle-behaviors-hover-color');
        }

        &.current {
            color: themed('typography-color-purple');
        }

        &.secondary {
            color: themed('typography-color-white');
            background: themed('switch-background-color-on');
            border: 1px double themed('switch-background-color-on');
            &:hover {
                opacity: 0.95;
            }
        }

        &.primary {
            color: themed('typography-color-white');
            background: themed('background-color-purple');
            border: 1px double themed('background-color-purple');
        }

        &.disabled {
            pointer-events: none;
            opacity: unset;
            &:not(.primary):not(.secondary) {
                opacity: 0.4;
            }
        }
    }
}
</style>