<template>
    <div ref="chart"></div>
</template>

<script>
import graph from 'juijs-chart';
import ColumnBrush from 'juijs-chart/src/brush/column';
import TitleWidget from 'juijs-chart/src/widget/title';
import TooltipWidget from 'juijs-chart/src/widget/tooltip';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';
import { getChartTarget } from '@common/utility';

graph.use(ColumnBrush, TitleWidget, TooltipWidget, ClassicTheme, DarkTheme);

export default {
    inject: ['theme', 'i18n'],
    props: {
        chartData: {
            type: Object,
            required: false,
            default: () => {
                return {
                    index: 0,
                    data: [],
                };
            },
        },
    },
    watch: {
        chartData(newVal) {
            this.chartObj.updateBrush(0, { active: newVal.index });
            this.chartObj.axis(0).update(newVal.data);
            this.chartObj.render();
        },
    },
    data() {
        return {
            chartObj: null,
            chartThemes: {
                classic: {
                    axisBorderColor: '#e8e8e8',
                    gridBorderColor: '#f6f6f6',
                },
                dark: {
                    axisBorderColor: '#4e4e4e',
                    gridBorderColor: '#292929',
                },
            },
        };
    },
    mounted() {
        const style = this.chartThemes[this.theme];

        this.chartObj = graph.create('chart.builder', this.$refs['chart'], {
            theme: this.theme,
            height: 300,
            padding: {
                top: 55,
                bottom: 40,
                right: 30,
                left: 55,
            },
            axis: {
                x: {
                    domain: 'date',
                    format: function(d, i) {
                        const dd = d.format('MM-DD');

                        if (this.area('width') < 600) {
                            if (i % 2 == 0) return dd;
                        } else {
                            return dd;
                        }
                    },
                    line: false,
                    textRotate: -30,
                },
                y: {
                    type: 'range',
                    domain: d => {
                        if (d.value == 0) {
                            return 4;
                        }

                        return getChartTarget(d.value);
                    },
                    step: 4,
                    line: 'solid',
                },
            },
            brush: {
                type: 'column',
                target: 'value',
                display: 'max',
                activeEvent: 'click',
                colors: ['#8652ff'],
                minSize: 0,
                clip: false,
            },
            widget: [
                {
                    type: 'tooltip',
                    format: (data, key) => {
                        return {
                            key: data['date'].format('MM-DD'),
                            value: data[key].toLocaleForAries(),
                        };
                    },
                },
                {
                    type: 'title',
                    text: this.i18n.dailyDeployCount,
                    align: 'start',
                    dx: -40,
                    dy: 10,
                },
            ],
            format: d => {
                return d.toLocaleForAries();
            },
            style: {
                gridXAxisBorderColor: style.axisBorderColor,
                gridYAxisBorderColor: style.axisBorderColor,
                gridBorderColor: style.gridBorderColor,
                gridXFontColor: '#999',
                gridYFontColor: '#999',
                gridTickPadding: 7,
                gridTickBorderSize: 0,
                titleFontSize: 14,
                titleFontWeight: 500,
            },
            event: {
                click: d => {
                    this.$emit('change', d.dataIndex);
                },
            },
            render: false,
        });
    },
};
</script>

<style lang="scss" scoped>
.deploy-chart {
}
</style>
