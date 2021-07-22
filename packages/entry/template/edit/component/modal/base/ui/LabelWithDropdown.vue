<template>
    <div class="label-with-dropdown">
        <span :style="{ opacity: disabled ? 0.5 : 1 }">{{ label }}</span>
        <dropdown
            small
            :width="width"
            :items="items"
            :selected-value="selectedValue"
            :disabled="disabled"
            @onchange="data => $emit('change', data)"
        ></dropdown>
    </div>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';

export default {
    components: {
        Dropdown,
    },
    props: {
        label: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        selectedValue: {
            type: [String, Number],
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../../../../themes';

.label-with-dropdown {
    @include themify($themes) {
        display: inline-flex;
        margin: 0px;

        > span {
            display: inline-block;
            font-size: 12px;
            font-style: normal;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            padding: 0px 10px;
            max-height: 24px;
            line-height: 24px;
            color: themed('common-font-color');
            border-left: 1px solid themed('label-with-dropdown-border-color');
            border-top: 1px solid themed('label-with-dropdown-border-color');
            border-bottom: 1px solid themed('label-with-dropdown-border-color');
            background-color: themed('label-with-dropdown-background-color');
        }

        ::v-deep .aries-ui-dropdown {
            margin-left: -1px;
            border-top-left-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
        }
    }
}
</style>
