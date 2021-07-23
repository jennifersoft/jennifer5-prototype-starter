<template>
    <div
        :class="['search-input-wrapper', { blurred }]"
        :style="{ width: width && width + 'px' }"
        @keypress.enter="onSearch"
    >
        <input-field
            :value="value"
            :placeholder="placeholder"
            :small="small"
            :normal="normal"
            :large="large"
            @input="onChange"
            @blur="onBlur"
            @focus="onFocus"
        >
            <template #icon-left>
                <svg-icon
                    class="icon-inline left"
                    :style="{ marginRight: iconSize / 4 + 'px' }"
                    :icon-type="ICON_TYPE.search"
                    :height="iconSize"
                    :width="iconSize"
                    @click.native="onSearch"
                />
            </template>
            <template #icon-right>
                <svg-icon
                    v-if="cancelable && value.length > 0"
                    class="icon-inline right"
                    :style="{ marginLeft: iconSize / 4 + 'px' }"
                    :icon-type="ICON_TYPE.cancel"
                    :height="iconSize"
                    :width="iconSize"
                    @click.native.stop="clear"
                />
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
    name: 'Search',
    components: {
        SvgIcon,
        InputField,
    },
    mixins: [SizeMixin],
    props: {
        value: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: null,
        },
        width: Number,
        cancelable: {
            type: Boolean,
            default: true,
        },
    },
    model: {
        prop: 'value',
        event: 'change',
    },
    data() {
        return {
            ICON_TYPE,
            blurred: false,
        };
    },
    computed: {
        iconSize() {
            if (this.small) return 16;
            if (this.large) return 20;
            else return 18;
        },
    },
    watch: {
        value(newVal, oldVal) {
            // 값을 공백으로 변경하면, 액티브 효과 없애도록 수정
            if (newVal === '' && oldVal !== '') this.onFocus();
        },
    },
    methods: {
        onChange(value) {
            this.$emit('change', value);
        },
        onSearch() {
            this.$emit('search');
        },
        clear() {
            this.onChange('');
            this.onFocus();
            this.$emit('clear');
        },
        onFocus() {
            this.blurred = false;
        },
        onBlur() {
            if (this.value) {
                this.blurred = true;
            }
            this.$emit('blur');
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.search-input-wrapper {
    @include themify($themes) {
        display: inline-flex;
        .icon-inline {
            transition: color 0.18s;
            cursor: pointer;
            color: themed('typography-color-grey1');
            &:hover {
                color: themed('typography-color-primary');
            }
        }

        &.blurred {
            border-radius: 3px;
            background: themed('background-color-lightpurple');
            .input-field-wrapper {
                border-color: transparent;
                ::v-deep input {
                    color: themed('typography-color-purple');
                }
            }
            .icon-inline {
                color: themed('typography-color-purple');
            }
        }
    }
}
</style>
