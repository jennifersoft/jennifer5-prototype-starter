<template>
    <div class="app" :class="{ 'close-filter': closeFilter }">
        <div class="header-n-content">
            <common-header
                :subject="subject"
                :description="description"
            ></common-header>
            <div class="interaction">
                <search-condition-bar />
                <top-bar
                    v-show="searchedIdNameList.length > 0"
                    :use-multi-instance="true"
                    :use-realtime="false"
                    :searched-id-name-list="searchedIdNameList"
                    :selected-id-list="filterIdsOnTopbar"
                    :top-on-content="false"
                    @select="toggleFilterIdOnTopbar"
                    @clear="clearFilterIdsOnTopbar"
                />
                <tab-n-view-selector @export-table="exportTable" />
            </div>
            <div class="content">
                <group-chart-wrapper
                    v-if="currentView === 'application-n-chart'"
                ></group-chart-wrapper>

                <canvas-wrapper v-if="currentView !== 'table'" />
                <table-wrapper-in-transaction
                    ref="tableInTransaction"
                    :key="tableKey"
                    v-else-if="
                        currentView === 'table' && currentTab === 'transaction'
                    "
                />
                <table-wrapper-in-application
                    ref="tableInApplication"
                    :key="tableKey"
                    v-else-if="
                        currentView === 'table' && currentTab === 'application'
                    "
                />
                <table-wrapper-in-user-id
                    ref="tableInUserId"
                    :key="tableKey"
                    v-else-if="
                        currentView === 'table' && currentTab === 'userId'
                    "
                />
                <table-wrapper-in-client-ip
                    ref="tableInClientIp"
                    :key="tableKey"
                    v-else-if="
                        currentView === 'table' && currentTab === 'clientIp'
                    "
                />
            </div>
        </div>

        <filter-condition-on-n-off />
        <advanced-search-condition-window
            v-if="closeAdvancedSearchCondition === false"
        />
        <limit-count-window v-if="closeLimitCountWindow === false" />
    </div>
</template>

<script>
import CommonHeader from '@layout/container/header/CommonHeader';
import SearchConditionBar from '@entry/analysis/xview/container/SearchConditionBar';
import FilterConditionOnNOff from '@entry/analysis/xview/container/FilterConditionOnNOff';

import TabNViewSelector from '@entry/analysis/xview/container/TabNViewSelector';
import TopBar from '@vuejs/container/topbar/TopBar';
import { mapActions, mapGetters, mapState } from 'vuex';
import CanvasWrapper from '@entry/analysis/xview/container/CanvasWrapper';
import TableWrapperInTransaction from '@entry/analysis/xview/container/table/TableWrapperInTransaction';
import TableWrapperInApplication from '@entry/analysis/xview/container/table/TableWrapperInApplication';
import TableWrapperInUserId from '@entry/analysis/xview/container/table/TableWrapperInUserId';
import TableWrapperInClientIp from '@entry/analysis/xview/container/table/TableWrapperInClientIp';
import GroupChart from '@entry/popup/xviewAnalysis/component/GroupChart';
import GroupChartWrapper from '@entry/analysis/xview/container/GroupChartWrapper';
import AdvancedSearchConditionWindow from '@entry/analysis/xview/container/window/AdvancedSearchConditionWindow';
import LimitCountWindow from '@entry/analysis/xview/container/window/LimitCountWindow';
import $ from '@library/jquery';
import { getDayjs, serverDateFormat } from '@common/base';
import { downloadCsv } from '@common/utility';

