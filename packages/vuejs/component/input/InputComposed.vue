<template>
    <div
        :class="['input-form-wrapper', size]"
        :style="{ width: width && width + 'px' }"
    >
        <input-field
            :small="small"
            :normal="normal"
            :large="large"
            :value="value"
            :placeholder="placeholder"
            @input="onChange"
        />
        <btn
            :items="[{ text: buttonLabel }]"
            class="primary"
            :[size]="true"
            @click="onSubmit"
        />
    </div>
</template>

<script>
import InputField from '@vuejs/component/input/InputField';
import Btn from '@vuejs/component/button/Btn';
import SizeMixin from '@vuejs/mixin/SizeMixin';

export default {
    name: 'InputComposed',
    components: {
        InputField,
        Btn,
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
        buttonLabel: {
            type: String,
            required: true,
            default: '',
        },
        width: Number,
    },
    model: {
        prop: 'value',
        event: 'input',
    },
    methods: {
        onChange(newValue) {
            this.$emit('input', newValue);
        },
        onSubmit() {
            this.$emit('submit');
        },
    },
};
</script>

<style lang="scss" scoped>
.input-form-wrapper {
    display: inline-flex;
    box-sizing: border-box;
    width: 100%;
    .input-field-wrapper {
        flex: 1;
        border-right: none !important;
        border-top-right-radius: initial !important;
        border-bottom-right-radius: initial !important;
    }

    .aries-ui-btn {
        border-top-left-radius: initial !important;
        border-bottom-left-radius: initial !important;
    }
}
</style>
