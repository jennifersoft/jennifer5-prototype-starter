<template>
    <div class="user-agent-chart" ref="donut">
        <tooltip-balloon
            v-show="showTooltip"
            :style="{ ...tooltipPosition, position: 'fixed' }"
            cursor-none
        >
            {{ helpMessage }}
        </tooltip-balloon>
    </div>
</template>

<script>
import graph from 'juijs-chart';
import DonutBrush from 'juijs-chart/src/brush/donut';
import TitleWidget from 'juijs-chart/src/widget/title';
import TooltipWidget from 'juijs-chart/src/widget/tooltip';
import LegendWidget from 'juijs-chart/src/widget/legend';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';
import TooltipBalloon from '@vuejs/component/tooltip/TooltipBalloon';

import { mapState, mapMutations } from '../store';

graph.use(
    DonutBrush,
    TitleWidget,
    TooltipWidget,
    LegendWidget,
    ClassicTheme,
    DarkTheme
);

export default {
    name: 'UserAgentDonut',
    components: {
        TooltipBalloon,
    },
    inject: {
        theme: {
            default: 'classic',
        },
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
        },
        title: {
            type: String,
            default: 'Call Count',
        },
        helpMessages: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showTooltip: false,
            helpMessage: '',
            tooltipPosition: { top: 0, left: 0 },
        };
    },
    watch: {
        data: {
            handler(next) {
                this.donut.axis(0).update(next);
                this.donut.render(true);
            },
            deep: true,
        },
        height(next, prev) {
            if (next === prev) return;
            this.resizeChartHeight(next);
        },
    },
    computed: {
        ...mapState({
            tableData: state => state.tableData,
            currentTab: state => state.currentTab,
            donutFilter: state => state.donutFilter,
        }),
    },
    methods: {
        ...mapMutations(['updateDonutFilter']),
        resetChartFilter(e) {
            if (e && e.target.tagName.toLowerCase() === 'path') return;

            this.updateDonutFilter([]);
            this.donut.render(true);
        },
        resizeChartHeight(ch) {
            this.$refs['donut'].style.height = ch + 40 + 'px';

            if (ch < 650) {
                // 작은 화면
                this.donut.setOption('padding', {
                    left: 0,
                    top: 50,
                    right: 80,
                    bottom: 50,
                });
                this.donut.updateBrush(0, { size: 50 });
                this.donut.setTheme({
                    pieTotalValueFontSize: 25,
                    pieOuterLineRate: 1.3,
                });
            } else {
                // 큰 화면
                this.donut.setOption('padding', {
                    left: 0,
                    top: 100,
                    right: 160,
                    bottom: 100,
                });
                this.donut.updateBrush(0, { size: 100 });
                this.donut.setTheme({
                    pieTotalValueFontSize: 60,
                    pieOuterLineRate: 1.5,
                });
            }

            this.donut.render(true);
        },
        onMouseover({ target }) {
            const { left, top, width } = target.getBoundingClientRect();
            this.tooltipPosition = {
                left: left + width + 10 + 'px',
                top: top + 'px',
            };
            this.helpMessage = target.title;
            this.showTooltip = true;
        },
        onMouseleave() {
            this.helpMessage = '';
            this.showTooltip = false;
        },
        getHelpIcon(parent) {
            const { top, left, width } = parent.getBoundingClientRect();
            const { textContent } = parent;
            const helpIcon = document.createElement('i');
            helpIcon.setAttribute('class', 'icon-help icon-legend');
            helpIcon.setAttribute('title', this.helpMessages[textContent]);
            helpIcon.setAttribute(
                'style',
                `
                        cursor: help;
                        z-index: 1000;
                        position: absolute;
                        top: ${top - 255}px;
                        left: ${left + width - 15}px;
                    `
            );
            helpIcon.addEventListener('mouseover', this.onMouseover);
            helpIcon.addEventListener('mouseleave', this.onMouseleave);
            return helpIcon;
        },
        createTooltip() {
            document
                .querySelectorAll('.icon-help.icon-legend')
                .forEach(i => i.remove());

            document.querySelectorAll('.widget-legend text').forEach(legend => {
                const { textContent } = legend;

                if (!!this.helpMessages[textContent]) {
                    this.$refs.donut.appendChild(this.getHelpIcon(legend));
                }
            });
        },
    },
    mounted() {
        const self = this;
        this.donut = graph.create('chart.builder', this.$refs.donut, {
            theme: self.theme,
            padding: {
                left: 0,
                top: 100,
                right: 160,
                bottom: 100,
            },
            axis: [
                {
                    area: {
                        data: [],
                    },
                },
            ],
            brush: [
                {
                    type: 'donut',
                    showText: 'outside',
                    showValue: true,
                    activeEvent: 'click',
                    size: 100,
                    format: function(k, v) {
                        // Total value 포맷
                        if (typeof v == 'undefined') {
                            if (k > 1000 * 1000) {
                                return (k / (1000 * 1000)).toFixed(1) + 'M';
                            } else if (k > 1000) {
                                return (k / 1000).toFixed(1) + 'K';
                            }

                            return k.toLocaleForAries();
                        }

                        return k + ' (' + v.toLocaleForAries() + ')';
                    },
                },
            ],
            widget: [
                {
                    type: 'title',
                    text: self.title,
                    align: 'start',
                    dy: -100,
                    axis: 0,
                },
                {
                    type: 'tooltip',
                    orient: 'left',
                    format: function(data, k) {
                        return {
                            key: k,
                            value: data[k].toLocaleForAries(),
                        };
                    },
                    brush: [0],
                },
                {
                    type: 'legend',
                    format: function(k) {
                        return k;
                    },
                    orient: 'center',
                    align: 'end',
                    dx: -10,
                },
            ],
            style: {
                titleFontWeight: 'bold',
                pieOuterLineRate: 1.5,
            },
            event: {
                click: (obj, _) => {
                    const { donutFilter } = this;
                    const filterIndex = donutFilter.findIndex(
                        e => e === obj.dataKey
                    );

                    if (filterIndex === -1) {
                        self.updateDonutFilter(
                            donutFilter.concat([obj.dataKey])
                        );
                    } else {
                        self.updateDonutFilter(
                            donutFilter.filter((_, i) => i !== filterIndex)
                        );
                    }
                },
                'chart.click': self.resetChartFilter,
                'bg.click': self.resetChartFilter,
                render: () => setTimeout(self.createTooltip, 100),
            },
            render: false,
        });
        this.resizeChartHeight(window.innerHeight - 375);
    },
};
</script>

<style lang="scss" scoped>
.user-agent-chart {
    padding: 16px 0;
    position: relative;
    height: 100%;
}
</style>
