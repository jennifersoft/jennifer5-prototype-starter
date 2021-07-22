<template>
    <div></div>
</template>

<script>
import graph from 'juijs-graph';
import FullgaugeBrush from 'juijs-chart/src/brush/fullgauge';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';

graph.use(FullgaugeBrush, ClassicTheme, DarkTheme);

const STYLES = {
    classic: {
        backgroundColor: 'rgba(0,0,0,0.08)',
        gaugeColor: '#8652ff',
        fontColor: '#212121',
    },
    dark: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        gaugeColor: '#8652ff',
        fontColor: '#e8e8e8',
    },
};
export default {
    inject: {
        theme: {
            type: String,
            default: 'classic',
        },
    },
    props: {
        percent: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    watch: {
        percent(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.loading.axis(0).update([
                {
                    title: `${parseInt(newVal)}%`,
                    value: parseInt(newVal),
                    max: 100,
                    min: 0,
                },
            ]);
        },
    },
    mounted() {
        const style = STYLES[this.theme];

        this.loading = graph.create('chart.builder', this.$el, {
            width: 200,
            height: 200,
            padding: 0,
            axis: [
                {
                    c: {
                        type: 'panel',
                    },
                    data: [
                        {
                            title: `${this.percent}%`,
                            value: this.percent,
                            max: 100,
                            min: 0,
                        },
                    ],
                },
            ],
            brush: [
                {
                    type: 'fullgauge',
                    symbol: 'round',
                    startAngle: 0,
                    size: 10,
                    titleY: 10,
                    showText: false,
                    colors: [style.gaugeColor],
                },
            ],
            style: {
                backgroundColor: 'transparent',
                gaugeTitleFontSize: 32,
                gaugeTitleFontWeight: 500,
                gaugeTitleFontColor: style.fontColor,
                gaugeBackgroundColor: style.backgroundColor,
            },
        });
    },
};
</script>

<style scoped></style>
