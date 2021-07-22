<template>
    <div class="xtable" ref="grid" :key="tableKey">
        <table :class="['table', 'hover', 'borderless', size]">
            <thead>
                <tr>
                    <th
                        :width="col.width"
                        :title="col.name"
                        v-for="col in visibleColumns"
                    >
                        {{ col.name }}
                    </th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs-grid';
import Table from 'juijs-grid/src/components/table';
import XTable from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';

jui.use(Table, XTable);

export default {
    inject: ['i18n'],
    props: {
        width: {
            type: Number,
            required: false,
            default: -1,
        },
        height: {
            type: Number,
            required: true,
        },
        columns: {
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
        rowTemplate: {
            type: String,
            required: true,
        },
        filter: {
            type: String,
            required: false,
            default: '',
        },
        size: {
            type: String,
            required: false,
            default: 'normal',
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        visibleColumns() {
            return this.columns.filter(col => !col.isHide);
        },
    },
    watch: {
        columns() {
            if (this.tableObj !== null) {
                this.tableKey += 1;
                setTimeout(() => {
                    this.tableObj = this.createTableObj();
                    this.tableObj.update(this.rows);
                }, 1);
            }
        },
        rows(newVal) {
            if (this.tableObj !== null) {
                this.tableObj.rollback();
                this.tableObj.update(newVal);

                if (this.filter !== '') {
                    this.tableObj.filter(d => {
                        return d.name.indexOf(this.filter) !== -1;
                    });
                }
            }
        },
        filter(newVal, oldVal) {
            if (newVal === oldVal || this.tableObj === null) return;
            if (newVal === '') {
                this.tableObj.rollback();
            } else {
                this.tableObj.filter(d => {
                    return d.name.indexOf(newVal) !== -1;
                });
            }
        },
        width(newVal, oldVal) {
            if (newVal === oldVal && this.tableObj === null) return;
            this.tableObj.scrollWidth(newVal, true);
        },
        height(newVal, oldVal) {
            if (newVal === oldVal && this.tableObj === null) return;
            this.tableObj.scrollHeight(newVal);
        },
    },
    data() {
        return {
            tableObj: null,
            tableKey: 1,
        };
    },
    methods: {
        createTableObj() {
            const self = this;

            return jui.create('grid.xtable', this.$refs.grid, {
                fields: this.visibleColumns.map(col => col.key),
                resize: true,
                sort: true,
                sortCache: true,
                scrollWidth: this.width === -1 ? 'auto' : this.width,
                scrollHeight: this.height,
                buffer: 'vscroll',
                rowHeight: this.size === 'normal' ? 27 : 22,
                event: {
                    sort: setSortEff,
                    click: function(row, e) {
                        const clz = e.target.className;
                        if (clz !== '') self.$emit(clz, row.data, e);
                        else {
                            if (!self.isLoading) {
                                self.$emit('detail-view', row.data, e);
                                this.select(row.index);
                            }
                        }
                    },
                },
                tpl: {
                    row: this.rowTemplate,
                },
            });
        },
    },
    mounted() {
        this.tableObj = this.createTableObj();
    },
};
</script>

<style lang="scss" scoped>
.xtable {
    @import '../themes';
    @include themify($themes) {
        ::v-deep tr {
            .xview-link,
            .xview-fail-link {
                text-decoration: underline;
                cursor: pointer;
            }

            .sql-link,
            .error-link {
                cursor: pointer;
                border-radius: 3px;
                height: 18px;
                padding: 0px 4px;
                background-color: themed(
                    'detail-table-bar-link-background-color'
                );
                color: themed('detail-table-bar-link-font-color');
            }
        }
    }

    @import '../style/bar-chart-cell.scss';
    @include bar-chart-cell;
}
</style>
