<template>
    <div class="app">
        <common-header
            :subject="subject"
            :description="description"
            :active-bookmark="activeBookmark"
        >
            <template #tools>
                <div class="btn-group">
                    <btn
                        :items="[{ iconType: printIcon }]"
                        :tooltip-options="{
                            message: i18n.print,
                            position: 'bottom-center',
                        }"
                        class="transparent"
                        normal
                        @click="onClickPrint"
                    />
                    <span class="divider"></span>
                </div>
            </template>
        </common-header>
        <div class="content" :class="{ 'chart-only-layout': chartOnlyLayout }">
            <div class="search-condition-wrapper" ref="searchConditionWrapper">
                <div class="search-condition-box">
                    <div>
                        <div class="configure-day-n-date-picker">
                            <configure-period></configure-period>
                            <div class="calendar-wrapper">
                                <date-picker
                                    class="calendar"
                                    @update:date="dayjsSelectHandler"
                                    :select-count="periodDays"
                                    :date="selectedDayjs"
                                    :messages="messages"
                                    :prevent-future="false"
                                    type="inline"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="resource-selector-wrapper">
                        <ResourceSelector
                            @row-selected="resourceSelectHandler"
                            @row-unselected="resourceUnselectHandler"
                            :selectable="true"
                            :noAllCheck="true"
                            @tab-change="configureTab"
                            :tab="currentTab"
                            :no-border="false"
                            ref="resourceSelector"
                            :resources="resources"
                        />
                    </div>
                    <div class="metrics-selector-wrapper">
                        <MetricSelector
                            ref="metricSelector"
                            :metrics="metrics"
                            @metricSelect="metricSelectHandler"
                        />
                    </div>
                </div>
                <search-condition-queue
                    :class="{ newLine: twoRowInSearchConditionWrapper }"
                    class="searched-condition-list"
                    :list="searchConditionQueue"
                    @delete-row="removeCondition"
                >
                </search-condition-queue>
            </div>

            <line-perf-chart />
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import DatePicker from '@vuejs/component/DatePicker/DatePicker';
import CommonHeader from '@layout/container/header/CommonHeader';
import messages from '@vuejs/component/messages';
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import MetricSelector from '@vuejs/component/Resource/MetricSelector/MetricSelector';
import SearchConditionQueue from '@entry/analysis/performanceBrowser/component/SearchConditionQueue';
import ConfigurePeriod from '@entry/analysis/performanceBrowser/component/ConfigurePeriod';
import LinePerfChart from '@entry/analysis/performanceBrowser/component/LinePerfChart';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { Business, Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { i18n } from '@common/utility';

export default {
    inject: ['i18n'],
    components: {
        CommonHeader,
        ConfigurePeriod,
        DatePicker,
        ResourceSelector,
        MetricSelector,
        SearchConditionQueue,
        LinePerfChart,
        Btn,
    },
    props: {
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        activeBookmark: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            messages,
            metrics: [],
            twoRowInSearchConditionWrapper: false,
            resources: [
                { resourceType: 'domain', tree: [] },
                { resourceType: 'instance', tree: [] },
                { resourceType: 'business', tree: [] },
            ],
            printIcon: ICON_TYPE.print,
        };
    },
    methods: {
        ...mapMutations('performancebrowser', [
            'configureSelectedDayjs',
            'configureTab',
            'configureTarget',
            'configureMetric',
            'removeCondition',
        ]),
        ...mapActions('performancebrowser', [
            'addConditionIfSelectedMetricWhenSelectTarget',
            'addConditionIfSelectedTargetWhenSelectMetric',
            'changeDayjs',
            'fetchData',
            'loadMetrics',
        ]),
        onClickPrint() {
            window.print();
        },

        fetchResource() {
            const sidToFetch = this.sidList;
            const [startTime, endTime] = this.searchTimes;

            return Promise.all([
                Instance.get(sidToFetch, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'instance').map(
                        n => ({
                            ...n,
                            check: 'no-check',
                            selected: false,
                        })
                    );
                    const domainNotClickable = n.map(l => {
                        if (l.resourceType === 'domain') {
                            return {
                                ...l,
                                noInteraction: true,
                            };
                        }
                        return l;
                    });
                    this.$set(this.resources, 1, {
                        resourceType: 'instance',
                        tree: Array.from(domainNotClickable),
                    });

                    const domains = n
                        .filter(d => {
                            return d.resourceType === 'domain';
                        })
                        .map(n => ({
                            ...n,
                            fold: 'no-fold',
                            noFoldPadding: true,
                        }));
                    this.$set(this.resources, 0, {
                        resourceType: 'domain',
                        tree: domains,
                    });
                }),
                Business.get(sidToFetch, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'business')
                        .map(n => ({
                            ...n,
                            check: 'no-check',
                            selected: false,
                        }))
                        .map(l => {
                            if (l.resourceType === 'domain') {
                                return {
                                    ...l,
                                    noInteraction: true,
                                };
                            }
                            return l;
                        });
                    this.$set(this.resources, 2, {
                        resourceType: 'business',
                        tree: Array.from(n),
                    });
                }),
            ]);
        },
        async fetchMetrics() {
            const axiosResponse = await this.loadMetrics(this.currentTab);

            this.metrics = axiosResponse.data.map(d => {
                return {
                    label: i18n.get(`ui.mx.${d[0]}`),
                    description: i18n.get(`ui.mx.${d[0]}.tooltip`),
                    value: d[1],
                };
            });
        },
        dayjsSelectHandler(dayjs) {
            this.changeDayjs(dayjs);

            this.unselectResourceAndMetric();
        },
        unselectResourceAndMetric() {
            this.configureTarget(undefined);
            this.configureMetric(undefined);
            this.$refs.resourceSelector?.unselect();
            this.$refs.metricSelector?.unselectMetric();
        },

        resourceSelectHandler(rowData) {
            const domainName = this.domainList.find(
                domain => domain.data?.sid === rowData.sid
            )?.label;

            this.addConditionIfSelectedMetricWhenSelectTarget(
                Object.assign(rowData, { domainName: domainName })
            );
        },
        metricSelectHandler(m) {
            if (m === this.metric) {
                this.configureMetric(undefined);
                this.$refs.metricSelector?.unselectMetric();
            } else this.addConditionIfSelectedTargetWhenSelectMetric(m);
        },
        resourceUnselectHandler() {
            this.configureTarget(undefined);
        },
    },
    computed: {
        ...mapGetters('domain', ['sidList']),
        ...mapState('domain', ['domainList']),
        ...mapGetters('performancebrowser', ['searchTimes']),
        ...mapState('performancebrowser', {
            selectedDayjs: ({ selected }) => selected.dayjs,
            periodDays: ({ selected }) => selected.periodDays,
            currentTab: ({ selected }) => selected.tab,
            metric: ({ selected }) => selected.metric,
        }),
        ...mapState('performancebrowser', [
            'searchConditionQueue',
            'chartOnlyLayout',
            'chart',
        ]),
    },

    mounted() {
        this.fetchMetrics();

        this.twoRowInSearchConditionWrapper =
            this.$refs.searchConditionWrapper.getBoundingClientRect().height >
            304;
        const resizeObserver = new ResizeObserver(elArray => {
            this.twoRowInSearchConditionWrapper =
                elArray[0].contentRect.height > 304;
        });

        resizeObserver.observe(this.$refs.searchConditionWrapper);
    },
    watch: {
        sidList() {
            this.unselectResourceAndMetric();
            this.fetchResource();
        },
        selectedDayjs() {
            this.unselectResourceAndMetric();
            this.fetchResource();
        },
        periodDays() {
            this.unselectResourceAndMetric();
            this.fetchResource();
        },
        currentTab() {
            this.unselectResourceAndMetric();
            this.fetchMetrics();
        },
    },
};
</script>

