<template>
    <div ref="chart" class="hourly-line-chart"></div>
</template>

<script>
import graph from 'juijs-chart';
import LineBrush from 'juijs-chart/src/brush/line';
import AreaBrush from 'juijs-chart/src/brush/area';
import FocusBrush from 'juijs-chart/src/brush/focus';
import SelectBoxBrush from 'juijs-chart/src/brush/selectbox';
import TitleWidget from 'juijs-chart/src/widget/title';
import TooltipWidget from 'juijs-chart/src/widget/tooltip';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';
import { getChartTarget } from '@common/utility';

graph.use(
    LineBrush,
    AreaBrush,
    FocusBrush,
    SelectBoxBrush,
    TitleWidget,
    TooltipWidget,
    ClassicTheme,
    DarkTheme
);

export default {
    inject: ['i18n', 'theme'],
    props: {
        date: {
            type: Object,
            required: true,
        },
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
                const domain = [this.date, this.date.clone().add(1, 'day')];

                const pointVal = newVal.map(row => {
                    const hour = row.date.hour();
                    const minute = row.date.minute();

                    return {
                        ...row,
                        value:
                            minute == 0 || (hour == 23 && minute == 59)
                                ? row.value
                                : 0,
                    };
                });

                this.chartObj.axis(0).set('x', { domain: domain });
                this.chartObj.axis(0).update(newVal);
                this.chartObj.axis(1).set('x', { domain: domain });
                this.chartObj.axis(1).update(pointVal);
                this.chartObj.updateBrush(0, {
                    opacity: 0,
                    colors: this.lineColors.area,
                });
                this.chartObj.updateBrush(1, {
                    opacity: 0,
                    colors: this.lineColors.line,
                });
                this.chartObj.updateBrush(2, {
                    colors: this.lineColors.area,
                });
                this.chartObj.updateBrush(3, {
                    colors: this.lineColors.line,
                });
                this.chartObj.updateBrush(4, { start: -1, end: -1 });
                this.chartObj.render(true);
            }
        },
    },
    computed: {
        lineColors() {
            return this.colors[this.theme];
        },
    },
    data() {
        return {
            chartObj: null,
            colors: {
                classic: {
                    area: ['#FED96C'],
                    line: ['#FFC000'],
                },
                dark: {
                    area: ['#7B5C0E'],
                    line: ['#FFC000'],
                },
            },
        };
    },
    mounted() {
        const self = this;
        const time = graph.include('util.time');

        this.chartObj = graph.create('chart.builder', this.$refs.chart, {
            theme: this.theme,
            height: this.height,
            padding: {
                top: 50,
                bottom: 30,
                right: 30,
                left: 75,
            },
            axis: [
                {
                    x: {
                        type: 'date',
                        domain: [],
                        key: 'time',
                        interval: 1000 * 60 * 60,
                        format: (d, i) => {
                            if (d.getHours() == 0 && i != 0) {
                                return '24';
                            }

                            return time.format(d, 'HH');
                        },
                        line: 'dashed',
                    },
                    y: {
                        type: 'range',
                        domain: d => {
                            return getChartTarget(d.value);
                        },
                        step: 5,
                    },
                },
                {
                    x: {
                        hide: true,
                    },
                    y: {
                        hide: true,
                    },
                    extend: 0,
                },
            ],
            brush: [
                {
                    type: 'area',
                    target: 'value',
                    line: false,
                    opacity: 0,
                    clip: false,
                },
                {
                    type: 'line',
                    target: 'value',
                    opacity: 0,
                    clip: false,
                },
                {
                    type: 'area',
                    target: 'value',
                    line: false,
                    opacity: 1,
                    clip: false,
                },
                {
                    type: 'line',
                    target: 'value',
                    opacity: 1,
                    display: 'max',
                    clip: false,
                },
                {
                    type: 'focus',
                    start: -1,
                    end: -1,
                },
                {
                    type: 'selectbox',
                },
            ],
            widget: [
                {
                    type: 'title',
                    text: `(${this.i18n.gatheringInterval} : 5${this.i18n.minute})`,
                    align: 'end',
                    dx: 0,
                    dy: 15,
                },
            ],
            format: d => {
                if (typeof d == 'number') {
                    return d.toUnitString();
                }

                return d;
            },
            event: {
                click: function(obj) {
                    if (obj.brush.type == 'selectbox') {
                        this.updateBrush(0, { opacity: 0.4 });
                        this.updateBrush(1, { opacity: 0.4 });
                        this.updateBrush(2, {
                            colors: data => {
                                return getBrushColor(
                                    data,
                                    self.lineColors.area
                                );
                            },
                        });
                        this.updateBrush(3, {
                            colors: function(data) {
                                return getBrushColor(
                                    data,
                                    self.lineColors.line
                                );
                            },
                        });
                        this.updateBrush(4, {
                            start: obj.data.start,
                            end: obj.data.end,
                        });
                        this.render();

                        self.$emit('click', obj.data.start.getHours());
                    }

                    function getBrushColor(data, color) {
                        if (
                            data.date.valueOf() >= obj.data.start.getTime() &&
                            data.date.valueOf() < obj.data.end.getTime()
                        ) {
                            return color;
                        }

                        return 'transparent';
                    }
                },
            },
            style: {
                backgroundColor: 'transparent',
                titleFontSize: 11,
                titleFontColor: '#666',
                lineBorderOpacity: 1,
                areaBackgroundOpacity: 1,
                focusBorderColor: '#9663f4',
                focusBorderWidth: 2,
                focusBackgroundOpacity: 0,
                gridTickBorderSize: 0,
                tooltipPointRadius: 0,
            },
            render: false,
        });
    },
};
</script>

<style lang="scss" scoped></style>
