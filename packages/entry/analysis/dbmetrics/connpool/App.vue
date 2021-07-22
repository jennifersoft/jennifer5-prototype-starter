<template>
    <div class="db-conn-pool-wrapper">
        <div v-show="expanded">
            <navigation-bar :show-search-btn="false">
                <navigation-item>
                    <format-date-input
                        :time="startTime"
                        :messages="messages"
                        @change="updateStartTime"
                    />
                    <format-date-input
                        :time="endTime"
                        :messages="messages"
                        @change="updateEndTime"
                    />
                </navigation-item>
                <navigation-item :label="i18n.gatheringInterval">
                    <dropdown
                        :items="intervalList"
                        :width="118"
                        :selected-value="interval"
                        @onchange="updateInterval"
                    />
                </navigation-item>
            </navigation-bar>
            <div class="search-condition-wrapper">
                <div class="upper">
                    <div class="resource-metric-group">
                        <resource-selector
                            tab="instance"
                            selectable
                            no-all-check
                            :no-border="false"
                            :resources="resourcesData"
                            @row-selected="onSelectResource"
                            @row-unselected="onUnselectResource"
                            style="width: 278px;"
                        />
                        <list-selector
                            :list="poolNamesData"
                            :title-label="i18n.connectionPool"
                            :disabled="loadingPoolNames"
                            no-search
                            multi-select
                            @check="updatePoolNames"
                            style="width: 220px;"
                        />
                        <list-selector
                            :list="metricsData"
                            :title-label="i18n.metrics"
                            no-search
                            multi-select
                            @check="updateMetrics"
                            style="width: 220px;"
                        />
                        <btn
                            :items="[{ iconType: icons.arrowRight }]"
                            :disabled="!isSelectionValid"
                            @click="onAddCondition"
                        />
                    </div>
                    <div class="condition-list-wrapper">
                        <search-condition-queue
                            style="height: 220px;"
                            :list="conditionQueue"
                            :formatter="queueItemFormatter"
                            @delete-row="removeCondition"
                        />
                        <div class="footer">
                            <loading-btn
                                :progress="progress"
                                :disabled="!activeSearch"
                                :suspendible="false"
                                @search="onSearch"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search-result-wrapper">
            <div class="header">
                <span></span>
                <div class="btn-group" v-click-outside="closeExtraDropdown">
                    <flip-flop-btn
                        :flipped="!expanded"
                        normal
                        @flip="expanded = !expanded"
                    />
                    <btn
                        v-tooltip="tooltipOptions"
                        :items="[{ iconType: icons.moreHorizon }]"
                        class="transparent"
                        normal
                        :pressed="showExtraDropdown"
                        @click="showExtraDropdown = !showExtraDropdown"
                    >
                    </btn>
                    <popup-list
                        v-if="showExtraDropdown"
                        :items="extraDropdownList"
                        :active-index="showStartTime ? 0 : -1"
                        @update:active-index="onSelectExtraDropdown"
                        :width="274"
                        style="top: 40px; right: 0;"
                        type="icon"
                        normal
                    />
                </div>
            </div>
            <db-conn-pool-table
                :list="tableData"
                :table-width="tableWidth"
                :table-height="tableHeightComputed"
            />
        </div>
        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import _ from '@library/lodash';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import messages from '@vuejs/component/messages';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import Btn from '@vuejs/component/button/Btn';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import clickOutside from '@vuejs/directive/clickOutside';
import tooltip from '@vuejs/container/topbar/vInstanceTooltip';
import LoadingBtn from '@vuejs/component/button/LoadingBtn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import SearchConditionQueue from '@entry/analysis/dbmetrics/common/SearchConditionQueue';
import DbConnPoolTable from '@entry/analysis/dbmetrics/connpool/container/DbConnPoolTable';
import {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
    mapRootGetters,
} from '@entry/analysis/dbmetrics/connpool/store';
import {
    gatheringIntervalList,
    connectionPoolMetrics,
    UTIL_LIST,
} from '@entry/analysis/dbmetrics/connpool/metadata';
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';
import { getJoinedKey } from '@entry/analysis/dbmetrics/connpool/store/mutations';
import FlipFlopBtn from '@entry/analysis/dbmetrics/common/FlipFlopBtn';

const TOP_PADDING = 540;

