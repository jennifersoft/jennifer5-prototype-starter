<template>
    <div class="table-wrapper">
        <table
            ref="table"
            class="table nowrap hover borderless"
            v-click-outside="onClickOutSide"
        >
            <thead>
                <tr>
                    <th
                        v-for="column in columnsInApplicationTab"
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
import {
    COMMON_COLUMNS_IN_BY_GROUP,
    createTable,
    DEFAULT_ROW_TEMPLATE_IN_APPLICATION,
} from '@entry/analysis/xview/common';
import clickOutside from '@vuejs/directive/clickOutside';
import jui from 'juijs-grid';
import XTableComp from 'juijs-grid/src/components/xtable';
import { mapGetters, mapMutations } from 'vuex';
import _ from '@library/lodash';

jui.use(XTableComp);
export default {
    inject: ['i18n'],
    directives: { clickOutside },
    data() {
        return {
            table: undefined,
            scrollHeightInXTable: 300,

            columnsInApplicationTab: [
                { key: 'serviceName', width: 300 },
                ...COMMON_COLUMNS_IN_BY_GROUP,
            ].map(col => {
                return {
                    ...col,
                    name: this.i18n[col.key],
                };
            }),
        };
    },
    methods: {
        ...mapMutations('xviewAnalysis', [
            'selectIndexInTable',
            'increaseTableKey',
        ]),
        onClickOutSide() {},
        select(row, e) {
            row.element.classList.toggle('checked');

            this.selectIndexInTable(Number(row.index));
        },
        debounceCreateTable: _.debounce(function() {
            this.increaseTableKey();
        }, 400),
    },
    computed: {
        ...mapGetters('xviewAnalysis', ['transactionsGroupByApplication']),
    },
    mounted() {
        this.scrollHeightInXTable = this.$el.offsetHeight - 32;
        const columns = this.columnsInApplicationTab.map(col => col.key);

        this.table = createTable(
            this.$refs.table,
            columns,
            Array.from(new Array(columns.length).keys()),
            this.scrollHeightInXTable,
            DEFAULT_ROW_TEMPLATE_IN_APPLICATION,
            this.select
        );
        this.table.update(this.transactionsGroupByApplication);

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
