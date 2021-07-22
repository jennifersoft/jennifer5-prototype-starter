<template>
    <div class="table-panel">
        <div class="toolbar">
            <table-tool-bar
                :start-date="startDate"
                :end-date="endDate"
                :columns="tableColumns"
                :rows="tableRows"
                :use-manage-columns="useManageColumns"
                @change-active-columns="onChangeActiveColumns"
                @filter-rows="filterTableRows"
            ></table-tool-bar>
        </div>

        <detail-table
            :width="tableWidth"
            :height="tableHeight"
            :columns="tableColumns"
            :rows="tableRows"
            :row-template="tableRowTemplate"
            :filter="filterKeyword"
            :is-loading="isExpandDataLoading"
            @detail-view="onClickDetailView"
            @xview-link="onClickXViewLink"
            @xview-fail-link="onClickXViewFailLink"
            @sql-link="onClickSqlLink"
        ></detail-table>

        <detail-window
            :width="600"
            :height="sqlWindowHeight"
            :left="94"
            :top="sqlWindowTop"
            @cancel="() => (showSqlWindow = false)"
            v-if="tableType === 'sql' && showSqlWindow"
        >
            <template #subject>{{ i18n.showSql }}</template>
            <template #contents>
                <pre v-html="sqlContents"></pre>
            </template>
        </detail-window>
    </div>
</template>

<script>
import DetailWindow from '@entry/popup/xviewAnalysis/component/DetailWindow';
import TableToolBar from '../component/TableToolBar';
import DetailTable from '../component/DetailTable';
import { OTypeDef } from '@common/definition';
import { UIManager } from '@common/legacy/UIManager';
import { setItem } from '@entry/popup/xviewAnalysis/storage';
import { mapState, mapMutations, mapActions } from '../vuex';
import { STORAGE_KEYS, EXPAND_NAME_HASH_KEYS } from '../constant';

export default {
    inject: ['i18n'],
    components: {
        DetailWindow,
        TableToolBar,
        DetailTable,
    },
    computed: {
        ...mapState({
            startDate: state => state.startDateForTable,
            endDate: state => state.endDateForTable,
            tableType: state => state.tableType,
            tableColumns: state => state.tableColumns,
            tableRows: state => state.tableRows,
            tableRowTemplate: state => state.tableRowTemplate,
            tableWidth: state => state.tableWidth,
            tableHeight: state => state.tableHeight,
            oidMap: state => state.oidMap,
            // 확장 윈도우 로딩 상태
            isExpandDataLoading: state => {
                return (
                    state.expandDailyChartProgress > 0 ||
                    state.expandHourlyChartProgress > 0 ||
                    state.expandTableProgress > 0
                );
            },
        }),
        tableStorageKey() {
            return STORAGE_KEYS[this.tableType];
        },
        useManageColumns() {
            return (
                this.tableType === 'application' || this.tableType === 'cics'
            );
        },
        sqlWindowTop() {
            return window.innerHeight - this.sqlWindowHeight - 20;
        },
    },
    data() {
        return {
            filterKeyword: '',
            showSqlWindow: false,
            sqlWindowHeight: 400,
            sqlContents: '',
        };
    },
    methods: {
        ...mapMutations(['updateTableColumns', 'showExpandWindow']),
        ...mapActions([
            'loadExpandChartData',
            'loadExpandTableData',
            'loadExpandTableDataForApplication',
        ]),
        filterTableRows(keyword) {
            this.filterKeyword = keyword;
        },
        openXViewPopup(name, count, isFailed) {
            if (name !== '') {
                UIManager.getXViewPointListForFilter(
                    JSON.stringify(this.oidMap),
                    OTypeDef.SYSTEM,
                    this.startDate.valueOf(),
                    this.endDate.valueOf() + 1,
                    isFailed,
                    this.tableType === 'application' ? name : null,
                    this.tableType === 'sql' ? name : null,
                    this.tableType === 'externalCall' ? name : null,
                    count
                );
            }
        },
        onClickXViewLink({ origin, count }) {
            this.openXViewPopup(origin, count, false);
        },
        onClickXViewFailLink({ origin, count }) {
            this.openXViewPopup(origin, count, true);
        },
        onClickSqlLink({ origin }) {
            this.sqlContents = origin;
            this.showSqlWindow = true;
        },
        onChangeActiveColumns(status) {
            // 로컬 스토리지에 테이블 컬럼 활성화 상태 저장하기
            if (this.tableStorageKey) setItem(this.tableStorageKey, status);
            this.updateTableColumns(status);
        },
        async onClickDetailView(data) {
            if (this.tableType === 'cics' || data.name === '') return;

            this.showExpandWindow({
                name: data.name,
                hash: data[EXPAND_NAME_HASH_KEYS[this.tableType]],
            });

            await this.loadExpandChartData('DAY');
            this.loadExpandChartData('HOUR');

            if (this.tableType === 'application')
                this.loadExpandTableDataForApplication();
            else this.loadExpandTableData();
        },
    },
};
</script>

<style lang="scss" scoped>
.table-panel {
    ::v-deep .detail-window {
        pre {
            max-height: 290px;
        }
    }
}
</style>
