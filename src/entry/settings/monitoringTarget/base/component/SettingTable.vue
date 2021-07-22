<template>
    <div class="setting-table">
        <table
            class="table large vborderless borderless hover"
            v-mousemove-outside="onDragOut"
            v-mouseup-outside="onDragEnd"
        >
            <thead>
                <tr>
                    <th v-if="checkable" class="blank">
                        <input
                            type="checkbox"
                            v-model="checkedAll"
                            @change="onCheckAllRow"
                        />
                    </th>
                    <th
                        :width="column.width"
                        :class="getColumnClasses(index, column)"
                        @click="onClickColumn(index, column)"
                        v-for="(column, index) in mergedColumns"
                    >
                        {{ column.label }}

                        <template v-if="sortedField === column.field">
                            <i class="icon-desc" v-if="sortedStatus === 1"></i>
                            <i
                                class="icon-asc"
                                v-else-if="sortedStatus === -1"
                            ></i>
                        </template>
                    </th>
                    <th v-if="draggable" class="blank"></th>
                </tr>
            </thead>
            <tbody ref="tbody">
                <tr
                    :ref="'row_' + index"
                    :class="getRowClasses(index)"
                    v-for="(row, index) in mergedRows"
                    @click="onSelectRow(index, row, $event)"
                    @mouseover="onDragMove(index)"
                    @mouseup="onDragEnd"
                >
                    <td v-if="checkable" class="blank">
                        <input
                            type="checkbox"
                            v-model="row.checked"
                            @change="onCheckRow"
                        />
                    </td>
                    <slot name="row" :data="row" :index="index"></slot>
                    <td
                        v-if="draggable"
                        class="blank"
                        @mousedown.prevent="onDragStart(index)"
                    >
                        <svg-icon
                            class="drag-icon"
                            :icon-type="dragIcon.type"
                            :width="dragIcon.size"
                            :height="dragIcon.size"
                        ></svg-icon>
                    </td>
                </tr>
                <template v-if="draggable">
                    <tr
                        ref="dragline"
                        class="dragline"
                        v-if="draggingIndex > -1"
                    >
                        <td :colspan="columnCount"></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import mousemoveOutside from '@vuejs/directive/mousemoveOutside';
