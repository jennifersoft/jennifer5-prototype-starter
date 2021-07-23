<template>
    <div
        :class="['aries-switch-wrapper', size, disabledClass]"
        :style="toggleSwitch"
        @click="change"
    >
        <span class="aries-switch-label" v-if="labelPosition === 'left'">{{ label }}</span>
        <div :class="['aries-switch', activeClass]">
            <span class="button"></span>
            <input :name="name" :value="active" hidden v-if="!!name"/>
        </div>
        <span class="aries-switch-label" v-if="labelPosition === 'right'">{{ label }}</span>
    </div>
</template>

<script>
import InputMixin from '@vuejs/mixin/ToggleMixin';
export default {
    name: 'ToggleSwitch',
    mixins: [InputMixin],
    props: {
        small: Boolean,
        normal: Boolean,
        large: Boolean,
        label: String,
        switchColor: {
            type: String,
            default: undefined,
        },
        switchButtonColor: {
            type: String,
            default: undefined,
        },
        labelPosition: {
            type: String,
            default: 'left',
            validator(p) {
                return ['left', 'right'].includes(p);
            }
        },
        name: {
            // USAGE: form tag에 감싸서 submit 기능을 사용할 때
            type: String,
            default: null,
        },
    },
    computed: {
        size() {
            return (
                (this.large && 'large') || (this.small && 'small') || 'normal'
            );
        },
        toggleSwitch() {
            const ret = this.cssValues;

            if (this.switchColor) ret['--switch-color'] = this.switchColor;
            if (this.switchButtonColor)
                ret['--switch-button-color'] = this.switchButtonColor;
            return ret;
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin size($w, $h) {
    width: $w + px;
    height: $h + px;
    border-radius: $h / 2 + px;
}
.aries-switch-wrapper {
    display: inline-flex;
    user-select: none;
    cursor: pointer;
    align-items: center;

    > :first-child {
        margin-right: 0.8em;
    }

    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        .aries-switch {
            position: relative;
            display: inline-block;
            cursor: pointer;
            box-sizing: border-box;
            box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.05);
            background-color: themed('switch-background-color-off');
            transition: background-color 0.15s;

            .button {
                position: absolute;
                left: 0;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
                background-color: themed('switch-button-color-off');
                transition: background-color 0.15s, left 0.2s;
            }

            &.on {
                background-color: var(
                    --switch-color,
                    themed('switch-background-color-on')
                );

                .button {
                    background-color: var(
                        --switch-button-color,
                        themed('toggle-border-color-on')
                    );
                }
            }
        }

        &.large {
            .aries-switch {
                @include size(48, 16);

                .button {
                    @include size(24, 24);
                    top: -3px;
                }

                &.on .button {
                    left: calc(100% - 24px);
                }
            }
            .aries-switch-label {
                font-size: 14px;
            }
        }

        &.normal {
            .aries-switch {
                @include size(30, 12);

                .button {
                    @include size(16, 16);
                    top: -2px;
                }

                &.on .button {
                    left: calc(100% - 16px);
                }
            }
            .aries-switch-label {
                font-size: 12px;
            }
        }

        &.small {
            .aries-switch {
                @include size(18, 6);
                vertical-align: middle;

                .button {
                    @include size(10, 10);
                    top: -2px;
                }

                &.on .button {
                    left: calc(100% - 10px);
                }
            }
            .aries-switch-label {
                font-size: 12px;
            }
        }

        .aries-switch-label {
            display: inline-block;
            color: var(--label-color, #{themed('typography-color-grey1')});
        }

        &.disabled {
            cursor: default;
            .aries-switch {
                background-color: themed('switch-disabled-background-color');
                cursor: default;

                .button {
                    background-color: themed('switch-disabled-button-color');
                }
            }
            .aries-switch-label {
                opacity: 0.5;
            }
        }
    }
}
</style>
