<template>
    <div
        :class="`table-wrapper ${theme} ${type}`"
        ref="tableRef"
        :style="`height: ${height}`"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
    >
        <div class="title" v-if="title">
            <span>{{ title }}</span>
        </div>
        <div class="head-table">
            <table class="table classic">
                <thead>
                    <tr ref="theadRef">
                        <th
                            v-for="(col, i) in field"
                            @mousedown="onHeaderClick(col.key)"
                            :style="
                                `width: ${getWidthPercentage(i)}%;
                                    min-width: ${minWidth}px;`
                            "
                        >
                            {{ col.name }}
                            <i
                                v-if="sortKey === col.key"
                                :class="iconDirection"
                            />
                            <div
                                v-if="i !== 0"
                                class="resize"
                                @mousedown="onMouseDown($event, i)"
                            ></div>
                        </th>
                        <th
                            v-if="editable"
                            style="width: 68px; min-width: 68px"
                        >
                            <input
                                type="checkbox"
                                @click="onSelectedAll"
                                :checked="
                                    tableData.length > 0 &&
                                        checked.length === tableData.length
                                "
                            />
                            <span>{{ i18n.delete }}</span>
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
        <div :class="`body-table ${scrollable ? 'scrollable' : ''}`">
            <div :style="`margin-right: ${scrollable ? -scrollWidth() : 0}px`">
                <table class="table classic">
                    <thead>
                        <tr ref="tbodyRef">
                            <th
                                v-for="(_, i) in field"
                                :style="
                                    `width: ${getWidthPercentage(i)}%;
                                            min-width: ${minWidth}px;`
                                "
                            ></th>
                            <th
                                v-if="editable"
                                :style="
                                    `width: 68px;
                                        min-width: 68px;`
                                "
                            ></th>
                        </tr>
                    </thead>
                    <tbody v-if="tableData.length > 0">
                        <tr v-for="row in sortedData">
                            <td
                                v-for="f in field"
                                :class="f.fullContents ? 'full-contents' : ''"
                                :style="
                                    `text-align: ${f.alignRight && 'right'}`
                                "
                            >
                                <a
                                    v-if="f.link"
                                    class="link"
                                    @click="onClickTableCell(row[f.key])"
                                >
                                    {{ formatted(row, f.key) }}
                                </a>
                                <span v-else>{{ formatted(row, f.key) }}</span>
                            </td>
                            <td v-if="editable">
                                <input
                                    type="checkbox"
                                    :checked="checked.includes(row[editable])"
                                    @click="onSelected(row[editable])"
                                />
                            </td>
                        </tr>
                    </tbody>
                    <tbody class="empty" v-else>
                        <tr class="text">
                            <td :colspan="columnLength" class="none">
                                {{ i18n.M0004 }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import _ from '@library/lodash';

const RESIZING_INTERVAL = 50;
const ASC = 1;
const DESC = -1;

export function scrollWidth() {
    const inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);
    document.body.appendChild(outer);

    const w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';

    let w2 = inner.offsetWidth;
    if (w1 === w2) w2 = outer.clientWidth;
    document.body.removeChild(outer);

    return w1 - w2;
}

