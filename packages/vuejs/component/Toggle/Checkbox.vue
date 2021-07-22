<template>
    <div
        :class="['aries-checkbox-wrapper', size, disabled && 'disabled']"
        :style="cssValues"
        @click="change"
    >
        <span
            :class="['aries-checkbox', activeClass, {'no-margin': noDefaultMargin}]"
            id="aries-checkbox-input"
            @focus="$emit('focus')"
        >
            <img class="icon"
                 svg-inline
                 src="./asset/check.svg" />
        </span>
        <label
            class="aries-checkbox-label"
            for="aries-checkbox-input"
            v-if="label"
            >{{ label }}</label
        >
    </div>
</template>

<script>
import InputMixin from '@vuejs/mixin/ToggleMixin';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'Checkbox',
    mixins: [InputMixin],
    props: {
        normal: Boolean,
        large: Boolean,
        noDefaultMargin: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            ICON_TYPE,
        };
    },
    computed: {
        size() {
            return this.large ? 'large' : 'normal';
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin size($w, $h, $r: 0, $t: 1) {
    width: $w + px;
    height: $h + px;
    border-radius: $r + px;
    border-width: $t + px;
}
.aries-checkbox-wrapper {
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        &.large {
            .aries-checkbox {
                @include size(24, 24, 4, 2);
                .icon {
                    @include size(12, 11);
                }
            }
            font-size: 14px;
        }
        &.normal {
            .aries-checkbox {
                @include size(16, 16, 2);
                .icon {
                    @include size(9, 7);
                    margin-top: 1px;
                }
            }
            font-size: 12px;
        }

        .aries-checkbox {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            border-style: solid;
            border-color: themed('toggle-border-color-off');
            background-color: transparent;

            &:not(.no-margin) {
                margin-right: 0.7em;
            }

            .icon {
                flex: 1;
                visibility: hidden;
                > path {
                    fill: themed('dropdown-list-background-color');
                }
            }
            &.on {
                background-color: themed('toggle-border-color-on');
                border: none;
                > .icon {
                    visibility: visible;
                }
            }
        }
        .aries-checkbox-label {
            display: inline-block;
            vertical-align: top;
            cursor: pointer;
            color: var(--label-color, #{themed('typography-color-grey1')});
        }

        &.disabled {
            opacity: unset !important;
            cursor: not-allowed;
            .aries-checkbox {
                border-color: themed('toggle-color-disabled');
                &.on {
                    background-color: themed('toggle-color-disabled');
                    border: none;
                }
            }
            .aries-checkbox-label {
                cursor: not-allowed;
                opacity: 0.5;
            }
        }
    }
}
</style>
