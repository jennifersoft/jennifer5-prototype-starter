<template>
    <div class="db-service-wrapper">
        <div v-show="expanded">
            <search-condition-bar />
            <div class="search-condition-wrapper expanded">
                <div class="upper">
                    <div class="resource-metric-group" style="width: 624px;">
                        <resource-selector
                            @resource-change="onChangeResource"
                            :tab="'instance'"
                            :no-border="false"
                            :selectable="true"
                            :no-all-check="true"
                            :resources="resources"
                        />
                        <list-selector
                            @check="updateServiceMetrics"
                            :list="metricData"
                            :multi-select="true"
                            :title-label="i18n.metrics"
                        />
                    </div>
                    <div class="condition-list-wrapper">
                        <div
                            class="floating-btn-wrapper"
                            :class="{ scrolling }"
                        >
                            <btn
                                class="transparent"
                                normal
                                :items="[
                                    {
                                        iconType: icons.add,
                                        text: serviceSearchBtnText,
                                    },
                                ]"
                                :loading="serviceLoading"
                                icon-first
                                @click="onOpenServiceWindow"
                            />
                        </div>
                        <search-condition-queue
                            ref="queue"
                            :formatter="queueItemFormatter"
                            :list="serviceHashes"
                            style="height: 220px;"
                            @delete-row="removeServiceName"
                            @scroll.native="onScroll"
                        />
                    </div>
                </div>
                <div class="footer">
                    <loading-btn
                        @search="onSearchTableData"
                        :disabled="searchActive"
                    />
                </div>
            </div>
        </div>
        <div class="search-result-wrapper">
            <div class="header">
                <span></span>
                <div class="btn-group" v-click-outside="closeExtraDropdown">
                    <flip-flop-btn
                        :flipped="!expanded"
                        @flip="expanded = !expanded"
                        normal
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
                        :active-index="showStartTimeOnly ? 0 : -1"
                        @update:active-index="onSelectExtraDropdown"
                        :width="274"
                        style="top: 40px; right: 0;"
                        type="icon"
                        normal
                    />
                </div>
            </div>
            <db-service-table
                ref="table"
                :table-data="tableData"
                :height="tableHeightToggled"
            />
        </div>

        <service-window
            v-if="showServiceWindow"
            :list="serviceNameData"
            :service-type="serviceType"
            @add-hash="updateServiceNames"
            @close="onCloseServiceWindow"
        />
        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        />
    </div>
</template>

<script>
import SearchConditionBar from '@entry/analysis/dbmetrics/service/container/SearchConditionBar';
import SearchConditionQueue from '@entry/analysis/dbmetrics/common/SearchConditionQueue';
import ServiceWindow from '@entry/analysis/dbmetrics/service/component/ServiceWindow';
import DbServiceTable from '@entry/analysis/dbmetrics/service/container/DbServiceTable';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import {
    METRIC_DATA_1,
    METRIC_DATA_2,
    UTIL_LIST,
    INTERVAL_MAP,
} from '@entry/analysis/dbmetrics/service/metadata';
import { Instance } from '@service/oidConfig';
import { mapState, mapRootGetters, mapMutations, mapActions } from './store';
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import LoadingBtn from '@vuejs/component/button/LoadingBtn';
import Btn from '@vuejs/component/button/Btn';
import FlipFlopBtn from '@entry/analysis/dbmetrics/common/FlipFlopBtn';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import clickOutside from '@vuejs/directive/clickOutside';
import vInstanceTooltip from '@vuejs/container/topbar/vInstanceTooltip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import _ from '@library/lodash';

const TOP_PADDING = 640;

