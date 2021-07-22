<template>
    <div class="db-error-wrapper">
        <div v-show="expanded">
            <navigation-bar
                :show-search-btn="false"
                :types="searchTypeList"
                :selected-type="searchType"
                @update:type="updateSearchType"
            >
                <navigation-item>
                    <format-date-input
                        :messages="messages"
                        :time="startTime"
                        @change="updateStartTime"
                    />
                    <format-date-input
                        :messages="messages"
                        :time="endTime"
                        @change="updateEndTime"
                    />
                </navigation-item>
                <navigation-item
                    v-if="!isListType"
                    :label="i18n.gatheringInterval"
                >
                    <dropdown
                        :items="gatheringIntervalList"
                        :selected-value="gatheringInterval"
                        :width="120"
                        @onchange="updateGatheringInterval"
                        style="margin-right: 24px"
                    />
                    <checkbox
                        name="showZeroCount"
                        :active="showZeroCount"
                        :label="i18n.showZeroCount"
                        @change="updateShowZeroCount"
                        style="margin-right: 24px"
                    />
                </navigation-item>
            </navigation-bar>
            <selected-domain-list @search="onClickSearch" />
        </div>
        <div class="search-result-wrapper">
            <div class="header">
                <span class="search-count-label">
                    <span class="value"
                        >{{ rowCount.toLocaleForAries() }}
                        {{ i18n.cases }}</span
                    >
                    <tooltip
                        v-if="rowCount >= 100000"
                        :message="i18n.M0647"
                        position="top-center"
                        class="alert-icon"
                    >
                        <svg-icon
                            :icon-type="icons.caution3"
                            :width="14"
                            :height="14"
                        />
                    </tooltip>
                </span>
                <div class="btn-group" v-click-outside="closeDropdown">
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
                        :active-index="onlyStartTime ? 0 : -1"
                        @update:active-index="onSelectExtraDropdown"
                        :width="274"
                        style="top: 40px; right: 0;"
                        type="icon"
                        normal
                    />
                </div>
            </div>
            <x-table
                v-if="isListType"
                class="list-table"
                ref="listTable"
                :key="0"
                :table-type="'simple headline'"
                :template-row="listTableRowTemplate"
                :columns="listTableColumns"
                :height="tableHeightToggled"
                :scroll-height="tableHeightToggled"
                :data="listTableData"
                :resize="true"
                @click="onClickTableRow"
            />
            <x-table
                v-else
                ref="countTable"
                :key="1"
                :table-type="'simple headline'"
                :template-row="countTableRowTemplate"
                :columns="countTableColumns"
                :height="tableHeightToggled"
                :scroll-height="tableHeightToggled"
                :data="countTableData"
                :resize="true"
            />
            <window
                v-if="showDetailPopup"
                class="error-detail-window"
                :open-w="610"
                :open-h="440"
                :open-x="96"
                :open-y="popupOffset"
                hide-footer
                :messages="messages"
                @cancel="closePopup"
            >
                <template #subject>
                    <span class="title">{{ selectedRow.errorType }}</span>
                </template>
                <div>
                    {{ selectedRow.time }}
                    <pre v-html="selectedRow.content" class="content"></pre>
                </div>
            </window>
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
import SelectedDomainList from '@entry/analysis/dbmetrics/error/container/SelectedDomainList';
import messages from '@vuejs/component/messages';
import Btn from '@vuejs/component/button/Btn';
import XTable from 'vue-sheets/src/components/xtable';
import { downloadCsv, i18n, openXViewPopupForEvent } from '@common/utility';
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';
import _ from '@library/lodash';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import { mapState, mapActions, mapMutations } from './store';
import clickOutside from '@vuejs/directive/clickOutside';
import vInstanceTooltip from '@vuejs/container/topbar/vInstanceTooltip';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import Window from '@vuejs/component/window/Window';
import FlipFlopBtn from '@entry/analysis/dbmetrics/common/FlipFlopBtn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import {
    listTableColumns,
    countTableColumns,
    gatheringIntervalList,
    searchTypeList,
} from '@entry/analysis/dbmetrics/error/metadata';

const listTableRowTemplate = `<tr>
                    <td><!= timeFormat !></td>
                    <td><!= nameWithDomain !></td>
                    <td><!= errorTypeName !></td>
                    <td>
                        <! if(detailMessage != null && detailMessage != "null") { !>
                        <! if(detailMessage) { !>
                            <span class="link more">
                                ${i18n.get('ui.label.moreMessage')}
                            </span>
                        <! } !>
                        <!= detailMessage !>
                        <! } !>
                    </td>
                    <td align="right">
                        <! if(value > -1) { !>
                            <!= value.toLocaleForAries() !>
                        <! } !>
                    </td>
                    <td align="center">
                        <! if(relevantTxId != "0") { !>
                            <span class="link transaction"
                                style="cursor: pointer;"
                            >
                                ${i18n.get('ui.label.show')}
                            </span>
                        <! } !>
                    </td>
                    <td><!= (serviceName == null) ? "" : serviceName !></td>
                </tr>`;

const countTableRowTemplate = `<tr>
                    <td><!= timeFormat !></td>
                    <td><!=\tnameWithDomain !> </td>
                    <td><!=\terrorTypeName !> </td>
                    <td align="right"><!= count.toLocaleForAries() !> </td>
                </tr>`;

const TOP_PADDING = 624;

