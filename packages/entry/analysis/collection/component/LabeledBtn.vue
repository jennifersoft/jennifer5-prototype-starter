<template>
    <div class="labeled-button">
        <label v-if="!!label" class="label">{{ label }}</label>
        <btn :items="[{ text: value }]"
             :tooltip-options="tooltipOptions"
             @click="$emit('click')" />
    </div>
</template>

<script>
    import Btn from "@vuejs/component/button/Btn";
    import {ICON_TYPE} from "@vuejs/component/icon/iconType";

    export default {
        name: "LabeledBtn",
        components: {
            Btn,
        },
        props: {
            value: {
                type: String,
                required: true,
            },
            label: String,
            tooltipMessage: String,
        },
        computed: {
            tooltipOptions() {
                if (!this.tooltipMessage) return null;
                return {
                    message: this.tooltipMessage,
                    position: 'top-left',
                };
            },
        },
        created() {
            this.editIcon = ICON_TYPE.edit;
        }
    }
</script>

<style lang="scss" scoped>
@import "~@vuejs/component/themes.scss";

.labeled-button {
    display: inline-flex;
    @include themify($themes) {
        .label {
            box-sizing: border-box;
            border: 1px solid themed('border-color');
            border-right: none;
            border-radius: 2px 0 0 2px;
            background-color: themed('field-background-color-disabled');
            color: themed('typography-color-grey1');
            font-size: 12px;
            height: 26px;
            line-height: 24px;
            padding: 0 6px;
        }
        .label + * {
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
        }
    }
}
</style>