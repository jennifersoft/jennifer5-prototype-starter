<template>
    <div
        :class="[
            'input-field-wrapper',
            size,
            disabled && 'disabled',
            focused && 'focused',
            isValid,
        ]"
        :style="{ width: width && width + 'px' }"
    >
        <label class="input-label" v-if="label">{{ label }}</label>
        <div class="input-field-inline">
            <slot name="icon-left"></slot>
            <input
                :style="{ textAlign: align }"
                :disabled="disabled"
                :value="value"
                :placeholder="placeholder"
                :name="name"
                :type="type"
                :autocomplete="autocomplete"
                @focus="onFocus"
                @blur="onBlur"
                @input="onInput"
                @keyup.enter="onPressEnter"
            />
            <svg-icon
                v-if="!!validator && isValid === 'invalid'"
                :icon-type="ICON_TYPE.close"
                :style="{ color: '#ff4f55', cursor: 'pointer' }"
                :height="iconSize"
                :width="iconSize"
                @click.native="onInput({ target: { value: '' } })"
            />
            <svg-icon
                v-else-if="!!validator && isValid === 'valid'"
                :icon-type="ICON_TYPE.check"
                :style="{ color: '#49d484' }"
                :height="iconSize"
                :width="iconSize"
            />
            <slot name="icon-right" :size="iconSize"></slot>
        </div>
        <span class="unit" v-if="unit">{{ unit }}</span>
        <popup-list
            v-if="showDropdown"
            ref="dropdownRef"
            no-scroll
            :items="filteredList"
            :size="dropdownSize"
            @update:active-index="onSelectDropdown"
        />
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import SizeMixin from "@vuejs/mixin/SizeMixin";

export default {
    name: 'InputField',
    mixins: [SizeMixin],
    inject: {
        // JQA-651: 일본어 입력 예외 처리
        language: {
            default: 'en',
        }
    },
    components: {
        PopupList,
        SvgIcon,
    },
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        value: {
            type: [String, Number],
            default: '',
        },
        validator: {
            type: Function,
            default: null,
        },
        invalid: {
            type: Boolean,
            default: undefined,
        },
        placeholder: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: null,
        },
        unit: {
            type: String,
            default: null,
        },
        width: Number,
        dropdownList: {
            type: Array,
            default: undefined,
        },
        align: {
            type: String,
            default: 'default',
            validator(v) {
                return ['left', 'right', 'default'].includes(v);
            },
        },
        name: {
            // USAGE: form tag에 감싸서 submit 기능을 사용할 때
            type: String,
            default: null,
        },
        type: {
            type: String,
            default: 'text',
        },
        autocomplete: {
            type: String,
            default: 'on',
        }
    },
    model: {
        prop: 'value',
        event: 'input',
    },
    data() {
        return {
            focused: false,
            ICON_TYPE,
            showDropdown: false,
        };
    },
    computed: {
        isValid() {
            if (this.invalid !== undefined) return this.invalid ? 'invalid' : 'default';
            if (!this.validator || !this.value) return 'default';
            return this.validator && this.validator(this.value)
                ? 'valid'
                : 'invalid';
        },
        iconSize() {
            switch (this.size) {
                case 'small':
                    return 16;
                case 'normal':
                    return 18;
                case 'large':
                    return 20;
            }
        },
        dropdownSize() {
            return this.size === 'small' || this.size === 'normal'
                ? 'size-small'
                : 'size-medium';
        },
        filteredList() {
            return this.dropdownList.filter(l => l.text.startsWith(this.value));
        },
    },
    methods: {
        onFocus() {
            if (!this.validator) {
                this.focused = true;
                if (this.dropdownList && this.filteredList.length > 0)
                    this.showDropdown = true;
                this.$emit('focus');
            }
        },
        onBlur() {
            this.focused = false;
            this.$emit('blur');
        },
        onInput({ target }) {
            this.$emit('input', target.value);
        },
        onPressEnter({ target }) {
            if (this.language === 'ja') return;
            target.blur();
        },
        onSelectDropdown(index) {
            const filteredIndex = this.dropdownList.findIndex(
                l => l.text === this.filteredList[index].text
            );
            this.onInput({
                target: {
                    value: this.dropdownList[filteredIndex].text,
                },
            });
            this.showDropdown = false;
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin size($f, $r) {
    width: 100%;
    font-size: $f + px;
    border-radius: $r + px;
}
@mixin borderRadiusRight($r) {
    border-top-right-radius: $r + px;
    border-bottom-right-radius: $r + px;
}
@mixin borderRadiusLeft($r) {
    border-top-left-radius: $r + px;
    border-bottom-left-radius: $r + px;
}
.input-field-wrapper {
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        display: inline-flex;
        position: relative;
        cursor: text;
        box-sizing: border-box;
        border: 1px solid themed('border-color');
        transition: border .25s;
        &.large {
            height: 46px;
            line-height: 44px;
            @include size(16, 4);
            .input-field-inline,
            .input-label,
            .unit {
                padding: 0 14px;
            }
            .input-label {
                @include borderRadiusLeft(4);
            }
            .unit {
                @include borderRadiusRight(4);
            }
        }
        &.normal {
            height: 36px;
            line-height: 34px;
            @include size(14, 2);
            .input-field-inline,
            .input-label,
            .unit {
                padding: 0 10px;
            }
            .input-label {
                @include borderRadiusLeft(2);
            }
            .unit {
                @include borderRadiusRight(2);
            }
        }
        &.small {
            height: 26px;
            line-height: 24px;
            @include size(12, 2);
            .input-field-inline,
            .input-label,
            .unit {
                padding: 0 6px;
            }
            .input-label {
                @include borderRadiusLeft(2);
            }
            .unit {
                @include borderRadiusRight(2);
            }
        }

        &.focused {
            border: 1px solid #8652ff;
        }

        &.invalid {
            border: 1px solid #ff4f55;
        }

        .input-field-inline {
            flex: 1;
            display: inline-flex;
            align-items: center;
            input {
                flex: 1;
                border: none;
                outline: none;
                color: themed('typography-color-primary');
                background-color: transparent;
                &::placeholder {
                    color: themed('typography-color-grey2');
                }
                max-width: 100%;
                width: 100%;

                &[type="number"]{
                    -moz-appearance: textfield;
                    &::-webkit-outer-spin-button,
                    &::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                }
            }
        }

        .input-label,
        .unit {
            background-color: themed('field-background-color-disabled');
            color: themed('typography-color-grey1');
        }

        .input-label {
            border-right: 1px solid themed('border-color');
        }

        .unit {
            border-left: 1px solid themed('border-color');
        }

        &.disabled {
            border: none;
            background-color: themed('field-background-color-disabled');
            input {
                color: themed('typography-color-grey2');
            }
        }
    }

    .row-list {
        top: 100%;
        border-radius: 0 0 3px 3px;
    }
}
</style>
