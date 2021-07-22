<template>
    <div class="group-chart-wrapper">
        <div class="title">
            <div class="left">{{ i18n.application }}</div>
            <div class="right">
                <dropdown
                    :is-simple-style="true"
                    :width="160"
                    :items="sortByColumns"
                    :selected-value="chartSort"
                    @onchange="onChangeSortType"
                ></dropdown>
            </div>
        </div>
        <group-chart
            :data="chartData"
            :active-index="chartIndex"
            :active-sequence="chartSequence"
            @onchange="onChangeGroupData"
        ></group-chart>
    </div>
</template>

<script>
import GroupChart from '@entry/popup/xviewAnalysis/component/GroupChart';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { mapGetters, mapActions } from 'vuex';
import { sortTypesInApplicationBar } from '@entry/analysis/xview/common';
import { Observer } from '@common/legacy/Observer';
import {
    ChartKeywordInObserver,
    XViewChartKeywordInObserver,
} from '@common/ObserverKeyword';
import _ from '@library/lodash';

export default {
    name: 'group-chart-wrapper',
    inject: ['i18n'],
    components: {
        GroupChart,
        Dropdown,
    },
    data() {
        return {
            chartIndex: -1,
            chartSort: 'count',
            chartSequence: 0,
            sortByColumns: sortTypesInApplicationBar.map(({ key, i18nKey }) => {
                return {
                    text: this.i18n[i18nKey],
                    value: key,
                };
            }),
            chartData: [],
        };
    },
    methods: {
        ...mapActions('xviewAnalysis', [
            'toggleFilterServiceNameOnBar',
            'clearFilterServiceNameOnBar',
        ]),
        onChangeSortType({ value }) {
            this.chartSort = value;
            this.chartData = this.makeChartData();
        },
        onChangeGroupData(item) {
            this.chartIndex = this.chartIndex === item.index ? -1 : item.index;
            const serviceName = item.serviceName;
            this.toggleFilterServiceNameOnBar(serviceName);
        },
        makeChartData() {
            const sortField = this.chartSort;
            const totalValue = this.transactionsGroupByApplicationWithoutFilterServiceNamesOnBar.reduce(
                (acc, item) => {
                    acc += item[sortField];
                    return acc;
                },
                0
            );
            const dataArray = this.transactionsGroupByApplicationWithoutFilterServiceNamesOnBar.map(
                (transactionsGroup, i) => {
                    return {
                        ...transactionsGroup,
                        index: i,
                        name: transactionsGroup.serviceName,
                        value: transactionsGroup[sortField].toLocaleForAries(),
                        rate: transactionsGroup[sortField] / totalValue,
                    };
                }
            );

            dataArray.sort((a, b) => b[sortField] - a[sortField]);

            return dataArray;
        },
        makeChartDataInterval: _.debounce(function() {
            this.chartData = this.makeChartData();
        }, 4000),
    },
    computed: {
        ...mapGetters('xviewAnalysis', [
            'transactionsGroupByApplicationWithoutFilterServiceNamesOnBar',
        ]),
    },
    mounted() {
        this.chartData = this.makeChartData();
        Observer.on(XViewChartKeywordInObserver.END_XVIEW_ANALYSIS, () => {
            this.makeChartDataInterval();
        });

        Observer.on(
            ChartKeywordInObserver.RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE,
            () => {
                this.makeChartDataInterval();
            }
        );
    },
    destroyed() {
        this.clearFilterServiceNameOnBar();
    },
};
</script>

<style lang="scss">
@import '~@entry/popup/xviewAnalysis/themes.scss';

.group-chart-wrapper {
    display: flex;
    flex-direction: column;

    @include themify($themes) {
        > .title {
            display: flex;
            flex-direction: row;
            padding: 14px;
            align-items: center;
            border-bottom: 1px solid themed('layout-border-color');

            > .left,
            > .right {
                flex: 1;
            }

            > .left {
                color: themed('group-view-title-font-color');
                font-size: 14px;
                font-weight: 500;
            }
            .aries-ui-dropdown {
                > .row-list {
                    max-height: none;
                }
            }
        }
        > .group-chart {
            max-height: calc(100vh - 360px);
            flex-grow: 1;
            min-height: 0;
            .subject {
                > .left,
                .right {
                    color: themed('group-view-title-font-color');
                }
            }
        }
    }
}
</style>
