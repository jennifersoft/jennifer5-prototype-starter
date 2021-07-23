<template>
    <div
        class="aries-ui-format-number-input"
        :style="cssValues"
        @keydown="isNumber"
    >
        <input-field
            :value="useLocale ? formattedValue : currentValue"
            :small="small"
            :normal="normal"
            :large="large"
            :label="label"
            :unit="unit"
            :align="align"
            :disabled="disabled"
            :type="useLocale ? 'text' : 'number'"
            @focus="onFocus"
            @blur="onBlur"
            @input="onInput"
        >
            <template #icon-right v-if="useStepper">
                <div class="right">
                    <svg-icon
                        :icon-type="accumulators"
                        :width="18"
                        :height="18"
                    />
                    <div class="arrow up" @click="onClickArrow('up')"></div>
                    <div class="arrow down" @click="onClickArrow('down')"></div>
                </div>
            </template>
        </input-field>
    </div>
</template>

<script>
import InputField from '@vuejs/component/input/InputField';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import SizeMixin from '@vuejs/mixin/SizeMixin';

export default {
    name: 'FormatNumberInput',
    components: { SvgIcon, InputField },
    mixins: [SizeMixin],
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Number,
            default: 0,
        },
        label: {
            type: String,
            default: null,
        },
        unit: {
            type: String,
            default: null,
        },
        formatter: {
            type: Function,
            default: n => n.toLocaleString(),
        },
        width: Number,
        step: {
            type: Number,
            default: 1,
        },
        max: {
            type: Number,
            default: Number.MAX_SAFE_INTEGER,
            validator(max) {
                return max <= Number.MAX_SAFE_INTEGER;
            },
        },
        min: {
            type: Number,
            default: 0,
            validator(min) {
                return min >= 0;
            },
        },
        useStepper: {
            type: Boolean,
            default: false,
        },
        align: {
            type: String,
            default: 'default',
            validator(v) {
                return ['left', 'right', 'default'].includes(v);
            },
        },
        useLocale: {
            // NOTICE: true일 때 한글이 입력될 수 있음.
            type: Boolean,
            default: false,
        },
    },
    model: {
        props: 'value',
        event: 'input',
    },
    data() {
        return {
            editing: false,
            currentValue: this.value,
        };
    },
    watch: {
        value(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.currentValue = this.value;
            }
        },
    },
    computed: {
        formattedValue() {
            return this.editing || !this.formatter
                ? this.currentValue
                : this.formatter(this.currentValue);
        },
        size() {
            // small by default
            return (
                (this.normal && 'normal') || (this.large && 'large') || 'small'
            );
        },
        cssValues() {
            const marginRight = this.size === 'small' ? -4 : 0;
            return {
                width: this.width && this.width + 'px',
                '--arrow-margin-right': marginRight + 'px',
            };
        },
    },
    methods: {
        onFocus() {
            this.editing = true;
        },
        onBlur() {
            this.editing = false;
            this.$emit('input', parseFloat(this.currentValue));
        },
        onInput(value) {
            if (value.match(/^\d+$/)) {
                this.currentValue =
                    value > this.max
                        ? this.max
                        : value < this.min
                        ? this.min
                        : parseFloat(value);
            }
        },
        increase() {
            const remain = this.currentValue % this.step;
            let updated = this.currentValue;
            updated = this.currentValue + this.step - remain;
            if (updated > this.max || updated < this.min) return;
            this.currentValue = updated;
            this.$emit('input', parseFloat(this.currentValue));
        },
        decrease() {
            const remain = this.currentValue % this.step;
            let updated = this.currentValue;
            if (remain !== 0) updated -= remain;
            else updated -= this.step;
            if (updated > this.max || updated < this.min) return;
            this.currentValue = updated;
            this.$emit('input', parseFloat(this.currentValue));
        },
        isNumber(e) {
            const { key } = e;

            switch (key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                case 'Backspace':
                case 'Tab':
                case 'ArrowLeft':
                case 'ArrowRight':
                    break;
                case 'ArrowUp':
                    this.increase();
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    this.decrease();
                    e.preventDefault();
                    break;
                default:
                    e.preventDefault();
            }
        },
        onClickArrow(type) {
            if (type === 'up') this.increase();
            else this.decrease();
        },
    },
    created() {
        this.accumulators = ICON_TYPE.unfoldMore;
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.aries-ui-format-number-input {
    @include themify($themes) {
        display: inline-flex;
        position: relative;
        .right {
            position: relative;
            display: inline-flex;
            align-items: center;
            margin-left: 4px;
            margin-right: var(--arrow-margin-right, 0);
            ::v-deep svg > path {
                fill: themed('icon-color');
            }

            .arrow {
                position: absolute;
                height: 9px;
                width: 18px;
                z-index: 10;
                cursor: pointer;

                &.up {
                    top: 0;
                }

                &.down {
                    bottom: 0;
                }
            }
        }
    }
}
</style>
