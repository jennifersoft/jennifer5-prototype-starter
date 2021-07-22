<template>
    <input-field :value="value"
                 :type="displayType"
                 :name="name"
                 :placeholder="placeholder"
                 :autocomplete="autocomplete"
                 :invalid="invalid"
                 @input="onInput"
                 @blur="onBlur"
                 :[size]="true">
        <template #icon-right="{ size }">
            <svg-icon :icon-type="iconType"
                      :width="size"
                      :height="size"
                      @click.native="toggleDisplayType"
                      style="cursor: pointer;"/>
        </template>
    </input-field>
</template>

<script>
import InputField from "@vuejs/component/Input/InputField";
import SizeMixin from "@vuejs/mixin/SizeMixin";
import SvgIcon from "@vuejs/component/icon/SvgIcon";
import {ICON_TYPE} from "@vuejs/component/icon/iconType";

export default {
    name: "PasswordInput",
    components: {
        InputField,
        SvgIcon,
    },
    mixins: [
        SizeMixin,
    ],
    props: {
        value: {
            type: String,
            default: '',
        },
        name: {
            // USAGE: form tag에 감싸서 submit 기능을 사용할 때
            type: String,
            default: null,
        },
        placeholder: {
            type: String,
            default: null,
        },
        autocomplete: {
            type: String,
            default: 'on',
        },
        invalid: {
            type: Boolean,
            default: undefined,
        }
    },
    model: {
        prop: 'value',
        event: 'input',
    },
    data() {
        return {
            showPassword: false,
        }
    },
    computed: {
        iconType() {
            return this.showPassword ? this.icons.visibilityOff : this.icons.visibility;
        },
        displayType() {
            return this.showPassword ? 'text' : 'password';
        }
    },
    methods: {
        toggleDisplayType() {
            this.showPassword = !this.showPassword;
        },
        onBlur() {
            this.focused = false;
            this.$emit('blur');
        },
        onInput(val) {
            this.$emit('input', val);
        },
    },
    created() {
        this.icons = {
            visibility: ICON_TYPE.visibility,
            visibilityOff: ICON_TYPE.visibilityOff,
        };
    }
}
</script>

<style scoped>

</style>