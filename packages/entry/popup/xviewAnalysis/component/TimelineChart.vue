<template>
    <div class="timeline-chart">
        <div ref="chart"></div>
    </div>
</template>

<script>
import graph from 'juijs-chart';
import TimelineBrush from 'juijs-chart/src/brush/timeline';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';

graph.use(TimelineBrush, ClassicTheme, DarkTheme);

export default {
    inject: {
        theme: {
            type: String,
            default: 'classic',
        },
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
        width: {
            type: String | Number,
            required: false,
            default: '100%',
        },
    },
    computed: {
        chartData() {
            const newData = [...this.data];
            for (let i = 0; i < newData.length - 1; i++) {
                if (newData[i + 1].stime < newData[i].etime) {
                    newData[i + 1].stime = newData[i].etime;
                }
            }
            // etime - stime이 음수일 경우, 애초에 그릴수 없기 때문에 제거한다.
            return newData.filter(data => data.etime - data.stime >= 0);
        },
        maxIndex() {
            let index = -1,
                max = 0;
            for (let i = 0; i < this.chartData.length; i++) {
                let rangeWidth =
                    this.chartData[i].etime - this.chartData[i].stime;

                if (max < rangeWidth) {
                    max = rangeWidth;
                    index = i;
                }
            }
            return index;
        },
    },
    watch: {
        chartData(newVal) {
            this.timeline.axis(0).update(newVal);
            this.timeline.updateBrush(0, {
                active: this.maxIndex,
            });
            this.timeline.render();
            this.$emit('active-profile', {
                data: newVal[this.maxIndex],
                ready: true,
            });
        },
    },
    mounted() {
        this.timeline = graph.create('chart.builder', this.$refs.chart, {
            width: this.width,
            height: 100,
            padding: 0,
            theme: this.theme,
            axis: {
                x: {
                    type: 'range',
                    domain: 'etime',
                    step: 20,
                    hide: true,
                    format: d => {
                        return d.toLocaleForAries();
                    },
                },
                y: {
                    domain: ['', 'Method', 'Sql', 'ExternalCall', 'Batch'],
                    hide: true,
                    format: d => {
                        if (d == 'Sql') return 'SQL';
                        else if (d == 'ExternalCall') return 'External Call';
                        return d;
                    },
                },
                padding: {
                    left: 100,
                },
                keymap: {
                    key: 'type',
                },
            },
            brush: [
                {
                    type: 'timeline',
                    active: 0,
                    barSize: 7,
                    lineWidth: 1,
                    target: ['stime', 'etime'],
                    colors: () => {
                        if (this.theme != 'dark') {
                            return '#49d484';
                        }

                        return '#00a94e';
                    },
                },
            ],
            event: {
                'timeline.active': d => {
                    this.$emit('active-profile', {
                        data: d,
                        ready: false,
                    });
                },
            },
            style: {
                timelineActiveBarBackgroundColor: '#8652ff',
                timelineTitleFontWeight: 500,
            },
            render: false,
        });
    },
};
</script>

<style scoped></style>