export default {
    name: 'App',
    components: {
        AlertWindow,
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        Dropdown,
        ListSelector,
        ResourceSelector,
        SearchConditionQueue,
        Btn,
        LoadingBtn,
        DbConnPoolTable,
        PopupList,
        FlipFlopBtn,
    },
    directives: {
        clickOutside,
        tooltip,
    },
    inject: {
        i18n: {
            default: () => ({
                gatheringInterval: 'gatheringInterval',
                connectionPool: 'connectionPool',
                metrics: 'metrics',
                more: 'more',
                time: 'time',
                M0123: 'M0123',
            }),
        },
    },
    computed: {
        ...mapState({
            startTime: state => state.time.start,
            endTime: state => state.time.end,
            interval: state => state.interval,
            resourcesData: state => state.resourcesData,
            poolNamesData: state => state.poolNamesData,
            metricsData: state => state.metricsData,
            loadingPoolNames: state => state.loadingPoolNames,
            conditionQueue: state => state.conditionQueue,
            conditionSet: state => state.conditionSet,
            resource: state => state.resource,
            poolNames: state => state.poolNames,
            metrics: state => state.metrics,
            tableData: state => state.tableData,
            progress: state => state.progress,
            showStartTime: state => state.showStartTime,
        }),
        ...mapGetters(['isSelectionValid']),
        ...mapRootGetters(['sidList']),
        activeSearch() {
            return this.conditionQueue.length > 0;
        },
        tooltipOptions() {
            return {
                content: this.i18n.more,
                offset: 4,
                isScrolling: false,
            };
        },
        onResizeDebounced() {
            return _.debounce(this.onResize, 300);
        },
        tableHeightComputed() {
            let h = this.tableHeight;
            if (!this.expanded) h += 343;
            return h;
        },
    },
    watch: {
        sidList() {
            this.fetchResource();
            this.onUnselectResource();
        },
        startTime() {
            this.fetchResource();
            this.onUnselectResource();
        },
        endTime() {
            this.fetchResource();
            this.onUnselectResource();
        },
    },
    data() {
        return {
            tableWidth: window.innerWidth - 154 - 20 * 2,
            tableHeight:
                document.documentElement.clientHeight - TOP_PADDING - 14,
            showExtraDropdown: false,
            expanded: true,
            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations([
            'updateStartTime',
            'updateEndTime',
            'updateInterval',
            'updateResource',
            'updatePoolNames',
            'updatePoolNamesData',
            'updateMetrics',
            'updateMetricsData',
            'pushCondition',
            'removeCondition',
            'updateShowStartTime',
            'updateTableData',
        ]),
        ...mapActions([
            'fetchResource',
            'fetchAlivePoolNames',
            'fetchDbConnPoolData',
        ]),
        onSearch() {
            const range = this.endTime.valueOf() - this.startTime.valueOf();
            const intervalMs = this.interval * 60 * 1000;

            if (this.sidList[0] === -1) {
                this.alertMessage = this.i18n.M0410;
                return;
            }

            if (range <= 0) {
                this.alertMessage = this.i18n.M0187;
                return;
            }

            if (range < intervalMs) {
                this.alertMessage = this.i18n.M0648;
                return;
            }

            this.fetchDbConnPoolData();
        },
        onSelectResource(row) {
            this.updateResource(row);
            this.fetchAlivePoolNames();
        },
        onUnselectResource() {
            this.updateResource();
            this.updatePoolNamesData();
            this.updatePoolNames();
        },
        onAddCondition() {
            const item = {
                resource: this.resource,
                pool: this.poolNames,
                metrics: this.metrics,
            };

            if (this.conditionSet.has(getJoinedKey(item))) {
                this.alertMessage = this.i18n.M0123;
                return;
            }
            this.pushCondition({
                ...item,
                key: Date.now(),
            });
        },
        queueItemFormatter({ resource, pool, metrics }) {
            const poolJoined = pool.map(p => p.label).join(',');
            const metricsJoined = metrics.map(p => p.label).join(',');
            return `${this.i18n.instance}(${resource.name}) ${this.i18n.connectionPool}(${poolJoined}) ${this.i18n.metrics}(${metricsJoined})`;
        },
        onResize() {
            const navbarWidth = 154;
            const padding = 20;
            const scrollWidth = 14;
            this.tableWidth = window.innerWidth - navbarWidth - 2 * padding;
            this.tableHeight =
                document.documentElement.clientHeight -
                TOP_PADDING -
                scrollWidth;
        },
        onSelectExtraDropdown(index) {
            if (index === 0) {
                this.updateShowStartTime(!this.showStartTime);
            } else this.exportData();
        },
        closeExtraDropdown() {
            this.showExtraDropdown = false;
        },
        exportData() {
            const blob = new Blob(['\ufeff' + this.getCsv()], {
                type: 'text/csv;charset=utf8',
            });
            const csvUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const filename = `dbconnpool_${getDayjs().format('YYYYMMDD')}.csv`;

            a.setAttribute('style', 'display:none');
            a.setAttribute('href', csvUrl);
            a.setAttribute('download', filename);
            document.body.appendChild(a);

            a.click();
            a.remove();
        },
        getCsv() {
            let csv = '';

            const headerRows = [this.i18n.time];
            this.conditionQueue.forEach(item => {
                const { resource, pool, metrics } = item;
                pool.forEach(p => {
                    metrics.forEach(m => {
                        headerRows.push(
                            `${m.label} (${p.label} | ${resource.name})`
                        );
                    });
                });
            });
            csv += headerRows.join(',') + '\n';

            this.tableData
                .map(e => e.list)
                .forEach(row => {
                    const dataRow = [];
                    row.forEach((d, i) => {
                        if (i === 0) {
                            dataRow.push(
                                convertTimeText(
                                    d,
                                    this.endTime.valueOf(),
                                    this.interval,
                                    this.showStartTime
                                )
                            );
                            return;
                        }
                        dataRow.push(d === -1 ? '' : d);
                    });
                    csv += dataRow.join(',') + '\n';
                });

            return csv;
        },
    },
    created() {
        this.messages = messages;
        this.icons = {
            arrowRight: ICON_TYPE.arrowRight,
            moreHorizon: ICON_TYPE.moreHorizon,
        };
        this.intervalList = gatheringIntervalList;
        this.extraDropdownList = UTIL_LIST;
    },
    async mounted() {
        await this.fetchResource();
        this.updateMetricsData(connectionPoolMetrics);
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeMount() {
        window.removeEventListener('resize', this.onResizeDebounced);
        this.updateTableData();
    },
};
</script>

<style scoped></style>
