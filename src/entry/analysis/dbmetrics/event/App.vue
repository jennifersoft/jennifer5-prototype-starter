<template>
    <div class="db-event-wrapper">
        <div v-show="expanded">
            <navigation-bar
                :types="searchTypeList"
                :selected-type="searchType"
                :show-search-btn="false"
                @update:type="onChangeSearchType"
            >
                <navigation-item>
                    <format-date-input
                        :time="timeFilter.start"
                        :messages="messages"
                        @change="updateStartTime"
                    >
                    </format-date-input>
                    <format-date-input
                        :time="timeFilter.end"
                        :messages="messages"
                        @change="updateEndTime"
                    >
                    </format-date-input>
                </navigation-item>
                <navigation-item
                    v-if="searchType === 'count'"
                    :label="i18n.gatheringInterval"
                >
                    <dropdown
                        :items="gatheringIntervalList"
                        :width="116"
                        :selected-value="gatheringInterval"
                        @onchange="updateGatheringInterval"
                    >
                    </dropdown>
                    <checkbox
                        style="margin-left: 16px;"
                        :active="checkZeroCount"
                        :label="i18n.showZeroCount"
                        @change="updateCheckZeroCount"
                    ></checkbox>
                </navigation-item>
            </navigation-bar>
            <div class="search-condition-wrapper expanded">
                <div class="upper">
                    <div class="resource-metric-group">
                        <resource-selector
                            style="width: 280px;"
                            :no-border="false"
                            :tab="resourceType"
                            :resources="resourceNormalized"
                            @resource-change="onResourceChange"
                            @tab-change="onTabChange"
                        >
                        </resource-selector>
                        <list-selector
                            style="width: 280px;"
                            :list="eventTypeData"
                            :title-label="i18n.eventType"
                            @check="updateEventTypes"
                            multi-select
                        >
                        </list-selector>
                        <list-selector
                            style="width: 200px;"
                            :list="eventLevelData"
                            :title-label="i18n.eventLevel"
                            @check="updateEventLevels"
                            no-search
                            multi-select
                        >
                        </list-selector>
                    </div>
                </div>
                <div class="footer">
                    <loading-btn
                        :progress="progress"
                        :disabled="!isSelectionValid"
                        @search="onClickSearch"
                        @stop-search="onClickStopSearch"
                    />
                </div>
            </div>
        </div>
        <div class="search-result-wrapper">
            <div class="header">
                <span class="search-count-label">
                    {{ tableData.length.toLocaleForAries() }} {{ i18n.cases }}
                </span>
                <div class="btn-group" v-click-outside="closeDropdown">
                    <flip-flop-btn
                        normal
                        :flipped="!expanded"
                        @flip="expanded = !expanded"
                    />
                    <btn
                        v-tooltip="tooltipOptions"
                        :items="[{ iconType: icons.moreHorizon }]"
                        :pressed="showExtraDropdown"
                        class="transparent"
                        normal
                        @click="showExtraDropdown = !showExtraDropdown"
                    >
                    </btn>
                    <popup-list
                        v-if="showExtraDropdown"
                        :items="extraDropdownItems"
                        :active-index="
                            searchType === 'count' && showStartTime ? 0 : -1
                        "
                        @update:active-index="onSelectExtraDropdown"
                        :width="274"
                        style="top: 40px; right: 0;"
                        type="icon"
                        normal
                    />
                </div>
            </div>
            <db-event-list-table
                v-if="searchType === 'list'"
                :list="tableData"
                :height="tableHeightComputed"
                :popup-offset="popupOffset"
            >
            </db-event-list-table>
            <db-event-count-table
                v-else
                :list="tableData"
                :height="tableHeightComputed"
            >
            </db-event-count-table>
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
import vInstanceTooltip from '@vuejs/container/topbar/vInstanceTooltip';
import clickOutside from '@vuejs/directive/clickOutside';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Btn from '@vuejs/component/button/Btn';
import LoadingBtn from '@vuejs/component/button/LoadingBtn';
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import DbEventListTable from '@entry/analysis/dbmetrics/event/component/DbEventListTable';
import DbEventCountTable from '@entry/analysis/dbmetrics/event/component/DbEventCountTable';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import {
    mapActions,
    mapGetters,
    mapMutations,
    mapState,
    mapRootGetters,
} from '@entry/analysis/dbmetrics/event/store';
import { startOfDayjs } from '@common/dayjsWrapper';
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';
import messages from '@vuejs/component/messages';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import FlipFlopBtn from '@entry/analysis/dbmetrics/common/FlipFlopBtn';
import {
    exportCountData,
    exportListData,
} from '@entry/analysis/dbmetrics/event/utility';
import {
    searchTypes,
    gatheringIntervals,
} from '@entry/analysis/dbmetrics/event/metadata';

const TOP_PADDING = 638;

