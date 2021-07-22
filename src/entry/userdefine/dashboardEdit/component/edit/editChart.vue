<template>
    <div class="chart-edit">
        <div
            class="chart-configure-without-btn"
            :style="{
                '--margin-top-position-fixed': marginTopByScrollY + 'px',
            }"
            @scroll.passive="handleScroll"
        >
            <div class="title-1">
                <div>{{ i18n.chart }}</div>
            </div>
            <div class="new-tab">
                <tab
                    :tabs="tabs"
                    small
                    :active-tab="selectedInsertTypeOnUI"
                    @change="onClickTab"
                />
            </div>
            <div class="chart-title">
                <div class="title-2">
                    {{ i18n.chartName }}
                </div>
                <input-field small v-model="chartTitle" />
            </div>
            <div class="chart-tab-contents">
                <div
                    class="custom-chart-configure"
                    v-show="selectedInsertTypeOnUI === CHART_TYPE_ON_UI.CUSTOM"
                >
                    <div class="title-2">
                        {{ i18n.chartTypeSelect }}
                    </div>
                    <custom-chart-selector />
                </div>

                <div
                    class="configure"
                    v-show="chartTypeOnEditingChart === 'list.activeservice'"
                >
                    <activeservice-list-configure />
                </div>

                <div
                    class="configure"
                    v-show="chartTypeOnEditingChart === 'scoreboard'"
                >
                    <div class="title-2">
                        {{ i18n.scoreboardConfigure }}
                    </div>
                    <score-board-configure />
                </div>
                <div class="configure">
                    <div class="title-2">
                        {{ i18n.targetConfig }}
                    </div>
                    <topbar-sync-in-chart-configure
                        v-show="hideWhenChartDontNeed === false"
                    />

                    <div
                        class="target-configure-by-domain-group-selector"
                        v-show="!isDomainBarSyncOnEditingChart"
                    >
                        <domain-group-selector
                            @elementSelected="onChangeDomain"
                            :selectedOne="selectedOne"
                            :vertically-aligned="true"
                            ref="r"
                            :domain-group-tree="domainList"
                        />
                        <resource-selector
                            class="target-box"
                            ref="targetBox"
                            @tab-change="tabChangeHandler"
                            :tab="currentTabOnTargetBox"
                            :no-border="false"
                            :selectable="isSingleTarget"
                            :noAllCheck="isSingleTarget"
                            @resource-change="resourceChangeHandler"
                            @row-selected="targetRowSelectHandler"
                            @row-unselected="targetRowUnSelectHandler"
                            :resources="targetData"
                        />
                    </div>
                </div>
                <div
                    class="configure"
                    v-show="chartTypeOnEditingChart === 'speedvertical'"
                >
                    <div class="title-2">
                        {{ i18n.domainDivideLine }}
                    </div>
                    <speedmeter-configure />
                </div>
                <div
                    class="configure metrics-configure"
                    v-show="
                        selectedInsertTypeOnUI === CHART_TYPE_ON_UI.GENERAL ||
                            chartTypeOnEditingChart === 'line.compare'
                    "
                >
                    <div class="title-2">
                        {{ i18n.selectData }}
                    </div>
                    <!--                    선택된 값을 넘겨야 한다. 지금은 넘길수 없다. 컴포넌트에서 처리 해야함.-->
                    <metric-selector
                        class="metrics-box"
                        :tooltip-on-left="true"
                        :metrics="metricsList"
                        :active-indexes="selectedMetricIndexes"
                        @metricSelect="metricSelectHandler"
                        ref="metricSelector"
                    />
                </div>
                <div
                    class="general-chart-configure"
                    v-show="selectedInsertTypeOnUI === CHART_TYPE_ON_UI.GENERAL"
                >
                    <div class="title-2">
                        {{ i18n.chartTypeSelect }}
                    </div>
                    <general-chart-selector />
                </div>

                <div
                    class="configure"
                    v-show="selectedInsertTypeOnUI === CHART_TYPE_ON_UI.FRONT"
                >
                    <div class="title-2">
                        {{ i18n.selectData }}
                    </div>
                    <jennifer-front-selector />
                </div>
            </div>
        </div>
        <div class="insert-or-modify-box">
            <btn
                :items="[{ text: i18nInsertOrModify }]"
                style="width: 248px; margin: 10px auto 0 auto; text-align: center!important;"
                class="focus"
                normal
                @click="onClickInsertOrModify"
            />
        </div>
    </div>
