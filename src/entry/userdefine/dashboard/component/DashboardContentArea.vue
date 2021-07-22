<template>
    <div class="dashboard-content-area">
        <iframe-component
            v-for="(item, index) in iframeComponents"
            v-bind:key="item.dataKey"
            :iframe-option="item"
        >
        </iframe-component>
        <text-component
            v-for="(item, index) in textComponents"
            v-bind:key="item.dataKey"
            :text-option="item"
        >
        </text-component>
        <chart-component
            v-for="(item, index) in chartComponents"
            :key="item.dataKey"
            :chart-option="item"
            :origin-or-extend-in-chart-position="originOrExtendInChartPosition"
        ></chart-component>

        <export-chart-window />
        <move-talk-window-when-export-chart />
        <slot name="footer" />
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import ChartComponent from '@entry/userdefine/dashboard/component/ChartComponent';
import IframeComponent from '@entry/userdefine/dashboard/component/IframeComponent';
import TextComponent from '@entry/userdefine/dashboard/component/TextComponent';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { MxDef } from '@common/definition';

import ExportChartWindow from '@entry/dashboard/ExportChartWindow';
import MoveTalkWindowWhenExportChart from '@entry/dashboard/MoveTalkWindowWhenExportChart';
import ModalWhenDashboardDelete from '@entry/userdefine/dashboard/menu/ModalWhenDashboardDelete';

export default {
    name: 'DashboardContentArea',
    components: {
        IframeComponent,
        ChartComponent,
        ExportChartWindow,
        MoveTalkWindowWhenExportChart,
        ModalWhenDashboardDelete,
        TextComponent,
    },
    data() {
        return {
            MxDef: MxDef,
        };
    },
    methods: {
        ...mapMutations('dashboard', ['setGcContextMenu']),
    },
    computed: {
        ...mapGetters('dashboard', [
            'chartComponents',
            'iframeComponents',
            'textComponents',
            'gcContextMenuPosition',
        ]),

        ...mapState('dashboard', ['originOrExtendInChartPosition']),
    },
    async mounted() {
        DashboardChartHandler.socketUseCheckInit();
    },
};
</script>
<style lang="scss" scoped>
.dashboard-content-area {
    height: 100%;
    position: relative;
    > div[class$='component'] {
        box-sizing: border-box;
        border-radius: 3px;
    }
}
</style>