import mouseupOutside from '@vuejs/directive/mouseupOutside';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    components: {
        SvgIcon,
    },
    directives: {
        mousemoveOutside,
        mouseupOutside,
    },
    props: {
        columns: {
            type: Array,
            required: true,
            validator: cols => {
                for (let i = 0; i < cols.length; i++) {
                    if (
                        !cols[i].hasOwnProperty('field') ||
                        !cols[i].hasOwnProperty('label')
                    )
                        return false;
                }

                return true;
            },
        },
        rows: {
            type: Array,
            required: false,
            default: () => [],
        },
        checkable: {
            type: Boolean,
            required: false,
            default: true,
        },
        selectable: {
            type: Boolean,
            required: false,
            default: false,
        },
        draggable: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        columnCount() {
            let colspan = this.columns.length;
            if (this.checkable) colspan += 1;
            if (this.draggable) colspan += 1;
            return colspan;
        },
        rowCount() {
            return this.rows.length;
        },
    },
    data() {
        const mergedRows = this.createMergedRows(this.rows);

        return {
            mergedColumns: this.createMergedColumns(this.columns),
            mergedRows: mergedRows,
            sortedField: '',
            sortedStatus: 0,
            checkedAll: this.updateCheckedAll(mergedRows),
            selectedIndex: -1,
            draggingIndex: -1,
            draggedIndex: -1,
            dragIcon: {
                type: ICON_TYPE.gripHorizontal,
                size: 16,
            },
        };
    },
    watch: {
        columns(newVal) {
            this.mergedColumns = this.createMergedColumns(newVal);
        },
        rows(newVal) {
            this.mergedRows = this.createMergedRows(newVal);
            this.checkedAll = this.updateCheckedAll(this.mergedRows);
        },
    },
    methods: {
        updateCheckedAll(rows) {
            return rows.filter(row => !row.checked).length === 0;
        },
        createMergedColumns(columns) {
            return columns.map(col => {
                return {
                    sortable: false,
                    width: 'auto',
                    class: '',
                    ...col,
                };
            });
        },
        createMergedRows(rows) {
            return rows.map(row => {
                return {
                    checked: false,
                    ...row,
                };
            });
        },
        getRowClasses(index) {
            const classes = [];
            if (this.selectedIndex === index) classes.push('selected');
            if (this.selectable) classes.push('clickable');
            return classes;
        },
        getColumnClasses(index, column) {
            const classes = column.sortable ? ['clickable'] : [];
            classes.push(column.class);
            return classes;
        },
        onClickColumn(index, column) {
            if (column.sortable) {
                if (this.sortedField !== column.field) {
                    this.sortedField = column.field;
                    this.sortedStatus = 1;
                } else {
                    this.sortedStatus = this.sortedStatus === 1 ? -1 : 1;
                }

                this.mergedRows.sort((a, b) => {
                    const f = this.sortedField;
                    const s = this.sortedStatus;

                    if (s === -1) {
                        if (a[f] > b[f]) return 1;
                        else if (a[f] < b[f]) return -1;
                        else return 0;
                    } else if (s === 1) {
                        if (a[f] > b[f]) return -1;
                        else if (a[f] < b[f]) return 1;
                        else return 0;
                    }
                });

                this.$emit('sort', this.mergedRows);
            }
        },
        onCheckAllRow() {
            this.mergedRows = this.mergedRows.map(row => {
                return {
                    ...row,
                    checked: this.checkedAll,
                };
            });

            this.$emit('check', this.mergedRows);
        },
        onCheckRow() {
            this.$emit('check', this.mergedRows);
            this.checkedAll = this.updateCheckedAll(this.mergedRows);
        },
        onSelectRow(index, row, e) {
            const tag = e.target.tagName.toUpperCase();
            if (tag === 'SVG' || tag === 'INPUT') return;

            if (this.selectable) {
                this.selectedIndex = index;
                this.$emit('select', row);
            }
        },
        onDragStart(index) {
            if (
                this.draggable &&
                this.draggingIndex === -1 &&
                this.rowCount > 1
            ) {
                const target = this.$refs[`row_${index}`][0];
                target.classList.add('dragtarget');
                this.draggingIndex = index;
            }
        },
        onDragMove(index) {
            if (this.draggable && this.draggingIndex > -1) {
                const dragline = this.$refs['dragline'];
                const parent = this.$refs['tbody'];
                const target = this.$refs[`row_${index}`][0];

                dragline.style.opacity = '1';
                parent.insertBefore(dragline, target);
                this.draggedIndex = index;
            }
        },
        onDragOut() {
            if (this.draggable && this.draggingIndex > -1) {
                const dragline = this.$refs['dragline'];
                const parent = this.$refs['tbody'];

                parent.appendChild(dragline);
                this.draggedIndex = this.rowCount;
            }
        },
        onDragEnd() {
            if (
                this.draggable &&
                this.draggingIndex > -1 &&
                this.draggedIndex > -1
            ) {
                const dragline = this.$refs['dragline'];

                dragline.style.opacity = '0';
                for (let i = 0; i < this.rowCount; i++) {
                    const target = this.$refs[`row_${i}`][0];
                    target.classList.remove('dragtarget');
                }

                if (this.draggingIndex !== this.draggedIndex) {
                    const newRows = [...this.mergedRows];
                    const movingRow = newRows.slice(
                        this.draggingIndex,
                        this.draggingIndex + 1
                    )[0];

                    // 마지막으로 행으로 이동하기
                    if (this.draggedIndex === this.rowCount)
                        newRows.push(movingRow);
                    else newRows.splice(this.draggedIndex, 0, movingRow);

                    // 드래그 로우 삭제 (아래에서 위로 이동시 인덱스 보정하기)
                    const dist = this.draggingIndex > this.draggedIndex ? 1 : 0;
                    newRows.splice(this.draggingIndex + dist, 1);

                    this.mergedRows = newRows;
                    this.$emit('drag', this.mergedRows);
                }

                this.draggingIndex = -1;
                this.draggedIndex = -1;
                this.selectedIndex = -1;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.setting-table {
    @include themify($themes) {
        /* 공통 스타일 */
        .blank {
            text-align: center;
            width: 32px;
        }
        .clickable {
            cursor: pointer;
        }
        .dragline {
            opacity: 0;
        }

        th {
            &.checkbox {
                > input[type='checkbox'] {
                    margin-top: -3px;
                }
            }

            > i {
                margin-top: 2px;
                position: static;
                float: right;
                margin-left: -20px;
            }
        }
        td.checkbox {
            > input[type='checkbox'] {
                margin-left: 1px;
            }
        }

        ::v-deep .table.large {
            > thead > tr > th {
                padding: 6px 8px;
            }

            > tbody > tr > td {
                height: 23px;
            }
        }

        ::v-deep svg.drag-icon {
            margin-bottom: -2px;
            cursor: grabbing;
            color: themed('setting-table-drag-icon-color');
        }
    }
}
</style>