</template>
<script>
import DomainGroupSelector from '@vuejs/component/Domain/DomainGroupSelector/DomainGroupSelector.vue';

import { Business, Instance } from '@service/oidConfig';
import { getDayjs } from '@common/base';
import { GenerateKey } from '@module/global/GenerateKey';

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

import { ID } from '@common/legacy/ID';
import { OIDDef, OTypeDef } from '@common/definition';
import {
    CHART_TYPE_ON_UI,
    PERCENTAGE_METRICS,
} from '@entry/userdefine/dashboardEdit/const';

import Btn from '@vuejs/component/button/Btn';
import Tab from '@vuejs/component/tab/Tab';
import MetricSelector from '@vuejs/component/Resource/MetricSelector/MetricSelector';
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';

import GeneralChartSelector from '@entry/userdefine/dashboardEdit/component/chartSelector/generalChartSelector';
import CustomChartSelector from '@entry/userdefine/dashboardEdit/component/chartSelector/customChartSelector';
import { loadMetrics } from '@entry/userdefine/dashboardEdit/http';
import TopbarSyncInChartConfigure from '@entry/userdefine/dashboardEdit/component/configure/topbarSyncInChartConfigure';
import JenniferFrontSelector from '@entry/userdefine/dashboardEdit/component/chartSelector/jenniferFrontSelector';

import ActiveserviceListConfigure from '@entry/userdefine/dashboardEdit/component/configure/ActiveserviceListConfigure';
import ScoreBoardConfigure from '@entry/userdefine/dashboardEdit/component/configure/scoreBoardConfigure';
import SpeedmeterConfigure from '@entry/userdefine/dashboardEdit/component/configure/speedmeterConfigure';

import InputField from '@vuejs/component/Input/InputField';
import { i18n } from '@common/utility';
import { DashboardSocketHandler } from '@module/common/DashboardSocketHandler';
import { DashboardAjaxHandler } from '@module/common/DashboardAjaxHandler';
import { startOfDayjs } from '@common/dayjsWrapper';