export default {
    name: 'App',
    components: {
        AlertWindow,
        SelectedDomainList,
        Btn,
        Checkbox,
        Dropdown,
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        XTable,
        PopupList,
        Window,
        FlipFlopBtn,
        SvgIcon,
        Tooltip,
    },
    inject: ['i18n'],
    directives: {
        clickOutside,
        tooltip: vInstanceTooltip,
    },
    data() {
        return {
            listTableColumns,
            listTableRowTemplate,
            countTableColumns,
            countTableRowTemplate,
            tableHeight: window.innerHeight - TOP_PADDING,
            popupOffset: window.innerHeight - 440 - 24,
            showExtraDropdown: false,
            showDetailPopup: false,
            expanded: true,
            alertMessage: '',
        };
    },
    computed: {
        ...mapState({
            startTime: state => state.timeFilter.start,
            endTime: state => state.timeFilter.end,
            searchType: state => state.searchType,
            gatheringInterval: state => state.gatheringInterval,
            showZeroCount: state => state.showZeroCount,
            onlyStartTime: state => state.onlyStartTime,
            listTableData: state => state.listTableData,
            countTableData: state => state.countTableData,
            loading: state => state.loading,
            selectedRow: state => state.selectedRow,
        }),
        isListType() {
            return this.searchType === 'list';
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
        extraDropdownList() {
            const ret = [{ text: this.i18n.export, value: 'export' }];
            if (!this.isListType)
                ret.splice(0, 0, {
                    text: this.i18n.showStartTime,
                    value: 'showStartTime',
                });
            return ret;
        },
        tableHeightToggled() {
            let h = this.tableHeight;
            if (!this.expanded) h += 385;
            return h;
        },
        rowCount() {
            return this.isListType
                ? this.listTableData.length
                : this.countTableData.length;
        },
    },
    watch: {
        onlyStartTime(next, prev) {
            if (next !== prev && !this.isListType) {
                this.updateCountTableData(
                    this.countTableData.map(e => ({
                        ...e,
                        timeFormat: convertTimeText(
                            e.time,
                            this.endTime,
                            this.gatheringInterval,
                            next
                        ),
                    }))
                );
            }
        },
        searchType(next, prev) {
            if (next !== prev) {
                this.updateListTableData();
                this.updateCountTableData();
            }
        },
    },
    methods: {
        ...mapMutations([
            'updateStartTime',
            'updateEndTime',
            'updateSearchType',
            'updateGatheringInterval',
            'updateShowZeroCount',
            'updateOnlyStartTime',
            'updateLoading',
            'updateListTableData',
            'updateCountTableData',
            'updateSelectedRow',
        ]),
        ...mapActions(['fetchListData', 'fetchCountData']),
        onClickSearch() {
            const range = this.endTime.valueOf() - this.startTime.valueOf();
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
            if (this.searchType === 'list') this.fetchListData({});
            else this.fetchCountData({});
        },
        onClickTableRow(row, e) {
            const { className } = e.target;

            if (className === 'link more') {
                this.updateSelectedRow(row.data);
                this.showDetailPopup = true;
            } else if (className === 'link transaction') {
                const { sid, time, relevantTxId } = row.data;
                openXViewPopupForEvent(sid, time, relevantTxId);
            }
        },
        onSelectExtraDropdown(index) {
            if (!this.isListType && index === 0) {
                this.updateOnlyStartTime(!this.onlyStartTime);
            } else this.onClickExportBtn();
        },
        onClickExportBtn() {
            if (this.searchType === 'list') {
                const fields = this.listTableColumns
                        .filter(c => c.key !== 'relevantTxId')
                        .map(c => c.key),
                    names = this.listTableColumns
                        .filter(c => c.key !== 'relevantTxId')
                        .map(c => c.name),
                    rows = this.$refs.listTable.sheet
                        .list()
                        .map(e => e.data)
                        .map(d => ({
                            ...d,
                            relevantTxId: undefined,
                            value: d.value === -1 ? '' : d.value,
                            detailMessage:
                                d.detailMessage !== null &&
                                d.detailMessage !== 'null'
                                    ? d.detailMessage.replace(/\"/g, '""')
                                    : '',
                        }));

                downloadCsv('dberror_list', {
                    fields,
                    names,
                    rows,
                });
            } else if (this.searchType === 'count') {
                const fields = this.countTableColumns.map(c => c.key);
                const names = this.countTableColumns.map(c => c.name);
                const rows = this.$refs.countTable.sheet
                    .list()
                    .map(e => e.data);

                downloadCsv('dberror_count', {
                    fields,
                    names,
                    rows,
                });
            }
        },
        closeDropdown() {
            if (this.showExtraDropdown) this.showExtraDropdown = false;
        },
        closePopup() {
            if (this.showDetailPopup) {
                this.showDetailPopup = false;
                this.updateSelectedRow();
            }
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
            this.popupOffset = window.innerHeight - 440 - 24;
        },
    },
    created() {
        this.messages = messages;
        this.gatheringIntervalList = gatheringIntervalList;
        this.searchTypeList = searchTypeList;
        this.icons = {
            moreHorizon: ICON_TYPE.moreHorizon,
            caution3: ICON_TYPE.caution3,
        };
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
        this.updateListTableData();
        this.updateCountTableData();
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/analysis/dbmetrics/event/styles/table-style.scss';
.db-error-wrapper {
    .aries-ui-navigation-bar {
        margin-bottom: 8px;
    }
    .table-header {
        display: flex;
        align-items: center;
        margin: 8px 0;
        font-size: 14px;
    }
    ::v-deep .list-table {
        @include table-style;
    }
    .error-detail-window {
        .title,
        .content {
            overflow: auto;
        }
    }
}
</style>
