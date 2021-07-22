<template>
    <div class="db-disk-wrapper">
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
                <checkbox
                    :label="i18n.viewByDate"
                    :active="viewByDate"
                    @change="updateViewByDate"
                />
            </navigation-bar>
            <div class="search-condition-wrapper">
                <div class="upper">
                    <div class="resource-metric-group">
                        <resource-selector
                            :no-border="false"
                            :resources="resourceData"
                            tab="instance"
                            no-all-check
                            selectable
                            style="width: 278px;"
                            @row-selected="onSelectResource"
                            @row-unselected="onUnselectResource"
                        />
                        <list-selector
                            :list="partitionData"
                            :title-label="i18n.partition"
                            :disabled="loadingPartitionList"
                            multi-select
                            no-search
                            style="width: 220px;"
                            @check="updateSelectedPartitions"
                        />
                        <list-selector
                            :list="metricData"
                            :title-label="i18n.metrics"
                            multi-select
                            no-search
                            style="width: 220px;"
                            @check="updateSelectedMetrics"
                        />
                        <btn
                            :items="[{ iconType: icons.arrowRight }]"
                            :disabled="!isSelectionValid"
                            @click="onAddCondition"
                        />
                    </div>
                    <div class="condition-list-wrapper">
                        <search-condition-queue
                            :list="conditionQueue"
                            :formatter="queueItemFormatter"
                            @delete-row="removeSearchCondition"
                            style="height: 220px;"
                        />
                        <div class="footer">
                            <loading-btn
                                :disabled="!activeSearch"
                                :progress="progress"
                                :suspendible="false"
                                @search="onClickSearch"
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
            <disk-usage-table
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
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';
import { ClientUtilities } from '@common/legacy/ClientUtilities';
import { DEFAULT_METRIC_DATA } from '@entry/analysis/dbmetrics/disk/metadata';
import {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
    mapRootGetters,
} from '@entry/analysis/dbmetrics/disk/store';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import messages from '@vuejs/component/messages';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Btn from '@vuejs/component/button/Btn';
import ResourceSelector, {
    capitalizeFirstLetter,
} from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import SearchConditionQueue from '@entry/analysis/dbmetrics/common/SearchConditionQueue';
import LoadingBtn from '@vuejs/component/button/LoadingBtn';
import DiskUsageTable from '@entry/analysis/dbmetrics/disk/container/DiskUsageTable';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import clickOutside from '@vuejs/directive/clickOutside';
import vInstanceTooltip from '@vuejs/container/topbar/vInstanceTooltip';
import { UTIL_LIST } from '@entry/analysis/dbmetrics/connpool/metadata';
import { getJoinedKey } from '@entry/analysis/dbmetrics/disk/store/mutations';
import FlipFlopBtn from '@entry/analysis/dbmetrics/common/FlipFlopBtn';

const TOP_PADDING = 540;

