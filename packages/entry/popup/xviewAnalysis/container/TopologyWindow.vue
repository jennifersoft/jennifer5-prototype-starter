<template>
    <window
        ref="topology"
        resizable
        draggable
        class="topology-window"
        :open-w="720"
        :open-h="420"
        :open-x="windowLeft"
        :open-y="windowTop"
        :messages="{
            apply: i18n.apply,
            cancel: i18n.cancel,
        }"
        @cancel="() => $emit('active-topology', false)"
        @resize-end="resizeTopologyChart"
    >
        <template #subject>
            <span>{{ i18n.topology }}</span>
        </template>

        <topology-chart
            :data="transactionRows"
            :minimap="false"
            :size="topologySize"
            @click-edge="selectedTransactionRows"
        ></topology-chart>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import TopologyChart from '../component/TopologyChart';
import {
    mapState as baseMapState,
    mapMutations as baseMapMutations,
    mapActions as baseMapActions,
} from '../store/base';

export default {
    inject: {
        i18n: {
            default: {
                topology: 'Topology',
                apply: 'Apply',
                cancel: 'Cancel',
            },
        },
    },
    components: {
        Window,
        TopologyChart,
    },
    computed: {
        ...baseMapState({
            windowLeft: state => state.mainWidth - 698,
            windowTop: state => state.mainHeight - state.distHeight - 76,
            transactionRows: state => state.transactionRows,
        }),
    },
    data() {
        return {
            topologySize: {
                width: 680,
                height: 340,
            },
        };
    },
    methods: {
        ...baseMapMutations(['updateTransactionRows']),
        ...baseMapActions(['selectTransactionRow']),
        resizeTopologyChart() {
            const style = this.$refs.topology.$el.style;

            this.topologySize = {
                width: parseInt(style['width']) - 40,
                height: parseInt(style['height']) - 80,
            };
        },
        selectedTransactionRows(rowIndexes) {
            const firstIndex = rowIndexes[0];

            this.updateTransactionRows(
                this.transactionRows.map((row, index) => {
                    return {
                        ...row,
                        relatedTopology: rowIndexes.includes(index),
                    };
                })
            );

            this.selectTransactionRow({
                index: firstIndex,
                data: this.transactionRows[firstIndex],
            });

            this.$emit('load-profile-data');
        },
    },
};
</script>

<style lang="scss" scoped>
.topology-window {
    ::v-deep .body {
        overflow: hidden !important;
    }

    ::v-deep .foot {
        display: none !important;
    }
}
</style>
