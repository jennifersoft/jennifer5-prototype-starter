<template>
    <div class="chart-ux-top-left">
        <tooltip
            v-if="chartOption.charttype === 'line.external'"
            class="jennifer-front-logo"
            :message="i18n.frontChartTooltip"
            :position="'top-left'"
        >
            <img src="/image/jennifer-front.svg" />
        </tooltip>

        <template v-if="chartOption.charttype === 'xview.realtime'">
            <dropdown
                :is-simple-style="true"
                :items="yAxisTypeItemsInTransactionTab"
                :width="180"
                @onchange="updateYAxisInTransactionTab"
            />

            <toggle-switch
                v-model="autoMax"
                @change="changeAutoMax"
                :label="i18n.autoMax"
                small
            />
        </template>
    </div>
</template>

<script>
import { i18n } from '@common/utility';

import Tooltip from '@vuejs/component/tooltip/Tooltip';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import { mapActions } from 'vuex';

export default {
    components: {
        Tooltip,
        Dropdown,
        ToggleSwitch,
    },
    inject: {
        i18n: {
            default: {
                frontChartTooltip: i18n.get('ui.front.chart.tooltip'),
            },
        },
    },
    props: {
        chartOption: {
            type: Object,
            required: true,
        },
        dataKey: {
            type: String,
            required: true,
        },
    },
    data() {
        const yAxisTypesInTransactionTab = [
            'elapsedTime',
            'sqlTime',
            'fetchTime',
            'txcallTime',
            'cpuTime',
        ];

        return {
            yAxisTypeItemsInTransactionTab: yAxisTypesInTransactionTab.map(
                type => {
                    return { text: this.i18n[type], value: type };
                }
            ),
            autoMax: false,
        };
    },
    methods: {
        ...mapActions('dashboard', ['updateAutoMaxYAxisInXView']),

        updateYAxisInTransactionTab({ value }) {
            const xviewChart = DashboardChartHandler.bigdataCharts()[0];

            if (xviewChart) {
                xviewChart.mouseListener.clear();
                xviewChart.renderer.setViewPoint(value);
            }
        },
        changeAutoMax(useAutoMax) {
            const chartKey = this.dataKey;
            this.updateAutoMaxYAxisInXView({ chartKey, useAutoMax });

            this.$emit('update:autoMaxInXView', useAutoMax);
        },
    },
    computed: {},
    created() {},
    mounted() {},
};
</script>
<style lang="scss" scoped>
.chart-ux-top-left {
    z-index: 20;

    .jennifer-front-logo {
        top: 5px;
        left: 5px;
    }

    @import 'themes.scss';
    @include themify($themes) {
        .icon {
            color: themed('chart-interaction-icon-color');
            &:hover {
                color: themed('chart-interaction-icon-hover-color');
            }
        }

        .aries-switch-wrapper {
            border-left: 1px solid themed('chart-box-border-color');
            padding-left: 8px;
        }
    }

    ::v-deep .aries-ui-dropdown {
        > .row-list {
            max-height: none;
        }
    }
}
</style>
