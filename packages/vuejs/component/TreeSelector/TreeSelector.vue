<template>
    <div class="tree-selector">
        <tree
            :data="origin"
            :width="width"
            :height="height"
            @change-node-fold="onChangeNodeFold"
            @click-node-label="onClickNodeLabel"
        />
    </div>
</template>

<script>
import { getChildKeys } from './utility';
import Tree from './Tree';

export default {
    components: {
        Tree,
    },
    provide() {
        return {
            useCheckBox: this.multiSelect,
        };
    },
    props: {
        tree: {
            type: Array,
            required: false,
            default: () => [],
            validator: data => {
                for (let i = 0, len = data.length; i < len; i++) {
                    const node = data[i];
                    if (
                        !node.hasOwnProperty('key') ||
                        !node.hasOwnProperty('parent')
                    ) {
                        return false;
                    }
                }
                return true;
            },
        },
        multiSelect: {
            type: Boolean,
            required: false,
            default: false,
        },
        width: {
            type: Number,
            required: false,
            default: 0,
        },
        height: {
            type: Number,
            required: false,
            default: 300,
        },
    },
    data() {
        return {
            origin: this.tree,
        };
    },
    watch: {
        tree(origin) {
            this.origin = origin;
        },
    },
    methods: {
        onChangeNodeFold(nodeKey) {
            this.origin = this.origin.map(node => {
                return {
                    ...node,
                    fold: nodeKey === node.key ? !node.fold : node.fold,
                };
            });
        },
        onClickNodeLabel(args) {
            const childKeys = getChildKeys(args[0], this.origin);

            this.origin = this.origin.map(node => {
                if (this.multiSelect) {
                    return {
                        ...node,
                        check:
                            args[0] === node.key || childKeys.includes(node.key)
                                ? args[1]
                                : node.check,
                    };
                } else {
                    return {
                        ...node,
                        check: args[0] === node.key,
                    };
                }
            });

            this.$emit(
                'change',
                this.origin.filter(node => node.check === true)
            );
        },
    },
};
</script>

<style scoped></style>
