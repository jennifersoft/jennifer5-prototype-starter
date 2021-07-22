<template>
    <div ref="chart" class="hourly-column-chart"></div>
</template>

<script>
import graph from 'juijs-chart';
import ColumnBrush from './graph/ColumnBrush';
import TitleWidget from 'juijs-chart/src/widget/title';
import TooltipWidget from 'juijs-chart/src/widget/tooltip';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';
import { getChartTarget } from '@common/utility';

graph.use(ColumnBrush, TitleWidget, TooltipWidget, ClassicTheme, DarkTheme);

export default {
    inject: ['i18n', 'theme'],
    props: {
        rows: {
            type: Array,
            required: false,
            default: () => [],
        },
        height: {
            type: Number,
            required: false,
            default: 200,
        },
    },
    watch: {
        rows(newVal) {
            if (this.chartObj !== null) {
                this.chartObj.axis(0).update(newVal);
            }
        },
    },
    data() {
        return {
            chartObj: null,
        };
    },
    mounted() {
        this.chartObj = graph.create('chart.builder', this.$refs.chart, {
            theme: this.theme,
            height: this.height,
            padding: {
                top: 30,
                bottom: 30,
                right: 30,
                left: 70,
            },
            axis: {
                x: {
                    type: 'fullblock',
                    domain: () => {
                        let res = [];
                        for (let i = 0; i < 25; i++) {
                            res.push(i < 10 ? '0' + i : '' + i);
                        }

                        return res;
                    },
                    line: 'rect',
                },
                y: {
                    type: 'range',
                    domain: d => {
                        return getChartTarget(d.value);
                    },
                    step: 5,
                    line: false,
                },
            },
            brush: {
                type: 'column2',
                target: 'value',
                display: 'max',
                activeEvent: 'click',
                colors: ['#FFC000'],
                minSize: 3,
                clip: false,
            },
            widget: {
                type: 'tooltip',
                format: (data, key) => {
                    return data[key].toLocaleForAries();
                },
            },
            format: d => {
                if (typeof d == 'number') {
                    return d.toUnitString();
                }

                return d;
            },
            event: {
                click: d => {
                    this.$emit('click', d.data.date);
                },
            },
            style: {
                backgroundColor: 'transparent',
                columnActiveBackgroundColor: '#06d9b6',
            },
        });
    },
};
</script>

<style lang="scss" scoped></style>
