<template>
    <div class="parameters">
        <div class="parameter" v-for="(name, i) in names">
            <div class="key" v-if="keys[i]">{{ keys[i] }}</div>
            <input-field
                normal
                :value="name"
                v-model="names[i]"
                @blur="onChangeInputFields"
            ></input-field>
        </div>
    </div>
</template>

<script>
import InputField from '@vuejs/component/Input/InputField';

export default {
    components: {
        InputField,
    },
    props: {
        names: {
            type: Array,
            required: true,
        },
        keys: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    methods: {
        onChangeInputFields() {
            this.$emit('change', this.names);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.parameters {
    @include themify($themes) {
        > .parameter {
            margin-bottom: 8px;

            > .key {
                font-size: 11px;
                color: themed('parameter-font-color');
            }

            ::v-deep .input-field-wrapper .input-field-inline input {
                color: themed('parameter-font-color');
            }
        }
    }
}
</style>
