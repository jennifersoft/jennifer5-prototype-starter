<template>
    <detail-window
        class="expand-window"
        :width="width"
        :height="height"
        :left="position.left"
        :top="position.top"
        :min-top="94"
        :loading="fetchingDetails"
        @cancel="onHideDetailWindow"
    >
        <template #subject>
            <span class="subject" :title="name" v-html="name"></span>
        </template>
        <template #contents>
            <div class="head">
                <expand-chart-section></expand-chart-section>
            </div>
            <div class="body">
                <expand-table-panel></expand-table-panel>
            </div>
        </template>
    </detail-window>
</template>

<script>
import DetailWindow from '@entry/popup/xviewAnalysis/component/DetailWindow';
import ExpandChartSection from './ExpandChartSection';
import ExpandTablePanel from './ExpandTablePanel';
import { mapState, mapMutations, mapGetters } from '../vuex';
import { EXPAND_WINDOW_SIZE } from '../constant';

export default {
    inject: ['i18n'],
    components: {
        DetailWindow,
        ExpandChartSection,
        ExpandTablePanel,
    },
    computed: {
        ...mapState({
            name: state => state.expandName,
            position: state => state.expandPosition,
        }),
        ...mapGetters(['fetchingDetails']),
    },
    data() {
        return {
            width: EXPAND_WINDOW_SIZE.width,
            height: EXPAND_WINDOW_SIZE.height,
        };
    },
    methods: {
        ...mapMutations(['showExpandWindow']),
        onHideDetailWindow() {
            this.showExpandWindow({
                name: '',
                hash: -1,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.expand-window {
    span.subject {
        display: inline-block;
        max-width: 950px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}
</style>
