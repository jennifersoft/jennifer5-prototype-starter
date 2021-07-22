<template>
    <div ref="chart" class="daily-column-chart"></div>
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
        rowIndex: {
            type: Number,
            required: false,
            default: -1,
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
                this.chartObj
                    .axis(0)
                    .set('y', { domain: [0, getChartTarget(this.maxValue)] });
                this.chartObj.updateBrush(0, { active: this.rowIndex });
                this.chartObj.axis(0).update(newVal);
                this.chartObj.render();
            }
        },
        rowIndex(newVal, oldVal) {
            if (this.chartObj !== null && newVal !== oldVal) {
                this.chartObj.updateBrush(0, { active: newVal });
                this.chartObj.render();
            }
        },
    },
    computed: {
        maxValue() {
            const max =
                this.rows.length > 0
                    ? Math.max.apply(
                          null,
                          this.rows.map(row => row.value)
                      )
                    : 0;

            return max || 100;
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
                    domain: [0, this.maxValue],
                    step: 4,
                    line: 'solid',
                },
                data: this.rows,
            },
            brush: {
                type: 'column2',
                target: 'value',
                display: 'max',
                activeEvent: 'click',
                active: this.rowIndex,
                minSize: 3,
                clip: false,
                colors: ['#8652ff'],
            },
            widget: {
                type: 'tooltip',
                format: (data, key) => {
                    return {
                        key: data['date'].format('MM-DD'),
                        value: data[key].toLocaleForAries(),
                    };
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
                    this.$emit('click', d.dataIndex);
                },
            },
            style: {
                backgroundColor: 'transparent',
                columnActiveBackgroundColor: '#FFC000',
                gridTickPadding: 7,
            },
            render: false,
        });
    },
};
</script>

<style lang="scss" scoped></style>