export default {
    name: 'App',
    components: {
        AlertWindow,
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        Checkbox,
        ResourceSelector,
        ListSelector,
        Btn,
        SearchConditionQueue,
        LoadingBtn,
        DiskUsageTable,
        PopupList,
        FlipFlopBtn,
    },
    directives: {
        clickOutside,
        tooltip: vInstanceTooltip,
    },
    inject: {
        i18n: {
            inject: {
                showStartTime: {
                    default: 'Show Start Time',
                },
                viewByDate: {
                    default: 'View By Date',
                },
                partition: {
                    default: 'Partition',
                },
                metrics: {
                    default: 'Metrics',
                },
                instance: {
                    default: 'Instance',
                },
                M0377: {
                    default: 'End-date cannot be earlier than the start-date.',
                },
                M0004: {
                    default: 'Data does not exist.',
                },
                M0123: {
                    default: 'The same setting already exists.',
                },
            },
        },
    },
    computed: {
        ...mapState({
            startTime: state => state.time.start,
            endTime: state => state.time.end,
            showStartTime: state => state.showStartTime,
            viewByDate: state => state.viewByDate,
            cacheViewByDate: state => state.filterCache.viewByDate,
            resourceData: state => state.resourceData,
            partitionData: state => state.partitionData,
            metricData: state => state.metricData,
            loadingPartitionList: state => state.loadingPartitionList,
            selectedGroup: state => state.selected,
            conditionQueue: state => state.conditionQueue,
            conditionSet: state => state.conditionSet,
            tableData: state => state.tableData,
            progress: state => state.progress,
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
        startTime(next, prev) {
            if (next.valueOf() !== prev.valueOf()) {
                this.fetchResource();
                this.onUnselectResource();
            }
        },
        endTime(next, prev) {
            if (next.valueOf() !== prev.valueOf()) {
                this.fetchResource();
                this.onUnselectResource();
            }
        },
    },
    data() {
        return {
            tableWidth: window.innerWidth - 154 - 20 * 2,
            expanded: true,
            tableHeight:
                document.documentElement.clientHeight - TOP_PADDING - 14,
            showExtraDropdown: false,
            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations([
            'updateDomainIds',
            'updateStartTime',
            'updateEndTime',
            'updateViewByDate',
            'updateShowStartTime',
            'updatePartitionData',
            'updateMetricData',
            'updateSelectedResource',
            'updateSelectedPartitions',
            'updateSelectedMetrics',
            'addSearchCondition',
            'removeSearchCondition',
            'updateTableData',
        ]),
        ...mapActions(['fetchResource', 'fetchPartitionList', 'fetchDiskData']),
        onSelectResource({ sid, instId, shortName }) {
            this.updateSelectedResource({ sid, instId, shortName });
            this.fetchPartitionList();
        },
        onUnselectResource() {
            this.updateSelectedResource({});
            this.updatePartitionData([]);
            this.updateSelectedPartitions();
        },
        queueItemFormatter({ resource, partitions, metrics }) {
            return `${capitalizeFirstLetter(this.i18n.instance)}(${
                resource.shortName
            })
                ${this.i18n.partition}(${partitions
                .map(e => e.label)
                .join(',')})
                ${this.i18n.metrics}(${metrics.map(e => e.label).join(',')})`;
        },
        onClickSearch() {
            if (this.startTime.valueOf() >= this.endTime.valueOf()) {
                this.alertMessage = this.i18n.M0377;
                return;
            }
            this.fetchDiskData();
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
        onAddCondition() {
            const item = { ...this.selectedGroup };
            if (this.conditionSet.has(getJoinedKey(item))) {
                this.alertMessage = this.i18n.M0123;
                return;
            }
            this.addSearchCondition(item);
        },
        closeExtraDropdown() {
            this.showExtraDropdown = false;
        },
        exportData() {
            if (this.tableData.length === 0) {
                this.alertMessage = this.i18n.M0004;
                return;
            }

            // Blob 인코딩 이슈: https://stackoverflow.com/questions/31959487/utf-8-encoidng-issue-when-exporting-csv-file-javascript
            const blob = new Blob(['\ufeff' + this.getCsv()], {
                type: 'text/csv;charset=utf8',
            });
            const csvUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const filename = `dbdisk_${getDayjs().format('YYYYMMDD')}.csv`;

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
                const { resource, partitions, metrics } = item;
                partitions.forEach(p => {
                    metrics.forEach(m => {
                        headerRows.push(
                            `${m.label} (${p.label} | ${resource.shortName})`
                        );
                    });
                });
            });
            csv += headerRows.join(',') + '\n';

            this.tableData
                .sort((a, b) => a[0] - b[0])
                .forEach(row => {
                    const dataRow = [];
                    row.forEach((d, i) => {
                        if (i === 0) {
                            const maxValue = this.cacheViewByDate
                                ? d + ClientUtilities.ONE_DAY
                                : d + ClientUtilities.ONE_HOUR;
                            const interval = this.cacheViewByDate
                                ? 'all'
                                : ClientUtilities.ONE_HOUR;

                            dataRow.push(
                                convertTimeText(
                                    d,
                                    maxValue,
                                    interval,
                                    this.showStartTime
                                )
                            );
                            return;
                        }
                        dataRow.push(d === -1 ? '' : d.replace(/,/g, ''));
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
        this.extraDropdownList = UTIL_LIST;
    },
    mounted() {
        this.fetchResource();
        this.updateMetricData(DEFAULT_METRIC_DATA);
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeMount() {
        window.removeEventListener('resize', this.onResizeDebounced);
        this.updateTableData();
    },
};
</script>

<style scoped></style>
