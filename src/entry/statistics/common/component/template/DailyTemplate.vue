<template>
    <div class="dailyTemplate">
        <statistics-header
            :menu-name="menuName"
            :loading="loading"
            @stop-search="updateLoading(false)"
            @before-print="beforePrint"
            @after-print="afterPrint"
        />
        <div class="layout-line"></div>
        <div class="layout-body">
            <summary-infomation-in-domain></summary-infomation-in-domain>
            <div class="row table-msg">({{ i18n.M0027 }})</div>
            <total-performance-in-domain
                :key="renderSeq"
                :chart-width="chartWidth"
            ></total-performance-in-domain>
            <performance-summary-in-instance></performance-summary-in-instance>
            <performance-detail-in-instance
                v-if="viewDetailInInstance"
            ></performance-detail-in-instance>
            <error-count-in-instance
                :chapter-number="chapterNumberInErrorCount"
            ></error-count-in-instance>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { ariesuser, getDayjsUseFullYear } from '@common/base';
import { i18n } from '@common/utility';
import { OTypeDef } from '@common/definition';

import VueSummaryInfomationInDomain from '@entry/statistics/common/component/organisms/SummaryInfomationInDomain';
import VueTotalPerformanceInDomain from '@entry/statistics/common/component/organisms/DailyTotalPerformanceInDomain';
import VuePerformanceSummaryInInstance from '@entry/statistics/common/component/organisms/PerformanceSummaryInInstance';
import VuePerformanceDetailInInstance from '@entry/statistics/common/component/organisms/PerformanceDetailInInstance';
import VueErrorCountInInstance from '@entry/statistics/common/component/organisms/ErrorCountInInstance';
import StatisticsHeader from '@layout/container/header/StatisticsHeader';
import { PAGE_TYPE } from '@entry/statistics/common/common';
import LoadingIndicator from '@vuejs/component/Loading/LoadingIndicator';

const {
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('statistics');

const domainHelper = createNamespacedHelpers('domain');

export default {
    name: 'dailyTemplate',
    inject: {
        otype: {
            default: OTypeDef.SYSTEM,
        },
    },
    provide: {
        i18n: {
            domainGroup: i18n.get('ui.label.domainGroup'),
            bookmark: i18n.get('ui.label.bookmark'),
            help: i18n.get('ui.label.help'),
            print: i18n.get('ui.label.print'),
            targetSpecificCondition: i18n.get(
                'ui.label.targetSpecificCondition'
            ),
            searchCondition: i18n.get('ui.button.searchCondition'),
            M0651: i18n.get('M0651'),
        },
    },
    props: {
        menuName: {
            type: String,
            required: true,
        },
    },
    components: {
        summaryInfomationInDomain: VueSummaryInfomationInDomain,
        totalPerformanceInDomain: VueTotalPerformanceInDomain,
        performanceSummaryInInstance: VuePerformanceSummaryInInstance,
        performanceDetailInInstance: VuePerformanceDetailInInstance,
        errorCountInInstance: VueErrorCountInInstance,
        StatisticsHeader,
        LoadingIndicator,
    },
    data() {
        return {
            i18n: {
                M0027: i18n.get('M0027'),
            },
            resources: [
                { resourceType: 'domain', tree: [] },
                { resourceType: 'instance', tree: [] },
            ],
            names: {},
            values: {},
            contentHeight: 500,
            PAGE_TYPE: PAGE_TYPE,

            // 프린트할 때, 차트 리-렌더링을 위한 변수
            renderSeq: 1,
            chartWidth: 0,
        };
    },
    computed: {
        ...mapGetters({
            searchCondition: 'searchCondition',
            searchTimeInDaily: 'searchTimeInDaily',
        }),
        ...mapState({
            detailConditionByTarget: 'detailConditionByTarget',
            loading: 'loading',
        }),
        ...domainHelper.mapState({
            selectedOne: 'selectedOne',
        }),
        theme() {
            return ariesuser.theme;
        },
        isBusiness() {
            return this.otype === OTypeDef.BUSINESS;
        },
        viewDetailInInstance() {
            return (
                this.detailConditionByTarget.viewTable ||
                this.detailConditionByTarget.viewChart
            );
        },
        chapterNumberInErrorCount() {
            return this.viewDetailInInstance ? 4 : 3;
        },
    },
    methods: {
        ...mapMutations(['selectDomain', 'updateLoading']),
        ...mapActions([
            'fetchPeakTimeDataInDaily',
            'fetchTotalDataInDaily',
            'fetchSummaryDataInDaily',
            'fetchDetailChartDataInDaily',
            'fetchDetailTableDataInDaily',
            'fetchErrorCountInDaily',
        ]),
        timestampInDate() {
            const date = this.searchTimeInDaily.startDate,
                year = date.substr(0, 4),
                month = parseInt(date.substr(4, 2)) - 1,
                day = date.substr(6, 2);

            return getDayjsUseFullYear(year, month, day).valueOf();
        },
        async updateTotalAndPeakData() {
            await Promise.all([
                this.fetchPeakTimeDataInDaily(),
                this.fetchTotalDataInDaily(this.isBusiness),
            ]);
        },
        async updateSummaryTable() {
            await this.fetchSummaryDataInDaily(this.isBusiness);
        },
        async updateDetailTableNChart() {
            if (this.searchCondition.oids.length === 0) return;
            await Promise.all([
                this.fetchDetailTableDataInDaily(this.isBusiness),
                this.fetchDetailChartDataInDaily(this.isBusiness),
            ]);
        },
        async updateErrorData() {
            await this.fetchErrorCountInDaily(this.otype);
        },
        beforePrint() {
            this.chartWidth = 280;
            this.renderSeq += 1;
        },
        afterPrint() {
            this.chartWidth = 0;
            this.renderSeq += 1;
        },
    },
    watch: {
        async searchCondition() {
            this.updateLoading();
            await this.updateTotalAndPeakData();

            if (this.searchCondition.oids.length > 0) {
                await Promise.all([
                    this.updateSummaryTable(),
                    this.updateDetailTableNChart(),
                    this.updateErrorData(),
                ]);
            }
            this.updateLoading(false);
        },
        async detailConditionByTarget() {
            this.updateLoading();
            this.updateDetailTableNChart();
            this.updateLoading(false);
        },
        selectedOne(domain) {
            this.selectDomain({
                id: domain.data.sid,
                name: domain.data.title,
            });
            this.updateTotalAndPeakData();
        },
    },
    mounted() {
        this.selectDomain({
            id: this.selectedOne.data.sid,
            name: this.selectedOne.data.title,
        });
        this.updateTotalAndPeakData();
    },
};
</script>
<style lang="scss" scoped>
.dailyTemplate {
    height: 100%;
}
</style>
