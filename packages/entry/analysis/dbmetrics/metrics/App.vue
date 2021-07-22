<template>
    <div class="db-metrics-wrapper">
        <div v-show="expanded">
            <navigation-bar
                :types="searchTypeList"
                :selected-type="searchType"
                :type-dropdown-width="184"
                :show-search-btn="false"
                @update:type="onChangeType"
            >
                <navigation-item>
                    <format-date-input
                        :time="timeFilter.start"
                        :messages="messages"
                        :hide-time="showOperatingTime"
                        @change="updateStartTime"
                    >
                    </format-date-input>
                    <format-date-input
                        :time="timeFilter.end"
                        :messages="messages"
                        :hide-time="showOperatingTime"
                        @change="updateEndTime"
                    >
                    </format-date-input>
                    <div
                        v-if="showOperatingTime"
                        style="padding-left: 8px; display: flex; align-content: center;"
                    >
                        <format-number-input
                            class="labeled-input"
                            :value="operatingTime.from"
                            :label="i18n.operatingTime"
                            :max="24"
                            @input="updateOperatingTimeFrom"
                            use-stepper
                            small
                        >
                        </format-number-input>
                        <format-number-input
                            :value="operatingTime.to"
                            :width="64"
                            :max="24"
                            @input="updateOperatingTimeTo"
                            use-stepper
                            small
                        >
                        </format-number-input>
                    </div>
                </navigation-item>
                <navigation-item :label="i18n.gatheringInterval">
                    <dropdown
                        :items="gatheringIntervalData"
                        :width="118"
                        :selected-value="gatheringInterval"
                        @onchange="item => updateGatheringInterval(item.value)"
                    ></dropdown>
                </navigation-item>
                <navigation-item v-click-outside="closePopup">
                    <btn
                        ref="exclude-filter-btn"
                        :items="[{ text: i18n.excludeDates }]"
                        @click="showExcludeDatePopup = !showExcludeDatePopup"
                    >
                    </btn>
                    <exclude-filter-window
                        v-show="showExcludeDatePopup"
                        :open-x="excludePopupPosition.x"
                        :open-y="excludePopupPosition.y"
                        @apply="showExcludeDatePopup = false"
                        @cancel="showExcludeDatePopup = false"
                    >
                    </exclude-filter-window>
                </navigation-item>
            </navigation-bar>
            <div class="search-condition-wrapper">
                <div class="upper">
                    <div class="resource-metric-group" style="width: 684px;">
                        <resource-selector
                            ref="r"
                            @resource-change="onResourceChange"
                            @tab-change="onTabChange"
                            :tab="otype"
                            :no-border="false"
                            :resources="resourceNormalized"
                        >
                        </resource-selector>
                        <list-selector
                            :list="metricsData"
                            @list-select="onSelectMetric"
                        >
                        </list-selector>
                        <btn
                            :items="[{ iconType: icons.arrowRight }]"
                            :disabled="!isSelectionValid"
                            @click="onClickAddRow"
                        >
                        </btn>
                    </div>
                    <div class="condition-list-wrapper">
                        <search-condition-queue
                            ref="queue"
                            style="height: 220px;"
                            :formatter="queueItemFormatter"
                            :list="searchConditionQueue"
                            @delete-row="removeCondition"
                        />
                        <div class="footer" :class="{ overflow }">
                            <loading-btn
                                :progress="progress"
                                :suspendible="false"
                                :disabled="searchConditionQueue.length === 0"
                                @search="onClickSearch"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search-result-wrapper">
            <div class="header">
                <div class="btn-group" v-click-outside="closeDropdown">
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
                        :items="[
                            {
                                text: i18n.showStartTime,
                                value: 'showStartTime',
                            },
                            { text: i18n.export, value: 'export' },
                        ]"
                        :active-index="showStartTime ? 0 : -1"
                        @update:active-index="onSelectExtraDropdown"
                        :width="274"
                        style="top: 40px; right: 0;"
                        type="icon"
                        normal
                    />
                </div>
            </div>
            <db-metrics-table
                ref="table"
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
import AlertWindow from '@vuejs/component/window/AlertWindow';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import ExcludeFilterWindow from '@entry/analysis/dbmetrics/metrics/container/ExcludeFilterWindow';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Btn from '@vuejs/component/button/Btn';
import ResourceSelector, {
    capitalizeFirstLetter,
} from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import SearchConditionQueue from '@entry/analysis/dbmetrics/common/SearchConditionQueue';
import DbMetricsTable from '@entry/analysis/dbmetrics/metrics/container/DbMetricsTable';
import clickOutside from '@vuejs/directive/clickOutside';
import vInstanceTooltip from '@vuejs/container/topbar/vInstanceTooltip';
import FlipFlopBtn from '@entry/analysis/dbmetrics/common/FlipFlopBtn';
import {
    mapActions,
    mapGetters,
    mapMutations,
    mapState,
    mapRootGetters,
} from '@entry/analysis/dbmetrics/metrics/store';
import { startOfDayjs } from '@common/dayjsWrapper';
import messages from '@vuejs/component/messages';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import LoadingBtn from '@vuejs/component/button/LoadingBtn';
import { getJoinedKey } from '@entry/analysis/dbmetrics/metrics/store/mutations';
import { convertTimeText, exportCsv } from '@entry/analysis/dbmetrics/dbsearch';
import {
    gatheringIntervalList,
    searchTypes,
} from '@entry/analysis/dbmetrics/metrics/metadata';

