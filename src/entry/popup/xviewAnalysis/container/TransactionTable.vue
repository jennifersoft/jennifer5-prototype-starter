<template>
    <div class="transaction-table">
        <div class="top">
            <div class="subject">
                <span v-if="dataMode === 'guid'">{{ i18n.guid }}</span>
                <span v-else-if="dataMode === 'link'">{{
                    i18n.associatedTx
                }}</span>
                <span v-else>{{ i18n.transactionData }}</span>
                <small>({{ transactionCountFormat }})</small>
            </div>
            <transaction-toolbar
                :columns="tableColumns"
                :chart-mode="chartMode"
                @change-chart-mode="onChangeChartMode"
                @change-sort-type="onChangeSortType"
                @change-active-columns="onChangeActiveColumns"
                @download-csv-file="onDownloadCsvFile"
                @export-profile-all="onExportProfileAll"
            ></transaction-toolbar>
        </div>

        <div class="bottom">
            <div class="chart" v-if="chartMode">
                <guid-chart
                    :data="transactionRows"
                    :row-index="transactionIndex"
                    :width="mainWidth"
                    @click="onClickChartRow"
                ></guid-chart>
            </div>
            <x-table
                v-else
                :key="tableKey"
                :table-type="'nowrap'"
                :table-effect="'hover stripeless'"
                :table-size="'small'"
                :table-width="mainWidth"
                :scroll-width="tableScrollWidth"
                :scroll-height="198"
                :scroll-event="false"
                :columns="tableColumns"
                :data="transactionRows"
                :select-row-effect="true"
                :select-row-index="transactionIndex"
                :scroll-row-index="tableScrollIndex"
                :template-row="tableRowTemplate"
                :row-height="22"
                :resize="true"
                :sort-type="tableSortType"
                @click="onClickTableRow"
                @update="onUpdateTableRows"
                @sortend="onSortTableRows"
            >
            </x-table>
        </div>
    </div>
</template>

<script>
import { getDayjs } from '@common/base';
import { downloadCsv } from '@common/utility';
import XTable from 'vue-sheets/src/components/xtable';
import GuidChart from '../component/GuidChart';
import TransactionToolbar from './TransactionToolbar';
import {
    mapState as baseMapState,
    mapActions as baseMapAction,
} from '../store/base';
import {
    STORAGE_KEYS,
    MAIN_PADDING,
    DATE_FORMAT,
    TIME_FORMAT,
} from '../constant';
import { getItem } from '../storage';
import {
    DEFAULT_COLUMNS,
    DEFAULT_ROW_TEMPLATE,
} from '@entry/popup/xviewAnalysis/constant';