export default {
    name: 'editChart',
    components: {
        Btn,
        Tab,
        InputField,
        SpeedmeterConfigure,
        ScoreBoardConfigure,
        ActiveserviceListConfigure,
        JenniferFrontSelector,
        TopbarSyncInChartConfigure,
        CustomChartSelector,
        GeneralChartSelector,
        MetricSelector,
        DomainGroupSelector,
        ResourceSelector,
    },
    data() {
        return {
            tabs: [
                {
                    key: CHART_TYPE_ON_UI.GENERAL,
                    value: i18n.get('ui.label.chart.general'),
                },
                {
                    key: CHART_TYPE_ON_UI.CUSTOM,
                    value: i18n.get('ui.label.chart.advanced'),
                },
            ],
            GenerateKey: GenerateKey,
            CHART_TYPE_ON_UI: CHART_TYPE_ON_UI,

            currentTabOnTargetBox: 'instance',

            selectedMetricIndexes: [],
            multiTargetData: [
                { resourceType: 'domain', tree: [] },
                { resourceType: 'instance', tree: [] },
                { resourceType: 'business', tree: [] },
            ],
            singleTargetData: [
                { resourceType: 'domain', tree: [] },
                { resourceType: 'instance', tree: [] },
                { resourceType: 'business', tree: [] },
            ],
            metricsList: [],
            i18n: {
                chart: i18n.get('ui.label.chart'),
                chartName: i18n.get('ui.label.chartName'),
                chartGeneral: i18n.get('ui.label.chart.general'),
                chartAdvanced: i18n.get('ui.label.chart.advanced'),
                chartFront: 'JENNIFER Front',
                chartTypeSelect: i18n.get('ui.label.chart.type.select'),
                chartFontSize: i18n.get('ui.label.chart.font.size'),
                domainDivideLine: i18n.get('ui.label.domain.divide.line'),
                selectData: i18n.get('ui.label.select.data'),
                targetConfig: i18n.get('ui.label.targetConfig'),

                scoreboardConfigure: i18n.get('ui.label.scoreboard.configure'),
            },

            marginTopByScrollY: 0,
            topbarTypes: [
                { text: i18n.get('ui.label.none'), value: 'none' },
                {
                    text: i18n.get('ui.label.topbar.instance.single'),
                    value: 'domain_instance_single',
                },
                {
                    text: i18n.get('ui.label.topbar.instance.multi'),
                    value: 'domain_instance_multi',
                },
            ],
            topbarType: this.usedTopbarType || 'none',
            minElapseTime: 0,
        };
    },
    methods: {
        ...mapMutations('domain', ['selectDomain']),
        ...mapActions('domain', ['updateMultiDomainFlag']),

        ...mapMutations('userdefine', [
            'setComponent',
            'clearAllOnEditingChart',
            'showCheckWindowWithMessage',
            'setMetricsOnEditingChart',
            'setTargetOnEditingChart',
            'setChartTitleOnEditingChart',
            'setFixedmaxOnEditingChart',
            'emitInsertTypeOnUI',
        ]),

        ...mapActions('userdefine', ['emitChartOptionWhenClickJenniferFront']),

        onClickInsertOrModify() {
            //삽입일때는 차트 개수를 체크한다.
            if (
                this.editingComponentDataKey === undefined &&
                this.countCharts >= this.chartLimitCount
            ) {
                let msg = i18n.get('M0426');
                msg = msg.replace('%d', this.chartLimitCount);
                this.showCheckWindowWithMessage(msg);
                return;
            }

            if (
                (this.isActiveGeneralTab ||
                    this.editingChartOptions.charttype === 'line.compare') &&
                this.editingChartOptions.metrics === undefined
            ) {
                this.showCheckWindowWithMessage(i18n.get('M0268'));
                return;
            }

            if (this.editingChartOptions.charttype === undefined) {
                this.showCheckWindowWithMessage(i18n.get('M0267'));
                return;
            }

            if (
                this.editingChartOptions.domainBarSync === false &&
                this.editingChartOptions.oid.length === 0
            ) {
                this.showCheckWindowWithMessage(i18n.get('M0266'));
                return;
            }

            PERCENTAGE_METRICS.includes(this.editingChartOptions.metrics)
                ? this.setFixedmaxOnEditingChart(100)
                : this.setFixedmaxOnEditingChart(undefined);

            const chartOption = this.editingComponentDataKey
                ? Object.assign({ ...this.editingChartOptions })
                : Object.assign(
                      { ...this.editingChartOptions },
                      this.defaultComponentPosition,
                      { dataKey: GenerateKey.makeLongKeyByTime() }
                  );

            if (chartOption.domainBarSync) chartOption.targetType = 'agent';

            chartOption.zIndex = this.nextZIndex;
            if (chartOption.charttype === 'scoreboard')
                chartOption.cellConfigureArray = new Array(
                    chartOption.rowcount * chartOption.columncount
                );
            else if (chartOption.charttype === 'line.external') {
                chartOption.targetType = 'domain';
            }

            //기존에 사용하던 필드값에 맞춰서 보정.
            chartOption.datatype = chartOption.targetType;

            this.setComponent(chartOption);

            DashboardSocketHandler.reconnect('chart modify or add');
            DashboardAjaxHandler.requestAjax();
        },

        onChangeDomain(element) {
            this.selectDomain(element.treeIndex);
        },

        handleScroll(event) {
            this.marginTopByScrollY = event.target.scrollTop * -1;
        },

        onClickTab(type) {
            this.emitInsertTypeOnUI(type);
            this.clearAllOnEditingChart();
            this.selectedMetricIndexes = [];
            this.clearCheckedOnTarget();
        },

        clearCheckedOnTarget() {
            Object.values(this.multiTargetData).forEach((object, index) => {
                const tree = object.tree.slice(0);
                tree.forEach(row => (row.check = 'off'));

                this.$set(this.multiTargetData, index, {
                    resourceType: object.resourceType,
                    tree,
                });
            });
        },

        metricSelectHandler(metrics) {
            this.setMetricsOnEditingChart(metrics.value);
        },

        tabChangeHandler(tab) {
            this.currentTabOnTargetBox = tab;

            const data = this.targetData.find(
                data => data.resourceType === tab
            );

            if (data) this.resourceChangeHandler(data);
            this.fetchMetrics();
            if (this.$refs.metricSelector)
                this.$refs.metricSelector.unselectMetric();
        },

        resourceChangeHandler({ resourceType, tree }) {
            const idSet = new Set();
            const sidSet = new Set();

            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);

            const checked = tree.filter(t => {
                if (this.currentTabOnTargetBox === 'domain') {
                    return t.check === 'on';
                }
                return t.data.oid !== -1 && t.check === 'on';
            });

            checked.forEach(c => {
                const sid = c.data.sid;
                const oid = c.data.oid;

                if (this.currentTabOnTargetBox === 'domain') {
                    // ids.push(OIDDef.TOT);
                    idSet.add(OIDDef.TOT);
                } else {
                    this.currentTabOnTargetBox === 'business'
                        ? idSet.add(ID.business(sid, oid))
                        : idSet.add(ID.agent(sid, oid));
                }

                sidSet.add(sid);
            });

            this.setTargetOnEditingChart({
                sid: Array.from(sidSet),
                oid: Array.from(idSet),
                otype:
                    this.currentTabOnTargetBox === 'business'
                        ? OTypeDef.BUSINESS
                        : OTypeDef.SYSTEM,
                targetType: resourceType,
            });
        },

        targetRowSelectHandler(rowData) {
            this.setTargetOnEditingChart({
                sid: [rowData.sid],
                oid:
                    this.currentTabOnTargetBox === 'business'
                        ? [ID.business(rowData.sid, rowData.oid)]
                        : [ID.agent(rowData.sid, rowData.oid)],
                otype:
                    this.currentTabOnTargetBox === 'business'
                        ? OTypeDef.BUSINESS
                        : OTypeDef.SYSTEM,
                targetType: this.currentTabOnTargetBox,
            });
        },

        targetRowUnSelectHandler() {},

        fetchInstanceNBusiness() {
            const sidArray = this.sidList;
            const { startTime, endTime } = this.startTimeNEndTime;

            return Promise.all([
                Instance.get(sidArray, startTime, endTime).then(res => {
                    const multiRow = normalizeOidConfigResponse(
                        res,
                        'instance'
                    ).map(n => ({
                        ...n,
                        check: 'off',
                        selected: false,
                        noInteraction: n.resourceType === 'domain',
                    }));

                    const singleRow = normalizeOidConfigResponse(
                        res,
                        'instance'
                    ).map(n => ({
                        ...n,
                        check: 'no-check',
                        selected: false,
                        noInteraction: n.resourceType === 'domain',
                    }));

                    this.$set(this.multiTargetData, 1, {
                        resourceType: 'instance',
                        tree: Array.from(multiRow),
                    });
                    this.$set(this.singleTargetData, 1, {
                        resourceType: 'instance',
                        tree: Array.from(singleRow),
                    });

                    const domains = multiRow
                        .filter(d => {
                            return d.resourceType === 'domain';
                        })
                        .map(n => ({
                            ...n,
                            fold: 'no-fold',
                            noFoldPadding: true,
                        }));
                    this.$set(this.multiTargetData, 0, {
                        resourceType: 'domain',
                        tree: domains,
                    });
                    this.$set(this.singleTargetData, 0, {
                        resourceType: 'domain',
                        tree: domains,
                    });
                }),
                Business.get(sidArray, startTime, endTime).then(res => {
                    const multiRow = normalizeOidConfigResponse(
                        res,
                        'business'
                    ).map(n => ({
                        ...n,
                        check: 'off',
                        selected: false,
                        noInteraction: n.resourceType === 'domain',
                    }));

                    const singleRow = normalizeOidConfigResponse(
                        res,
                        'business'
                    ).map(n => ({
                        ...n,
                        check: 'no-check',
                        selected: false,
                        noInteraction: n.resourceType === 'domain',
                    }));

                    this.$set(this.multiTargetData, 2, {
                        resourceType: 'business',
                        tree: Array.from(multiRow),
                    });
                    this.$set(this.singleTargetData, 2, {
                        resourceType: 'business',
                        tree: Array.from(singleRow),
                    });
                }),
            ]);
        },
        async fetchMetrics() {
            const metricsData = await loadMetrics(this.currentTabOnTargetBox);
            const list = metricsData.data;

            this.metricsList = list.map(data => {
                return {
                    label: i18n.get(`ui.mx.${data[0]}`),
                    description: i18n.get(`ui.mx.${data[0]}.tooltip`),
                    value: Number(data[1]),
                };
            });
        },

        unselectMetric() {
            if (this.$refs.metricSelector)
                this.$refs.metricSelector.unselectMetric();
        },
    },
    computed: {
        ...mapState('domain', ['domainList', 'selectedOne']),

        ...mapGetters('domain', ['sidList']),

        ...mapState('userdefine', [
            'editingChartOptions',
            'editingComponentDataKey',
            'defaultComponentPosition',
            'serverValues',
            'selectedInsertTypeOnUI',
        ]),

        ...mapGetters('userdefine', [
            'nextZIndex',
            'countCharts',
            'hideWhenChartDontNeed',
        ]),

        showFrontTab() {
            return this.serverValues.useJenniferFrontOnDashboard;
        },

        chartLimitCount() {
            return this.serverValues.configLimitChartCount;
        },

        targetData() {
            let targetData;
            if (this.editingChartOptions.charttype === 'line.compare')
                targetData = this.singleTargetData;
            else if (
                this.editingChartOptions.charttype === 'speedvertical' ||
                this.editingChartOptions.charttype === 'speedhorizon'
            )
                targetData = this.multiTargetData.slice(0, 2);
            else if (this.editingChartOptions.charttype === 'line.external')
                targetData = this.multiTargetData.slice(0, 1);
            else targetData = this.multiTargetData;

            return targetData;
        },

        isSingleTarget() {
            return this.editingChartOptions.charttype === 'line.compare';
        },

        chartTypeOnEditingChart() {
            return this.editingChartOptions.charttype;
        },

        isActiveGeneralTab() {
            return this.selectedInsertTypeOnUI === CHART_TYPE_ON_UI.GENERAL;
        },

        isDomainBarSyncOnEditingChart() {
            return this.editingChartOptions.domainBarSync;
        },

        startTimeNEndTime() {
            const moment = startOfDayjs(getDayjs(), 'date');

            // 금일 0시 0분 0초로 설정
            const startTime = moment.valueOf();
            const endTime = moment.add(1, 'day').valueOf();

            return { startTime: startTime, endTime: endTime };
        },

        i18nInsertOrModify() {
            return this.editingComponentDataKey
                ? i18n.get('ui.label.modifyChart')
                : i18n.get('ui.label.insertChart');
        },

        cssVars() {
            return {
                '--scroll-y': this.positionOnScrollY + 'px',
            };
        },
        chartTitle: {
            get() {
                return this.editingChartOptions.title;
            },
            set(value) {
                this.setChartTitleOnEditingChart(value);
            },
        },
    },
    mounted() {
        this.fetchInstanceNBusiness();
        this.fetchMetrics();

        if (this.serverValues.useJenniferFrontOnDashboard)
            this.tabs.push({
                key: CHART_TYPE_ON_UI.FRONT,
                value: 'JENNIFER Front',
            });
    },
    watch: {
        sidList() {
            this.fetchInstanceNBusiness();
        },

        selectedInsertTypeOnUI() {
            if (this.selectedInsertTypeOnUI === CHART_TYPE_ON_UI.FRONT) {
                this.currentTabOnTargetBox = 'domain';
                this.emitChartOptionWhenClickJenniferFront();
            }
        },

        editingChartOptions() {
            if (this.editingChartOptions.metrics) {
                const index = this.metricsList.findIndex(
                    metrics =>
                        metrics.value === this.editingChartOptions.metrics
                );
                if (index > -1) this.selectedMetricIndexes = [index];
            }

            if (
                this.editingChartOptions.charttype === 'speedvertical' ||
                this.editingChartOptions.charttype === 'speedhorizon'
            ) {
                //비즈니스 대상이 선택되어 있다면 강제로 변경해준다.
                if (this.currentTabOnTargetBox === 'business')
                    this.currentTabOnTargetBox = 'instance';
            }

            if (
                this.editingChartOptions.domainBarSync === false &&
                this.editingChartOptions.datatype
            ) {
                //선택된 차트가 상단바 동기화가 아닐때 인스턴스 or 비즈니스라면 대상선택 컴포넌트와 동기화 해준다.
                const datatype = this.editingChartOptions.datatype;
                const sidArr = this.editingChartOptions.sid;

                const treeIndex =
                    datatype === 'domain' ? 0 : datatype === 'instance' ? 1 : 2;
                const tree = this.multiTargetData[treeIndex].tree.slice(0);

                if (datatype === 'domain') {
                    tree.forEach(row => {
                        const findIndex = sidArr.findIndex(
                            sid => sid === row.data.sid
                        );

                        findIndex > -1
                            ? (row.check = 'on')
                            : (row.check = 'off');
                    });
                } else {
                    const idArray = this.editingChartOptions.oid.map(key =>
                        ID.parse(key)
                    );
                    tree.forEach(row => {
                        const findIndex = idArray.findIndex(id => {
                            return (
                                id.sid === row.data.sid &&
                                id.oid === row.data.oid
                            );
                        });

                        findIndex > -1
                            ? (row.check = 'on')
                            : (row.check = 'off');
                    });
                }

                this.currentTabOnTargetBox = datatype;

                this.$set(this.multiTargetData, treeIndex, {
                    resourceType: datatype,
                    tree: tree,
                });
            }
        },
    },
};
</script>
<style id="styles"></style>
<style lang="scss" scoped>
@import '../themes.scss';
.chart-edit {
    width: 280px;
    @include themify($themes) {
        background-color: themed('area-menu-background-color');
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .chart-configure-without-btn {
            //height: calc(100% - 67px);

            flex: 1 1 700px;

            overflow-y: auto;
            &.default-overflow {
                /*overflow: visible;*/
            }

            div.chart-title {
                padding: 16px;
                display: flex;
                flex-direction: column;
            }

            div.chart-tab-contents {
                display: flex;
                flex-direction: column;
                height: 720px;
                /*height: calc(100% - 230px);*/

                .configure {
                    border-top: solid 1px themed('area-menu-border-color');
                    padding: 16px;
                }

                .target-configure-by-domain-group-selector {
                    &.inactive {
                        display: none;
                    }

                    ::v-deep .domain-group-selector {
                        margin-bottom: 10px;

                        .depth-tree {
                            position: fixed;
                            top: auto;
                            right: 16px;
                            margin-top: var(--margin-top-position-fixed);

                            .breadcrumb-row {
                                min-width: 210px;
                                max-width: 210px;
                            }
                        }
                    }
                }

                .target-box {
                    min-width: unset;

                    ::v-deep .search-input {
                        width: unset;
                    }
                }

                .metrics-configure {
                    flex: none;

                    .metrics-box {
                        height: 160px;
                    }
                }

                .general-chart-configure {
                    border-top: solid 1px themed('area-menu-border-color');
                    padding: 16px 0 0 16px;
                    flex-grow: 1;
                    height: 150px;
                }

                .custom-chart-configure {
                    border-top: solid 1px themed('area-menu-border-color');
                    padding: 16px 0 0 16px;
                }
            }
        }

        .insert-or-modify-box {
            box-sizing: border-box;
            margin-top: auto;
            //height: 67px;
            flex: 0 0 67px;
            border-top: solid 1px themed('area-menu-border-color');

            display: flex;
        }
        div.title-1 {
            height: 40px;
            > div {
                height: 24px;
                margin: 8px 0 8px 16px;
                font-size: 14px;
                font-weight: bold;
                color: themed('edit-component-title1-color');
            }
        }

        div.title-2 {
            font-size: 12px;
            line-height: 12px;
            color: themed('edit-component-title2-color');
            margin-bottom: 10px;
        }
    }
}
</style>