export default {
    name: 'App',
    components: {
        SearchConditionBar,
        ServiceWindow,
        DbServiceTable,
        resourceSelector: ResourceSelector,
        listSelector: ListSelector,
        LoadingBtn,
        SearchConditionQueue,
        Btn,
        FlipFlopBtn,
        PopupList,
        AlertWindow,
    },
    directives: {
        clickOutside,
        tooltip: vInstanceTooltip,
    },
    inject: {
        i18n: {
            default: () => ({
                condition: 'Add Condition',
                search: 'Search',
                metrics: 'Metrics',
                instance: 'Instance',
                searchService: 'Text Search',
                application: 'Application',
                sql: 'SQL',
                externalCall: 'External Call',
                searchCount: 'searchCount',
                more: 'more',
            }),
        },
    },
    computed: {
        ...mapState({
            groupData: state => JSON.stringify(state.groupData), // store에는 객체로 구성되어 있음
            startTime: state => state.startTime,
            endTime: state => state.endTime,
            showStartTimeOnly: state => state.showStartTimeOnly,
            intervalType: state => state.intervalType,
            serviceType: state => state.serviceType,
            serviceHashes: state => state.serviceHashes,
            serviceHashSet: state => state.serviceHashSet,
            serviceMetrics: state => state.serviceMetrics,
            serviceNameData: state => state.serviceNameData,
            tableData: state => state.tableData,
            serviceLoading: state => state.serviceLoading,
            tableLoading: state => state.tableLoading,
            searchActive: state => {
                return (
                    Object.keys(state.groupData).length === 0 ||
                    state.serviceMetrics.length === 0 ||
                    state.serviceHashes.length === 0
                );
            },
        }),
        ...mapRootGetters(['sidList']),
        metricData() {
            if (this.serviceType === 'application') {
                return METRIC_DATA_1;
            } else {
                return METRIC_DATA_2;
            }
        },
        serviceSearchBtnText() {
            return `${this.i18n[this.serviceType]} ${this.i18n.search}`;
        },
        tooltipOptions() {
            return {
                content: this.i18n.more,
                offset: 4,
                isScrolling: false,
            };
        },
        tableHeightToggled() {
            let h = this.tableHeight;
            if (!this.expanded) h += 392;
            return h;
        },
        onResizeDebounced() {
            return _.debounce(this.onResize, 300);
        },
    },
    watch: {
        sidList: {
            handler(next) {
                this.updateTargetData(next);
            },
            immediate: true,
        },
    },
    data() {
        return {
            showServiceWindow: false,
            resources: [{ resourceType: 'instance', tree: [] }],
            scrolling: false,
            expanded: true,
            showExtraDropdown: false,
            tableHeight: window.innerHeight - TOP_PADDING,
            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations([
            'updateDomainIds',
            'updateTableData',
            'updateServiceLoading',
            'updateTableLoading',
            'updateGroupData',
            'updateServiceMetrics',
            'updateServiceNames',
            'removeServiceName',
            'updateShowStartTimeOnly',
        ]),
        ...mapActions(['fetchApplicationText', 'fetchApplicationService']),
        updateTargetData(domainIds) {
            Instance.get(domainIds, this.startTime, this.endTime).then(
                response => {
                    const n = normalizeOidConfigResponse(
                        response,
                        'instance'
                    ).map(n => ({
                        ...n,
                        check: 'off',
                    }));

                    const domainNotClickable = n.map(l => {
                        if (l.resourceType === 'domain') {
                            return {
                                ...l,
                                noInteraction: true,
                            };
                        }
                        return l;
                    });
                    this.$set(this.resources, 0, {
                        resourceType: 'instance',
                        tree: Array.from(domainNotClickable),
                    });
                }
            );

            this.updateDomainIds(domainIds);
        },
        onSearchTableData() {
            const range = this.endTime.valueOf() - this.startTime.valueOf();
            const intervalMs =
                this.intervalType === 'ALL'
                    ? range
                    : INTERVAL_MAP[this.intervalType] * 1000 * 60;

            if (range <= 0) {
                this.alertMessage = this.i18n.M0187;
                return;
            }

            if (range < intervalMs) {
                this.alertMessage = this.i18n.M0648;
                return;
            }

            this.updateTableLoading(true);
            this.fetchApplicationService();
        },
        async onOpenServiceWindow() {
            this.updateServiceLoading(true);
            await this.fetchApplicationText({});

            this.updateServiceLoading(false);
            this.showServiceWindow = true;
        },
        onCloseServiceWindow() {
            this.showServiceWindow = false;
        },
        onChangeResource(rowData) {
            this.updateGroupData(rowData.tree);
        },
        onSelectExtraDropdown(index) {
            if (index === 0) {
                this.updateShowStartTimeOnly(!this.showStartTimeOnly);
            } else this.$refs.table.exportData();
        },
        closeExtraDropdown() {
            this.showExtraDropdown = false;
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
        queueItemKeyFunc({ hash }) {
            return hash;
        },
        queueItemFormatter({ hash, text }) {
            return `${hash} ${text}`;
        },
        onScroll({ target }) {
            this.scrolling = target.scrollTop !== 0;
        },
    },
    created() {
        this.icons = {
            add: ICON_TYPE.add,
            moreHorizon: ICON_TYPE.moreHorizon,
        };
        this.extraDropdownList = UTIL_LIST;
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
        this.updateTableData();
    },
};
</script>

<style scoped></style>
