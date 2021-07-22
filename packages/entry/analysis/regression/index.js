import _ from '@library/lodash';
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import CommonHeader from '@layout/container/header/CommonHeader';
import ToolBar from './container/ToolBar';
import SearchOption from './container/SearchOption';
import Contents from './container/Contents';
import Folder from './container/Folder';
import { i18n } from '@common/utility';
import { MxDef } from '@common/definition';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { Instance } from '@service/oidConfig';
import { StandardMetrics } from '@service/metrics';
import { ariesuser } from '@common/base';
import { createHeatmapChartData } from './utility';
import store, { mapState, mapGetters, mapMutations, mapActions } from './vuex';
import messages from './i18n';
import '@layout/base';
import './index.scss';

const domainMap = createNamespacedHelpers('domain');

new Vue({
    el: '#vue_app',
    store,
    provide: {
        theme: ariesuser.theme,
        i18n: messages,
    },
    components: {
        CommonHeader,
        ToolBar,
        SearchOption,
        Contents,
        Folder,
    },
    data: function() {
        const COMMON_METRICS = [
            { label: messages.serviceTime, value: MxDef.service_time },
            { label: messages.activeService, value: MxDef.active_service },
            { label: messages.serviceRate, value: MxDef.service_rate },
            { label: messages.errorCount, value: MxDef.error_count },
            { label: messages.concurrentUser, value: MxDef.concurrent_user },
            { label: messages.sqlTime, value: MxDef.sql_time },
            { label: messages.fetchTime, value: MxDef.fetch_time },
            {
                label: messages.externalcallTime,
                value: MxDef.externalcall_time,
            },
        ];

        const DOMAIN_METRICS = [
            { label: messages.aliveInstCount, value: MxDef.alive_inst_count },
        ];

        const INSTANCE_METRICS = [
            { label: messages.gcTimeUsage, value: MxDef.gc_time_usage },
            { label: messages.sysCpu, value: MxDef.sys_cpu },
            { label: messages.sysMemRate, value: MxDef.sys_mem_rate },
            { label: messages.threadCurrent, value: MxDef.thread_current },
            {
                label: messages.avgDbPoolActiveCount,
                value: MxDef.average_db_pool_active_count,
            },
        ];

        return {
            domainMetrics: COMMON_METRICS.concat(DOMAIN_METRICS),
            instanceMetrics: COMMON_METRICS.concat(INSTANCE_METRICS),

            resources: [
                { resourceType: 'domain', tree: [] },
                { resourceType: 'instance', tree: [] },
            ],
            names: {
                heatmap: [],
            },
            values: {
                heatmap: [],
            },
            searching: false,
            metrics: [],
            resizeHandler: null,
        };
    },
    computed: {
        ...domainMap.mapGetters({
            domainIds: 'sidList',
        }),
        ...mapState({
            comparisonType: state => state.comparisonType,
            currentResource: state => state.currentResource,
            domainId: state => state.domainId,
            instanceOid: state => state.instanceOid,
            metricNames: state => state.metricNames,
            metricValues: state => state.metricValues,
            interval: state => parseInt(state.intervalType) * 1000 * 60,
            startHour: state => state.startHour,
            endHour: state => state.endHour,
            period: state => state.period,
            heatmapValues: state => state.heatmapValues,
            toolbarFold: state => state.toolbarFold,
            scrollHeight: state => state.scrollHeight,
            fetching: state => state.fetching,
        }),
        ...mapGetters(['searchTimes']),
        scrollStyle() {
            return {
                'max-height': `${this.scrollHeight}px`,
            };
        },
    },
    methods: {
        ...mapMutations([
            'updateMetricData',
            'changeToolbarFold',
            'resizeScrollHeight',
        ]),
        ...mapActions(['loadHeatmapData']),
        updateMetricsType1() {
            const items =
                this.currentResource == 'instance'
                    ? this.instanceMetrics
                    : this.domainMetrics;

            this.metrics = items;

            this.updateMetricData([
                items.map(item => item.label),
                items.map(item => item.value),
            ]);
        },
        updateMetricsType2() {
            StandardMetrics.get(this.currentResource).then(res => {
                this.metrics = res.data.map(d => {
                    return {
                        label: i18n.get(`ui.mx.${d[0]}`),
                        description: i18n.get(`ui.mx.${d[0]}.tooltip`),
                        value: d[1],
                    };
                });

                this.updateMetricData([[], []]);
            });
        },
        fetchResource(sidToFetch) {
            Instance.get(
                sidToFetch,
                this.searchTimes[0],
                this.searchTimes[1]
            ).then(res => {
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
            });
        },
        async analysisRegression() {
            this.searching = true;
            await this.loadHeatmapData({
                startTime: this.searchTimes[0],
                endTime: this.searchTimes[1],
                interval: this.interval,
            });

            this.names.heatmap = this.metricNames;
            this.values.heatmap = this.heatmapValues;
            this.searching = false;
            this.changeToolbarFold(true);
        },
    },
    watch: {
        domainIds(newVal) {
            this.fetchResource(newVal);
        },
        comparisonType(newVal) {
            if (newVal === 1) this.updateMetricsType1();
            else this.updateMetricsType2();
        },
        currentResource() {
            if (this.comparisonType === 1) this.updateMetricsType1();
            else this.updateMetricsType2();
        },
    },
    created() {
        this.fetchResource(this.domainIds);
        this.updateMetricsType1();
        this.resizeHandler = _.throttle(this.resizeScrollHeight, 100);
        this.resizeHandler();
    },
    beforeMount() {
        this.names.heatmap = this.metricNames;
        this.values.heatmap = createHeatmapChartData(this.metricNames, null);
    },
    mounted() {
        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
});