export default {
    name: 'BasicTable',
    inject: ['theme', 'i18n'],
    props: {
        type: {
            type: String,
            required: false,
            default: 'rounded',
            validator: function(t) {
                return ['rounded', 'angled'].indexOf(t) !== -1;
            },
        },
        tableData: {
            type: Array,
            required: false,
            default: () => [],
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
        field: {
            type: Array,
            required: true,
            default: () => [],
        },
        widthRatio: {
            type: Array,
            required: false,
            default: null,
        },
        minWidth: {
            type: Number,
            required: false,
            default: 60,
        },
        sortCompare: {
            type: Function,
            required: true,
            default: null,
        },
        formatter: {
            type: Object,
            required: false,
            default: null,
        },
        editable: {
            type: String,
            required: false,
            default: '',
        },
        height: {
            type: String,
            required: false,
            default: '',
        },
        scrollable: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            sortKey: null,
            resizing: null,
            resizedWidth: null,
            RESIZING_INTERVAL,
            ASC,
            DESC,
            sortDirection: ASC,
            checked: [],
        };
    },
    computed: {
        sortedData() {
            if (!this.sortKey) return this.tableData;
            return this.tableData.sort((a, b) => {
                return (
                    this.sortDirection * this.sortCompare(a, b, this.sortKey)
                );
            });
        },
        iconDirection() {
            let className = 'icon-white';
            className +=
                this.sortDirection === ASC ? ' icon-arrow1' : ' icon-arrow3';
            return className;
        },
        columnLength() {
            return this.editable ? this.field.length + 1 : this.field.length;
        },
    },
    methods: {
        formatted(row, key) {
            return this.formatter && this.formatter[key]
                ? this.formatter[key](row[key])
                : row[key];
        },
        onHeaderClick(key) {
            if (
                this.resizing ||
                (this.checkbox && key === this.field[this.checkbox].key)
            )
                return;
            this.sortKey = key;
            this.sortDirection *= -1;
        },
        onMouseDown(e, i) {
            this.resizing = i;
            e.stopPropagation();
        },
        onMouseMove(e) {
            if (!this.resizing) return;

            const target = this.$refs['theadRef'].children[this.resizing - 1];
            const targetRight = this.$refs['theadRef'].children[this.resizing];

            const { left } = target.getBoundingClientRect();
            const { right } = targetRight.getBoundingClientRect();

            if (
                e.clientX - left < this.minWidth ||
                right - e.clientX < this.minWidth
            )
                return;
            target.style.width = e.clientX - left + 'px';
            targetRight.style.width = right - e.clientX + 'px';

            this.resizedWidth = [e.clientX - left, right - e.clientX];
        },
        onMouseUp() {
            if (this.resizing) {
                const target = this.$refs['tbodyRef'].children[
                    this.resizing - 1
                ];
                const targetRight = this.$refs['tbodyRef'].children[
                    this.resizing
                ];
                target.style.width = this.resizedWidth[0] + 'px';
                targetRight.style.width = this.resizedWidth[1] + 'px';
            }
            this.resizing = null;
        },
        getWidthPercentage(i) {
            if (!this.widthRatio) return null;
            const sum = this.widthRatio.reduce((a, b) => a + b, 0);
            return (this.widthRatio[i] / sum) * 100;
        },
        onSelected(item) {
            if (!this.checked.includes(item)) this.checked.push(item);
            else this.checked.filter(e => e === item);
            this.$emit('check', this.checked);
        },
        onSelectedAll() {
            this.checked =
                this.checked.length === this.tableData.length
                    ? []
                    : this.tableData.map(e => e[this.editable]);
            this.$emit('check', this.checked);
        },
        onClickTableCell(data) {
            this.$emit('link', data);
        },
    },
    created() {
        this.scrollWidth = scrollWidth;
    },
    mounted() {
        this.$refs['tableRef'].onmousemove = _.throttle(e => {
            this.onMouseMove(e);
        }, this.RESIZING_INTERVAL);
    },
};
</script>
<style lang="scss" scoped>
@mixin theme(
    $text-color,
    $value-text-color,
    $table-body-border-color,
    $table-head-border-color,
    $table-header-background-color,
    $table-row-odd-background-color,
    $table-row-even-background-color
) {
    div,
    table,
    thead,
    tbody,
    tr,
    th,
    td {
        box-sizing: border-box;
    }

    th,
    td {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    &.dark {
        color: #d5d5d5;
    }

    .title {
        margin: 15px 0 8px;
        font-size: 13px;
        font-weight: 700;
    }

    .head-table {
        width: 100%;

        table {
            border-bottom: none !important;

            thead tr {
                th {
                    position: relative;
                    cursor: pointer;
                    min-width: 100px;

                    .resize {
                        position: absolute;
                        width: 8px;
                        height: 100%;
                        left: 0;
                        top: 0;
                        cursor: w-resize;
                        z-index: 10;
                    }

                    i {
                        z-index: 1;
                        float: right;
                        text-align: right;
                    }
                }
            }
        }
    }

    .body-table {
        width: 100%;
        box-sizing: border-box;

        &.scrollable {
            max-height: calc(100% - 50px);
            overflow-x: hidden;
            overflow-y: scroll;
        }

        thead tr {
            th {
                padding: 0 !important;
                visibility: hidden;
            }
        }

        tbody {
            td {
                &.full-contents {
                    height: unset !important;
                    white-space: normal;
                    text-overflow: initial;
                    overflow: visible;
                }

                .link {
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
    }

    &.angled {
        table {
            border-collapse: collapse;
            font-size: 11px;
            border-radius: 0;
            box-sizing: border-box;
            &:first-child {
                margin-bottom: -2px;
            }

            th {
                padding: 4px;
                background: $table-header-background-color;
                border: 1px solid $table-head-border-color;
                color: $value-text-color;
            }

            tr {
                background: $table-row-odd-background-color;
                &:nth-child(2n) {
                    background: $table-row-even-background-color;
                }
                td {
                    color: $value-text-color;
                    line-height: 14px;
                    padding: 2px 3px;
                    border: 1px solid $table-body-border-color;
                }
            }

            th,
            td {
                &:last-child {
                    border-right: none !important;
                    border-radius: 0;
                }

                &:first-child {
                    border-left: none !important;
                    border-radius: 0;
                }
            }
        }
    }
}

body.classic {
    .table-wrapper {
        @include theme(
            $text-color: #333,
            $value-text-color: #000,
            $table-body-border-color: #eee,
            $table-head-border-color: #dedede,
            $table-header-background-color: #f5f5f5,
            $table-row-odd-background-color: #fff,
            $table-row-even-background-color: #fafafa
        );
    }
}

body.dark {
    .table-wrapper {
        @include theme(
            $text-color: #d5d5d5,
            $value-text-color: #d5d5d5,
            $table-body-border-color: #404040,
            $table-head-border-color: #4b4b4b,
            $table-header-background-color: #151515,
            $table-row-odd-background-color: #2c2c2c,
            $table-row-even-background-color: #262626
        );
    }
}
</style>
