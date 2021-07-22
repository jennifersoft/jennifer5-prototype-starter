<template>
    <layered-menu class="tree-menu" :width="256" :right="20" :top="101">
        <div class="top row-list">
            <div class="title">{{ i18n.goToNext }}</div>
            <search
                :width="224"
                :placeholder="i18n.search"
                v-model="filter"
            ></search>
        </div>
        <div class="bottom row-list">
            <template v-for="(node, index) in filteredNodes">
                <div
                    class="separator"
                    v-if="index > 0 && node.parent === null"
                ></div>
                <div class="row" @click="onClickRow(node)">
                    <span
                        :style="{ 'margin-left': getLeftMargin(node.index) }"
                        >{{ node.label }}</span
                    >
                </div>
            </template>
        </div>
    </layered-menu>
</template>

<script>
import Search from '@vuejs/component/Input/Search';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';

export default {
    inject: ['i18n'],
    components: {
        LayeredMenu,
        Search,
    },
    props: {
        nodes: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            filter: '',
        };
    },
    computed: {
        filteredNodes() {
            if (this.filter === '') return this.nodes;
            return this.nodes.filter(
                node => node.label.indexOf(this.filter) !== -1
            );
        },
    },
    methods: {
        getLeftMargin(index) {
            return `${(index.split('.').length - 1) * 30}px`;
        },
        onClickRow(node) {
            this.$emit('click', node);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';
.tree-menu {
    @include themify($themes) {
        > .top {
            padding: 16px;

            > .title {
                margin-bottom: 8px;
                color: themed('common-message-font-color');
            }
        }

        > .bottom {
            max-height: 360px;
            overflow-y: auto;
            padding: 8px 0;

            > .row {
                cursor: pointer;
                padding: 8px 16px;
                color: themed('common-message-font-color');
                &:hover {
                    background-color: themed(
                        'tree-menu-hover-background-color'
                    );
                }
            }
            > .separator {
                height: 1px;
                margin: 8px 0;
                background-color: themed('common-border-color');
            }
        }
    }
}
</style>
