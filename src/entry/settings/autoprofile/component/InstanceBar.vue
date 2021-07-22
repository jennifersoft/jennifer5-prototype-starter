<template>
    <div class="instance-bar">
        <div
            :class="createItemClass(item)"
            v-for="item in items"
            @click="() => $emit('select', item.instanceId)"
        >
            <svg-icon
                :icon-type="iconOptions.type"
                :width="iconOptions.size"
                :height="iconOptions.size"
                v-if="item.autoProfiled"
            ></svg-icon>
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    components: {
        SvgIcon,
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
        selectedItem: {
            type: Number,
            required: false,
            default: -1,
        },
    },
    data() {
        return {
            iconOptions: {
                type: ICON_TYPE.check,
                size: 14,
            },
        };
    },
    methods: {
        createItemClass(item) {
            const classes = ['item'];
            if (item.autoProfiled) classes.push('checked');
            if (item.instanceId === this.selectedItem) classes.push('selected');
            return classes;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.instance-bar {
    @include themify($themes) {
        width: 100%;

        > .item {
            display: inline-block;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 500;
            border-radius: 12px;
            margin-top: 4px;
            cursor: pointer;
            color: themed('instance-bar-item-font-color');

            &:not(:last-child) {
                margin-right: 4px;
            }
            &.checked {
                color: themed('instance-bar-item-checked-font-color');
                background-color: themed(
                    'instance-bar-item-checked-background-color'
                );
            }
            &.selected {
                color: themed('instance-bar-item-selected-font-color');
                background-color: themed(
                    'instance-bar-item-selected-background-color'
                );
            }
            &.checked.selected {
                color: themed('instance-bar-item-checked-font-color');
                background-color: themed(
                    'instance-bar-item-checked-and-selected-background-color'
                );
            }
            &:hover {
                color: themed('instance-bar-item-selected-font-color');
                background-color: themed(
                    'instance-bar-item-hover-background-color'
                );
            }
            svg {
                margin-bottom: -2px;
            }
        }
    }
}
</style>
