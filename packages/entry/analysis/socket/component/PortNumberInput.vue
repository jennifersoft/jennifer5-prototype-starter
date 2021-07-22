<template>
    <input-field :value="value"
                 :placeholder="placeholder"
                 :width="144"
                 @input="onInput"
                 @blur="$emit('blur')"
                 @keydown.native="isNumber"
                 small />
</template>

<script>
import InputField from "@vuejs/component/Input/InputField";
export default {
    name: "PortNumberInput",
    components: {
        InputField,
    },
    props: {
        value: {
            type: [String, Number],
            default: '',
        },
        placeholder: {
            type: String,
            default: null,
        },
    },
    methods: {
        onInput(val) {
            this.$emit('input', val);
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
    }
}
</script>

<style scoped>

</style>