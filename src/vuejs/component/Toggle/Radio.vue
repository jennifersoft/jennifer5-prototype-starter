<template>
    <div
        :class="['aries-radio-wrapper', size, disabledClass]"
        :style="cssValues"
        @click="change"
    >
        <span
            :class="['aries-radio', activeClass]"
            id="aries-radio-input"
        ></span>
        <label class="aries-radio-label" for="aries-radio-input">{{
            label
        }}</label>
    </div>
</template>

<script>
import toggleMixin from '@vuejs/mixin/ToggleMixin';
export default {
    name: 'Radio',
    mixins: [toggleMixin],
    props: {
        normal: Boolean,
        large: Boolean,
    },
    computed: {
        size() {
            return this.large ? 'large' : 'normal';
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin size($r, $t) {
    width: $r + px;
    height: $r + px;
    border-radius: 50%;
    border-width: $t + px;
    border-style: solid;
}
.aries-radio-wrapper {
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        &.large {
            .aries-radio {
                @include size(24, 2);
                &.on {
                    @include size(24, 8);
                }
            }
            font-size: 14px;
        }
        &.normal {
            .aries-radio {
                @include size(16, 1.5);
                &.on {
                    @include size(16, 5);
                }
            }
            font-size: 12px;
        }

        .aries-radio {
            display: inline-block;
            box-sizing: border-box;
            border-color: themed('toggle-border-color-off');

            &.on {
                border-color: themed('toggle-border-color-on');
            }
        }
        .aries-radio-label {
            display: inline-block;
            margin-left: 0.8em;
            vertical-align: top;
            cursor: pointer;
            color: var(--label-color, #{themed('typography-color-grey1')});
        }

        &.disabled {
            cursor: default;
            /*opacity: 0.5;*/
            .aries-radio {
                border-color: themed('toggle-color-disabled');
            }
            .aries-radio-label {
                cursor: default;
                opacity: 0.5;
            }
        }
    }
}
</style>