export default {
    name: 'App',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                excludeDates: 'excludeDates',
                weekend: 'time.weekend',
                duringTerm: 'time.duringTerm',
                saturday: 'time.saturday',
                sunday: 'time.sunday',
                apply: 'apply',
                cancel: 'cancel',
                delete: 'delete',
                gatheringInterval: 'gatheringInterval',
                showStartTime: 'showStartTime',
                operatingTime: 'operatingTime',
                addCondition: 'addCondition',
                search: 'search',
                export: 'export',
                searchResult: 'searchResult',
                more: 'more',
                time: 'time',
                M0015: 'M0015',
                M0014: 'M0014',
                M0123: 'M0123',
                M0187: 'M0187',
                M0519: 'M0519',
                M0648: 'M0648',
                M0650: 'M0650',
            }),
        },
    },
    components: {
        AlertWindow,
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        FormatNumberInput,
        Dropdown,
        PopupList,
        ExcludeFilterWindow,
        Checkbox,
        Btn,
        ResourceSelector,
        ListSelector,
        SearchConditionQueue,
        DbMetricsTable,
        LoadingBtn,
        FlipFlopBtn,
    },
    directives: {
        clickOutside,
        tooltip: vInstanceTooltip,
    },
    computed: {
        ...mapState({
            timeFilter: ({ filters }) => filters.time,
            operatingTime: ({ filters }) => filters.operatingTime,
            gatheringInterval: ({ filters }) => filters.gatheringInterval,
            otype: ({ filters }) => filters.otype,
            oidList: ({ filters }) => filters.oidList,
            metric: ({ filters }) => filters.metric,
            searchConditionQueue: state => state.searchConditionQueue,
            conditionSet: state => state.conditionSet,
            metricsData: state => state.metricsData,
            showStartTime: ({ filters }) => filters.showStartTime,
            gatheringIntervalData: state => state.gatheringIntervalData,
            tableData: ({ tableData }) => tableData.content,
            tableColumn: ({ tableData }) => tableData.column,
            progress: state => state.progress,
        }),
        ...mapGetters([
            'resourceNormalized',
            'resourceNameMap',
            'isSelectionValid',
        ]),
        ...mapRootGetters(['sidList']),
        tableHeightComputed() {
            let h = this.tableHeight;
            if (!this.expanded) h += 343;
            return h;
        },
        searchType() {
            return this.showOperatingTime ? 'operatingTime' : 'period';
        },
    },
    watch: {
        showExcludeDatePopup(next, prev) {
            if (next !== prev) {
                this.updatePopupPosition();
            }
        },
        showOperatingTime(next) {
            if (next) {
                const { start, end } = this.timeFilter;
                this.updateStartTime(startOfDayjs(start, 'date'));
                this.updateEndTime(startOfDayjs(end, 'date'));
            } else {
                this.updateOperatingTimeFrom(0);
                this.updateOperatingTimeTo(24);
            }
        },
        searchConditionQueue(next, prev) {
            if (next.length !== prev.length && !!this.$refs.queue) {
                this.$nextTick(() => {
                    const { clientHeight, scrollHeight } = this.$refs.queue.$el;
                    this.overflow = scrollHeight > clientHeight;
                });
            }
        },
        sidList() {
            this.fetchResource();
        },
    },
    data() {
        return {
            showExcludeDatePopup: false,
            showExtraDropdown: false,
            showOperatingTime: false,
            excludePopupPosition: { x: 0, y: 0 },
            overflow: false,
            tableWidth: window.innerWidth - 154 - 20 * 2,
            expanded: true,
            tableHeight: document.documentElement.clientHeight - 540 - 14,
            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations([
            'updateStartTime',
            'updateEndTime',
            'updateOperatingTimeFrom',
            'updateOperatingTimeTo',
            'updateGatheringInterval',
            'updateOtype',
            'updateOidList',
            'updateMetric',
            'pushCondition',
            'removeCondition',
            'updateResourceData',
            'updateMetricsData',
            'updateShowStartTime',
            'updateOperatingTime',
            'updateGatheringIntervalData',
            'updateTableData',
        ]),
        ...mapActions(['fetchResource', 'findMetricsGroup', 'loadMetricsData']),
        onChangeType({ value }) {
            this.showOperatingTime = value === 'operatingTime';
        },
        onTabChange(tab) {
            this.updateOtype(tab);
            this.updateOidList({ grouped: {}, length: 0, names: [] });
            this.findMetricsGroup(tab);
        },
        onResourceChange({ resourceType, tree }) {
            let grouped = {};
            const checked = tree.filter(t => {
                if (this.otype === 'domain') {
                    return t.check === 'on';
                }
                return t.data.oid !== -1 && t.check === 'on';
            });

            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);
            sids.forEach(s => {
                grouped[s] = [];
            });

            checked.forEach(c => {
                grouped[c.data.sid] = [];
            });
            checked.forEach(c => {
                let id = c.data.oid;
                if (this.otype === 'domain') {
                    id = 0;
                }
                if (grouped.hasOwnProperty(c.data.sid)) {
                    grouped[c.data.sid].push(id);
                } else {
                    grouped[c.data.sid] = [id];
                }
            });

            this.updateOidList({
                grouped,
                length: checked.length,
                names: checked.map(c => c.label),
            });
            this.updateOtype(resourceType);
        },
        onSelectMetric(m) {
            this.updateMetric(m);
        },
        onClickAddRow() {
            const { otype, oidList, metric } = this;

            const item = {
                resourceType: otype,
                resources: oidList,
                metric,
            };

            // duplicate check
            if (this.conditionSet.has(getJoinedKey(item))) {
                this.alertMessage = this.i18n.M0123;
                return;
            }

            this.pushCondition({
                ...item,
                nameMap: this.resourceNameMap,
                key: Date.now(),
            });
        },
        onClickSearch() {
            const { start, end } = this.timeFilter;
            const { from, to } = this.operatingTime;
            const cycle = this.gatheringInterval * 60 * 1000;
            const range = end.valueOf() - start.valueOf();

            if (range < cycle) {
                this.alertMessage = this.i18n.M0648;
                return;
            }

            if (range <= 0) {
                this.alertMessage = this.i18n.M0187;
                return;
            }

            if (cycle !== 0 && range / cycle > 50000) {
                this.alertMessage = this.i18n.M0519;
                return;
            }

            if (from >= to) {
                this.alertMessage = this.i18n.M0650;
                return;
            }

            this.loadMetricsData({});
        },
        onSelectExtraDropdown(index) {
            if (index === 0) {
                this.updateShowStartTime(!this.showStartTime);
            } else this.onClickExport();
        },
        updatePopupPosition() {
            if (!!this.$refs['exclude-filter-btn']) {
                const { left, bottom, width } = this.$refs[
                    'exclude-filter-btn'
                ].$el.getBoundingClientRect();
                this.$set(this.excludePopupPosition, 'x', left + width / 2);
                this.$set(this.excludePopupPosition, 'y', bottom + 8);
            }
        },
        closePopup() {
            if (this.showExcludeDatePopup) this.showExcludeDatePopup = false;
        },
        closeDropdown() {
            if (this.showExtraDropdown) this.showExtraDropdown = false;
        },
        onResize() {
            const navbarWidth = 154;
            const padding = 20;
            const scrollWidth = 14;
            this.tableWidth = window.innerWidth - navbarWidth - 2 * padding;
            this.tableHeight =
                document.documentElement.clientHeight - 540 - scrollWidth;
        },
        queueItemFormatter({ resources, metric, resourceType }) {
            const { names } = resources;
            return `${metric.label} ${capitalizeFirstLetter(
                resourceType
            )}(${names.join(',')})`;
        },
        onClickExport() {
            let csv = [],
                columns = [];
            const {
                tableData,
                tableColumn,
                timeFilter,
                gatheringInterval,
                showStartTime,
            } = this;

            for (let i = 0; i < tableColumn.length; i++) {
                const name = tableColumn[i];
                columns.push(name === 'time' ? this.i18n.time : name);
            }
            csv += columns.join(',') + '\n';

            for (let i = 0; i < tableData.length; i++) {
                const rows = [];

                for (let j = 0; j < tableData[i].length; j++) {
                    const value = tableData[i][j];

                    if (j === 0) {
                        rows.push(
                            convertTimeText(
                                value,
                                timeFilter.end.valueOf(),
                                gatheringInterval,
                                showStartTime
                            )
                        );
                    } else {
                        rows.push(value.toShortForAries());
                    }
                }
                csv += rows.join(',') + '\n';
            }

            exportCsv(csv);
        },
    },
    created() {
        this.messages = messages;
        this.icons = {
            arrowRight: ICON_TYPE.arrowRight,
            moreHorizon: ICON_TYPE.moreHorizon,
        };
        this.tooltipOptions = {
            content: this.i18n.more,
            offset: 4,
            isScrolling: false,
        };
    },
    beforeMount() {
        this.searchTypeList = searchTypes;
        this.updateGatheringIntervalData(gatheringIntervalList);
    },
    async mounted() {
        window.addEventListener('resize', this.onResize);
        await this.fetchResource();
        await this.findMetricsGroup(this.otype);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        this.updateTableData();
    },
};
</script>

<style lang="scss" scoped>
.aries-ui-navigation-bar {
    ::v-deep .labeled-input {
        .input-label {
            width: max-content;
        }
        .input-field-inline {
            width: 54px;
        }
    }
}
</style>