export default {
    name: 'App',
    directives: {
        tooltip: vInstanceTooltip,
        clickOutside,
    },
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                time: 'time',
                domain: 'domain',
                target: 'target',
                eventType: 'eventType',
                eventLevel: 'eventLevel',
                count: 'count',
                message: 'message',
                value: 'value',
                transaction: 'transaction',
                application: 'application',
                gatheringInterval: 'gatheringInterval',
                showStartTime: 'showStartTime',
                showZeroCount: 'showZeroCount',
                search: 'search',
                searching: 'Searching...',
                stopSearch: 'Stop searching',
                searchCount: 'searchCount',
                export: 'export',
                searchResult: 'searchResult',

                M0015: 'M0015',
                M0014: 'M0014',
                M0123: 'M0123',
                cases: 'cases',
            }),
        },
    },
    components: {
        AlertWindow,
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        Dropdown,
        Btn,
        ResourceSelector,
        ListSelector,
        PopupList,
        DbEventListTable,
        DbEventCountTable,
        Checkbox,
        LoadingBtn,
        FlipFlopBtn,
    },
    computed: {
        ...mapState({
            searchType: ({ filters }) => filters.searchType,
            timeFilter: ({ filters }) => filters.time,
            resourceType: ({ filters }) => filters.resourceType,
            resources: ({ filters }) => filters.resources,
            eventTypes: ({ filters }) => filters.eventTypes,
            eventLevels: ({ filters }) => filters.eventLevels,
            gatheringInterval: ({ filters }) => filters.gatheringInterval,
            showStartTime: ({ filters }) => filters.showStartTime,
            checkZeroCount: ({ filters }) => filters.checkZeroCount,
            eventTypeData: state => state.eventTypeData,
            eventLevelData: state => state.eventLevelData,
            progress: state => state.progress,
            tableData: state => state.tableData,
        }),
        ...mapGetters(['resourceNormalized', 'isSelectionValid']),
        ...mapRootGetters(['sidList']),
        extraDropdownItems() {
            const ret = [];
            if (this.searchType === 'count')
                ret.push({
                    text: this.i18n.showStartTime,
                    value: 'showStartTime',
                });
            ret.push({ text: this.i18n.export, value: 'export' });
            return ret;
        },
        tableHeightComputed() {
            let h = this.tableHeight;
            if (!this.expanded) h += 390;
            return h;
        },
    },
    watch: {
        timeFilter(next, prev) {
            // update resource if date changed
            if (
                startOfDayjs(next.start, 'date').valueOf() !==
                    startOfDayjs(prev.start, 'date').valueOf() ||
                startOfDayjs(next.end, 'date').valueOf() !==
                    startOfDayjs(prev.end, 'date').valueOf()
            ) {
                this.fetchResource();
                this.resetEventConfig();
            }
        },
        showStartTime(next, prev) {
            if (next !== prev) {
                this.updateTableData(
                    this.tableData.map(e => ({
                        ...e,
                        timeConverted: convertTimeText(
                            e.time,
                            this.timeFilter.end.valueOf(),
                            this.gatheringInterval,
                            next
                        ),
                    }))
                );
            }
        },
        resourceType(next, prev) {
            if (next !== prev) {
                this.resetEventConfig();
            }
        },
        sidList() {
            this.fetchResource();
        },
    },
    data() {
        return {
            showExtraDropdown: false,
            expanded: true,
            alertMessage: '',
            tableHeight: window.innerHeight - TOP_PADDING,
            popupOffset: window.innerHeight - 440 - 24,
        };
    },
    methods: {
        ...mapMutations([
            'updateSearchType',
            'updateStartTime',
            'updateEndTime',
            'updateGatheringInterval',
            'updateResources',
            'updateResourceType',
            'updateEventTypes',
            'updateEventLevels',
            'updateShowStartTime',
            'updateCheckZeroCount',
            'updateTableData',
            'updateLoading',
        ]),
        ...mapActions([
            'fetchResource',
            'loadEventTypes',
            'loadEventLevels',
            'fetchListData',
            'fetchCountData',
        ]),
        onChangeSearchType(type) {
            this.updateSearchType(type);
            this.updateTableData([]);
        },
        onTabChange(tab) {
            this.updateResourceType(tab);
        },
        onResourceChange({ resourceType, tree }) {
            let grouped = {};

            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);
            sids.forEach(s => {
                grouped[s] = [];
            });

            const checked = tree.filter(t => {
                if (this.currentTab === 'domain') {
                    return t.check === 'on';
                }
                return t.data.oid !== -1 && t.check === 'on';
            });

            checked.forEach(c => {
                grouped[c.data.sid] = [];
            });
            checked.forEach(c => {
                let id = c.data.oid;
                if (this.currentTab === 'domain') {
                    id = 0;
                }
                if (grouped.hasOwnProperty(c.data.sid)) {
                    grouped[c.data.sid].push(id);
                } else {
                    grouped[c.data.sid] = [id];
                }
            });

            this.updateResources({
                grouped,
            });
            this.updateResourceType(resourceType);
        },
        onClickSearch() {
            const { start, end } = this.timeFilter;
            const range = end.valueOf() - start.valueOf();
            const intervalMs = this.gatheringInterval * 60 * 1000;

            if (range <= 0) {
                this.alertMessage = this.i18n.M0187;
                return;
            }

            if (this.searchType === 'count' && range < intervalMs) {
                this.alertMessage = this.i18n.M0648;
                return;
            }

            this.updateLoading(true);
            if (this.searchType === 'list') {
                this.fetchListData({});
            } else {
                this.fetchCountData({});
            }
        },
        onClickStopSearch() {
            this.updateLoading(false);
        },
        onSelectExtraDropdown(index) {
            if (this.searchType === 'count' && index === 0) {
                this.updateShowStartTime(!this.showStartTime);
            } else this.onClickExport();
        },
        closeDropdown() {
            if (this.showExtraDropdown) this.showExtraDropdown = false;
        },
        resetEventConfig() {
            this.loadEventTypes();
            this.loadEventLevels();
            this.updateEventTypes([]);
            this.updateEventLevels([]);
        },
        onClickExport() {
            if (this.searchType === 'list') exportListData(this.tableData);
            else exportCountData(this.tableData);
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
            this.popupOffset = window.innerHeight - 440 - 24;
        },
    },
    created() {
        this.messages = messages;
        this.icons = {
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
        this.gatheringIntervalList = gatheringIntervals;
        this.loadEventTypes();
        this.loadEventLevels();
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
        this.fetchResource();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        this.updateTableData();
    },
};
</script>

<style scoped></style>
