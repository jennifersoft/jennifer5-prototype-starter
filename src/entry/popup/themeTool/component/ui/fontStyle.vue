<template>
    <div class="font-style">
        <dropdown
            :items="fontSizeItems"
            :selected-value="fontSize"
            @onchange="item => $emit('change-font-size', item)"
            style="width: 55px;"
        ></dropdown>
        <dropdown
            :items="fontWeightItems"
            :selected-value="fontWeight"
            @onchange="item => $emit('change-font-weight', item)"
            style="width: 100px;"
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
        fontSize: {
            type: Number,
            required: false,
            default: 10,
        },
        fontWeight: {
            type: String,
            required: false,
            default: 'normal',
        },
    },
    data() {
        return {
            fontSizeItems: [...Array(9).fill(8)].map((item, index) => ({
                text: `${item + index}`,
                value: item + index,
            })),
            fontWeightItems: [
                {
                    text: 'normal',
                    value: 'normal',
                },
                {
                    text: 'bold',
                    value: 'bold',
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
.font-style {
    display: inline-flex;
}

/deep/ .aries-ui-dropdown {
    text-align: left;
    &:first-child {
        margin-right: 3px;
    }
}
</style>
