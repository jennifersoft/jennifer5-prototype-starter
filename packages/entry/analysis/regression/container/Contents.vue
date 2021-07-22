<template>
    <div>
        <heatmap-chart
            ref="heatmap"
            :theme="theme"
            :names="heatmapNames"
            :values="heatmapValues"
            :width="heatmapWidth"
            :height="heatmapHeight"
            :styles="styles"
            :padding-left="240"
            :padding-right="80"
            :padding-top="160"
            :padding-bottom="40"
            @click="detailViewHandler"
        ></heatmap-chart>
    </div>
</template>

<script>
import jui from 'juijs';
import HeatmapChart from '../component/HeatmapChart';
import Themes from '../themes/graph';
import { showRegressionPopup } from '../utility';
import { mapState } from '../vuex';

export default {
    components: {
        HeatmapChart,
    },
    inject: {
        theme: {
            default: 'classic',
        },
    },
    props: {
        heatmapNames: {
            type: Array,
            required: true,
        },
        heatmapValues: {
            type: Array,
            required: true,
        },
    },
    computed: {
        ...mapState({
            intervalType: state => parseInt(state.intervalType),
        }),
    },
    methods: {
        detailViewHandler(obj) {
            const d = obj.data;

            if (d.result != null) {
                showRegressionPopup(
                    d.xIndex,
                    d.yIndex,
                    d.xLabel,
                    d.yLabel,
                    d.result.xMin,
                    d.result.yMin,
                    d.result.xMax,
                    d.result.yMax,
                    d.result.regression,
                    d.result.data,
                    this.intervalType
                );
            }
        },
        getContentWidth() {
            return document.getElementById('vue_app').offsetWidth - 40;
        },
    },
    data() {
        const w = this.getContentWidth();

        return {
            heatmapWidth: w,
            heatmapHeight: w - 160,

            styles: Object.assign(
                {
                    heatmapBackgroundColor: 'transparent',
                    heatmapBackgroundOpacity: 1,
                    heatmapHoverBackgroundColor: '#ff8e5f',
                    heatmapBorderWidth: 0.5,
                    heatmapBorderOpacity: 0.1,
                    heatmapFontSize: 11,
                    gridTickBorderSize: 0,
                    gridXAxisBorderWidth: 1,
                    gridYAxisBorderWidth: 1,
                },
                Themes[this.theme]
            ),
        };
    },
    mounted() {
        const _ = jui.include('util.base');

        _.resize(() => {
            const w = this.getContentWidth();

            this.heatmapWidth = w;
            this.heatmapHeight = w - 160;
        }, 500);
    },
};
</script>

<style lang="scss" scoped></style>
