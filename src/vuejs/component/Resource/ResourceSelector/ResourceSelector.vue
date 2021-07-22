<template>
    <div
        class="resource-selector-container"
        :class="[{ 'no-border': noBorder }]"
    >
        <tab
            v-if="!isOnlyOneTab"
            :tabs="resourceTypes"
            :active-tab="tab"
            @change="tabChangeHandler"
            flexible
            small
        />
        <div
            v-for="(r, i) in resources"
            :key="r.resourceType"
            class="tab-contents"
            :class="{
                active: r.resourceType === tab,
                'hide-tab': isOnlyOneTab,
            }"
        >
            <TabContents
                :ref="`tab-${i}`"
                :no-all-check="noAllCheck"
                :tree="r.tree"
                :selectable="selectable"
                :checkable="checkable"
                @treeChange="
                    tree => resourceChangeHandler(r.resourceType, tree)
                "
                @rowSelected="e => $emit('row-selected', e)"
                @rowUnselected="e => $emit('row-unselected', e)"
            />
        </div>
    </div>
</template>
<script>
import Tab from '@vuejs/component/tab/Tab';
import TabContents from '@vuejs/component/Resource/ResourceSelector/TabContents.vue';

import { RESOURCE_TYPES } from '@vuejs/component/Resource/types.js';

export function capitalizeFirstLetter(resourceType) {
    return resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
}
export default {
    components: {
        Tab,
        TabContents,
    },
    props: {
        tab: {
            type: String,
            default: '',
        },
        resources: {
            type: Array,
            required: true,
            validator: resources => {
                if (!resources.length) {
                    return false;
                }
                return resources.every(
                    r =>
                        RESOURCE_TYPES.includes(r.resourceType) &&
                        Array.isArray(r.tree)
                );
            },
        },
        noBorder: {
            type: Boolean,
            default: true,
        },
        noAllCheck: {
            type: Boolean,
            default: false,
        },
        selectable: {
            type: Boolean,
            default: false,
        },
        checkable: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        resourceTypes() {
            return this.resources.map(r => ({
                key: r.resourceType,
                value: capitalizeFirstLetter(r.resourceType),
            }));
        },
        isOnlyOneTab() {
            return this.resources.length === 1;
        },
    },
    methods: {
        tabChangeHandler(tabName) {
            this.$emit('tab-change', tabName);
        },
        resourceChangeHandler(resourceType, tree) {
            this.$emit('resource-change', { resourceType, tree });
        },
        unselect() {
            this.resources.forEach((r, i) => {
                this.$refs[`tab-${i}`][0].unselect();
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~@vuejs/component/themes.scss";

.resource-selector-container {
    border-radius: 3px;
    border: 1px solid #dadada;
    box-sizing: border-box;
    min-width: 250px;
    min-height: 180px;
    width: 100%;
    height: 100%;

    font-size: 0;
    position: relative;
    overflow: hidden;

    &.no-border {
        border: none !important;
        border-radius: 0;
    }

    @include themify($themes) {
        border-color: themed('border-color');
    }
}
.tab-contents {
    position: absolute;
    top: 33px;
    left: 0;
    right: 0;
    bottom: 0;

    opacity: 0;
    pointer-events: none;

    &.active {
        opacity: 1;
        pointer-events: inherit;
    }

    &.hide-tab {
        top: 0;
    }
}
</style>