export default {
    components: {
        TransactionToolbar,
        XTable,
        GuidChart,
    },
    inject: {
        i18n: {
            default: {
                ...DEFAULT_COLUMNS.map(col => ({ [col.key]: col.key })),
                associatedTx: 'associatedTx',
                guid: 'GUID',
                transactionData: 'Transaction Data',
                M0631: 'M0631',
            },
        },
    },
    data() {
        const columns = this.getTableColumns();

        return {
            tableKey: 1,
            tableColumns: columns,
            tableRows: [],
            tableSortType: 'multi',
            tableRowTemplate: DEFAULT_ROW_TEMPLATE,
            tableScrollWidth: window.innerWidth - MAIN_PADDING,
            tableSequence: 0, // 테이블 행 순서 (정렬된 상태에도 유지가 됨)
            tableScrollIndex: 0,
            chartMode: false,
        };
    },
    computed: {
        ...baseMapState({
            dataMode: state => state.dataMode,
            groupType: state => state.groupType,
            mainWidth: state => state.mainWidth,
            transactionIndex: state => state.transactionIndex,
            transactionRow: state => state.transactionRow,
            transactionRows: state => state.transactionRows,
            transactionCount: state => state.transactionRows.length,
            tabLoading: state => state.tabLoading,
        }),
        transactionCountFormat() {
            return this.transactionCount.toLocaleForAries();
        },
    },
    methods: {
        ...baseMapAction(['selectTransactionRow', 'downloadProfileAll']),

        getTableColumns() {
            const activeColumns = getItem(
                STORAGE_KEYS.TRANSACTION_COLUMN_STATUS,
                DEFAULT_COLUMNS.map(col => `${col.active}`),
                Array
            ).map(col => col === 'true');

            return DEFAULT_COLUMNS.map((col, i) => {
                return {
                    ...col,
                    active: activeColumns[i],
                    name: this.i18n[col.key],
                };
            });
        },

        selectTransactionAndLoadProfile(index) {
            this.selectTransactionRow({
                index: !index ? this.tableScrollIndex : index,
                data: this.tableRows[this.tableSequence].data,
            });

            this.$emit('load-profile-data');
        },

        onClickChartRow(index) {
            this.tableSequence = index;
            this.tableScrollIndex = index;

            this.selectTransactionRow({
                index: index,
                data: this.transactionRows[index],
            });
            this.$emit('load-profile-data');
        },
        onClickTableRow(row, e) {
            if (this.tabLoading || this.transactionIndex === row.rownum) return;

            e.preventDefault();
            // 마우스로 로우 클릭시에만 스크롤 위치를 변경하지 않는다.
            this.tableSequence = row.seq - 1;
            this.selectTransactionAndLoadProfile(row.rownum);
        },
        onChangeSortType(type) {
            this.tableSortType = type;
            this.tableKey += 1;
        },
        onChangeActiveColumns(columns) {
            this.tableColumns = columns;
            this.tableKey += 1;
        },
        onChangeChartMode(active) {
            // 테이블 <-> 차트 모드 변경시 처리
            this.chartMode = active;
            this.emitResizeTransactionTable();

            // 차트 -> 테이블 모드일 때, 첫번째 로우 선택으로 변경
            if (!active) {
                this.tableKey += 1;
                this.onClickChartRow(0);
            }
        },

        onUpdateTableRows(rows) {
            this.tableRows = rows;
        },
        onSortTableRows(obj) {
            this.tableRows = obj.rows;
            this.tableSequence = 0;
            this.tableScrollIndex = this.tableRows[0].rownum;
            this.selectTransactionAndLoadProfile();
        },
        onDownloadCsvFile({ fields, names }) {
            const rows = this.tableRows
                .map(row => row.data)
                .map(data => {
                    const startObj = getDayjs(data.startTime);
                    const endObj = getDayjs(data.endTime);
                    const collectionObj = getDayjs(data.collectionTime);

                    return {
                        ...data,
                        startDate: startObj.format(DATE_FORMAT),
                        startTime: startObj.format(TIME_FORMAT),
                        endDate: endObj.format(DATE_FORMAT),
                        endTime: endObj.format(TIME_FORMAT),
                        collectionTime: collectionObj.format(
                            `${DATE_FORMAT} ${TIME_FORMAT}`
                        ),
                    };
                });

            downloadCsv('transactionData', {
                fields,
                names,
                rows,
            });
        },
        onExportProfileAll() {
            this.downloadProfileAll(this.tableRows.map(row => row.data));
        },

        nextTableRowIndex(step) {
            let nextSeq = this.tableSequence + step;

            if (nextSeq < 0) nextSeq = this.transactionCount - 1;
            else if (nextSeq === this.transactionCount) nextSeq = 0;

            this.tableSequence = nextSeq;
            this.tableScrollIndex = this.tableRows[nextSeq].rownum;
        },

        keydownEventHandler(e) {
            if (this.tabLoading) return;

            if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
                e.preventDefault();

                this.nextTableRowIndex(e.code === 'ArrowUp' ? -1 : 1);

                // TODO: juijs-grid 라이브러리 문제로 인해 부득이하게 setTimeout을 사용했음
                setTimeout(() => {
                    this.selectTransactionAndLoadProfile();
                }, 100);
            }
        },

        emitResizeTransactionTable() {
            // TODO: 하위 영역 추가 확보를 위해 현재 컴포넌트의 높이를 상위로 넘김
            this.$nextTick(() => {
                this.$emit('resize', undefined, this.$el.offsetHeight);
            });
        },
    },
    beforeMount() {
        window.addEventListener('keydown', this.keydownEventHandler);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.keydownEventHandler);
    },
    mounted() {
        this.emitResizeTransactionTable();
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.transaction-table {
    @include themify($themes) {
        max-height: 261px;
        padding: 16px 24px 25px 24px;

        > .top {
            display: flex;
            margin-bottom: 16px;

            > .subject {
                flex: 1;
                font-size: 14px;
                font-weight: 500;
            }
        }

        ::v-deep tr {
            cursor: pointer;

            &.topology {
                background: themed(
                    'topology-table-selected-row-background-color'
                ) !important;
            }
        }
    }
}
</style>
