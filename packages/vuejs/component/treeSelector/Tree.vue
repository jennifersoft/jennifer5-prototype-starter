<template>
    <recycle-scroller
        :class="['tree-scroller']"
        :style="treeStyle"
        :items="outputData"
        :buffer="height"
        :item-size="24"
        :key-field="'key'"
    >
        <template v-slot="{ item, index, active }">
            <node
                :node-key="item.key"
                :label="item.label"
                :depth="item.depth"
                :leaf="item.leaf"
                :fold="item.fold"
                :check="item.check"
                :disable="item.disable"
                :icon="item.icon"
                @change-node-fold="key => $emit('change-node-fold', key)"
                @click-node-label="key => $emit('click-node-label', key)"
            ></node>
        </template>
    </recycle-scroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller';
import Node from './Node';
import { convertRenderingData } from './utility';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
    components: {
        RecycleScroller,
        Node,
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        data: {
            type: Array,
            required: true,
        },
    },
    computed: {
        treeStyle() {
            return {
                width: this.width === 0 ? '100%' : `${this.width}px`,
                height: `${this.height}px`,
            };
        },
        outputData() {
            return convertRenderingData(this.data);
        },
    },
};
</script>

<style lang="scss" scoped></style>
