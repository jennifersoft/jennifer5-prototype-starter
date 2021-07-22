<template>
    <div class="table-wrapper">
        <loading-wrapper v-show="loadingData" />
        <table
            ref="table"
            class="table nowrap hover borderless"
            v-click-outside="onClickOutSide"
        >
            <thead>
                <tr>
                    <th
                        v-for="column in tableColumns"
                        :title="column.name"
                        :width="column.width"
                    >
                        {{ column.name }}
                    </th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import { getItem } from '@entry/popup/xviewAnalysis/storage';
import {
    DEFAULT_COLUMNS,
    STORAGE_KEYS,
} from '@entry/popup/xviewAnalysis/constant';

import { mapGetters, mapMutations, mapState } from 'vuex';
import {
    createTable,
    DEFAULT_ROW_TEMPLATE_IN_TRANSACTION,
} from '@entry/analysis/xview/common';
import clickOutside from '@vuejs/directive/clickOutside';
import jui from 'juijs-grid';
import XTableComp from 'juijs-grid/src/components/xtable';

import LoadingWrapper from '@entry/analysis/xview/container/LoadingWrapper';
import _ from '@library/lodash';
import { makeTransactionInTable } from '@entry/analysis/xview/transaction';

jui.use(XTableComp);
export default {
    inject: ['i18n'],
    directives: { clickOutside },
    components: { LoadingWrapper },
    data() {
        const columns = this.getTableColumns();
        return {
            tableColumns: columns,

            scrollHeightInXTable: 300,
            tableSortType: 'multi',
            table: undefined,
            mountedTime: undefined,
            selectedIndex: [],
        };
    },
    methods: {
        ...mapMutations('xviewAnalysis', [
            'selectIndexInTable',
            'increaseTableKey',
        ]),
        onClickOutSide() {},
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
                    index: i,
                };
            });
        },

        // heightEmitWhenResize() {
        //     const resizeObserver = new ResizeObserver(elArray => {
        //         const tableWrapper = elArray[0];
        //         this.scrollHeightInXTable =
        //             tableWrapper.contentRect.height - 32;
        //         // this.tableInTransactionTab.scrollHeight =
        //         //     tableWrapper.contentRect.height - 32;
        //     });
        //
        //     resizeObserver.observe(this.$el);
        // },

        select(row, e) {
            row.element.classList.toggle('checked');

            this.selectIndexInTable(Number(row.index));
        },

        createTable() {
            this.table = createTable(
                this.$refs.table,
                this.tableColumns.map(col => col.key),
                this.tableColumns
                    .filter(col => col.active === true)
                    .map(col => col.index),
                this.scrollHeightInXTable,
                DEFAULT_ROW_TEMPLATE_IN_TRANSACTION,
                this.select
            );
        },
        updateAfterMakeRows() {
            const rows = makeTransactionInTable(
                this.filteredTransactions,
                this.domainIdNOidNNameAbountInstance,
                this.domainIdNOidNNameAbountBusiness
            );

            this.table.update(rows);
        },
        debounceUpdateAfterMakeRows: _.debounce(function() {
            this.updateAfterMakeRows();
        }, 400),
        debounceCreateTable: _.debounce(function() {
            this.increaseTableKey();
        }, 400),
    },
    computed: {
        ...mapState('xviewAnalysis', ['loadingData', 'rawTransactions']),
        ...mapGetters('xviewAnalysis', [
            'filteredTransactions',
            'domainIdNOidNNameAbountInstance',
            'domainIdNOidNNameAbountBusiness',
        ]),
    },
    watch: {
        rawTransactions() {
            if (Object.keys(this.rawTransactions).length > 0)
                this.debounceUpdateAfterMakeRows();
        },
    },
    mounted() {
        this.scrollHeightInXTable = this.$el.offsetHeight - 32;
        this.createTable();
        this.updateAfterMakeRows();
        this.mountedTime = Date.now();
        const resizeObserver = new ResizeObserver(elArray => {
            if (this.mountedTime + 4000 < Date.now())
                this.debounceCreateTable();
        });

        resizeObserver.observe(this.$el);
    },
};
</script>
<style lang="scss">
.table-wrapper {
    position: relative;
    margin-top: 16px;
    .xtable {
        height: 100%;
        table {
            tbody {
                tr {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