<style lang="scss">
@import '~@vuejs/component/themes.scss';
.app {
    height: 100%;
    display: flex;
    flex-direction: column;

    > .content {
        flex-grow: 1;
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        padding: 0 24px 24px;

        @include themify($themes) {
            .search-condition-wrapper {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                border: solid 1px themed('topbar-border-color');
                border-radius: 4px;
                margin-bottom: 16px;

                .search-condition-box {
                    padding: 17px;
                    display: flex;
                    flex-direction: row;
                    flex: 0 0 875px;

                    > div {
                        display: inline-flex;

                        box-sizing: border-box;
                        height: 270px;
                        vertical-align: top;

                        > .configure-day-n-date-picker {
                            display: flex;
                            flex-direction: column;
                            border-radius: 4px;
                            border: solid 1px themed('topbar-border-color');

                            .configure-period {
                                display: flex;
                                margin: 16px 16px 0 16px;
                                .period-label {
                                    flex-grow: 1;
                                }
                            }

                            .calendar-wrapper {
                                flex-grow: 1;

                                .calendar {
                                    border: none;
                                }
                            }
                        }

                        &.resource-selector-wrapper,
                        &.metrics-selector-wrapper {
                            flex: 0 0 300px;
                            margin-left: 8px;
                        }
                    }
                }

                .searched-condition-list {
                    flex: 2 0 308px;
                    padding: 16px;
                    max-height: 270px;
                    border-left: solid 1px themed('topbar-border-color');
                    display: flex;
                    flex-direction: column;

                    &.newLine {
                        border-top: solid 1px themed('topbar-border-color');
                        border-left: none;
                        height: 150px;
                    }
                }
            }

            .line-perf-chart {
                flex-grow: 1;
            }
        }

        &.chart-only-layout {
            flex-direction: row-reverse;

            > .search-condition-wrapper {
                > .search-condition-box {
                    display: none;
                }
                > .searched-condition-list {
                    border-top: 0 !important;
                    height: calc(100% - 32px) !important;
                    max-height: none;
                }
                flex: 0 0 340px;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border-left: 0;
                margin-bottom: 0;
            }
            > .line-perf-chart {
                flex-grow: 4;
                > .chart-component {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
            }
        }
    }
}
</style>