export default {
    inject: ['i18n'],
    components: {
        AdvancedSearchConditionWindow,
        LimitCountWindow,
        GroupChartWrapper,
        GroupChart,
        TableWrapperInTransaction,
        TableWrapperInApplication,
        TableWrapperInUserId,
        TableWrapperInClientIp,
        CanvasWrapper,
        CommonHeader,
        TopBar,

        FilterConditionOnNOff,
        SearchConditionBar,
        TabNViewSelector,
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
    },
    data() {
        return {};
    },
    methods: {
        ...mapActions('xviewAnalysis', [
            'toggleFilterIdOnTopbar',
            'clearFilterIdsOnTopbar',
        ]),

        exportTable() {
            let table;
            if (this.currentTab === 'transaction') {
                table = this.$refs.tableInTransaction.table;
            } else if (this.currentTab === 'application') {
                table = this.$refs.tableInApplication.table;
            } else if (this.currentTab === 'userId') {
                table = this.$refs.tableInUserId.table;
            } else if (this.currentTab === 'clientIp') {
                table = this.$refs.tableInClientIp.table;
            }

            var cols = table.listColumn(),
                rows = table.listData(),
                fields = [],
                names = [],
                newData = [];

            for (var i = 0; i < cols.length; i++) {
                if (cols[i].type === 'show') {
                    fields.push(cols[i].name);
                    names.push(cols[i].element.innerText);
                }
            }

            for (var i = 0; i < rows.length; i++) {
                const agentStartTime =
                    rows[i].agentEndTime - rows[i].elapsedTime;

                const source = {
                    collectionTime: getDayjs(rows[i].collectTime).format(
                        serverDateFormat.longWithSec
                    ),
                    startDate: getDayjs(agentStartTime).format(
                        serverDateFormat.short
                    ),
                    startTime: getDayjs(agentStartTime).format('HH:mm:ss SSS'),
                    endDate: getDayjs(rows[i].agentEndTime).format(
                        serverDateFormat.short
                    ),
                    endTime: getDayjs(rows[i].agentEndTime).format(
                        'HH:mm:ss SSS'
                    ),
                };
                if (this.currentTab === 'transaction')
                    source.bizName = rows[i].bizName.join(' ');

                const d = Object.assign(rows[i], source);

                newData.push(d);
            }

            downloadCsv('xviewData-' + this.currentTab, {
                fields: fields,
                names: names,
                rows: newData,
            });
        },
    },
    computed: {
        // openFilter
        ...mapState('xviewAnalysis', {
            closeFilter: state => state.closeFilter,
            closeAdvancedSearchCondition: state =>
                state.closeAdvancedSearchCondition,
            closeShareUrlWindow: state => state.closeShareUrlWindow,
            closeLimitCountWindow: state => state.closeLimitCountWindow,
            currentView: state => state.currentView,
            currentTab: state => state.currentTab,
            filterIdsOnTopbar: state => state.filterIdsOnTopbar,
            tableKey: state => state.tableKey,
        }),
        ...mapGetters('xviewAnalysis', ['searchedIdNameList']),
    },
};
</script>
<style lang="scss">
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
        background-color: #ffffff,
        filter-condition-shadow: rgba(0, 0, 0, 0.08),
    ),
    dark: (
        border-color: #4e4e4e,
        background-color: #1c1c1c,
        filter-condition-shadow: rgba(0, 0, 0, 0.5),
    ),
);

.app {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;

    .header-n-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        box-sizing: border-box;
        height: 100%;
        padding: 0;

        > .interaction {
            padding: 24px 24px 0;
            .topbar {
                margin-top: 8px;
            }
            .tab-n-view-selector {
                margin-top: 16px;
            }
        }

        > .content {
            flex-grow: 1;
            min-height: 0;
            display: flex;
            flex-direction: row;
            margin-top: 16px;
            padding: 0 24px 24px;

            @include themify($themes) {
                .group-chart-wrapper {
                    width: 300px;
                    border: solid 1px themed('border-color');
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;

                    & + .canvas-wrapper {
                        border-left: none;
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                }

                .canvas-wrapper {
                    flex-grow: 1;
                    border: solid 1px themed('border-color');
                }

                .table-wrapper {
                    flex-grow: 1;
                }
            }
        }
    }
    &.close-filter {
        .filter-condition-on-n-off {
            display: none;
        }
    }
    @media (max-width: 1540px) {
        .filter-condition-on-n-off {
            position: absolute;
            right: 0;
            z-index: 100;
            @include themify($themes) {
                background-color: themed('background-color');
                box-shadow: -3px 0 5px 0 themed('filter-condition-shadow');
                border-left: none;
            }
        }
    }
}
</style>
