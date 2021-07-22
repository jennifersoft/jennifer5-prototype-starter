<template>
    <div ref="grid" class="xtable">
        <table :class="['table', 'borderless', this.size]">
            <thead>
                <tr>
                    <th width="30%">{{ i18n.application }}</th>
                    <th ref="chart"></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import _ from '@library/lodash';
import grid from 'juijs-grid';
import graph from 'juijs-chart';
import XTable from 'juijs-grid/src/components/xtable';
import AsyncBarBrush from './graph/AsyncBarBrush';
import AsyncGridBrush from './graph/AsyncGridBrush';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';
import { createTreeIndexes } from '../utility';

grid.use(XTable);
graph.use(AsyncGridBrush, AsyncBarBrush, ClassicTheme, DarkTheme);

const COMMON_STYLE = {
    backgroundColor: 'transparent',
    gridXAxisBorderWidth: 0,
    gridYAxisBorderWidth: 0,
    gridTickBorderSize: 0,
    gridTickBorderWidth: 0,
    gridTickPadding: 0,
    gridXFontSize: 0,
    gridBorderWidth: 0,
};

const CHART_THEMES = {
    classic: {
        ...COMMON_STYLE,
        gridXFontColor: '#999',
        gridXAxisBorderColor: '#dadada',
    },
    dark: {
        ...COMMON_STYLE,
        gridXFontColor: '#999',
        gridXAxisBorderColor: '#4e4e4e',
    },
};

export default {
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: {
                application: 'Application',
            },
        },
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        target: {
            type: Array,
            required: true,
        },
        colors: {
            type: Array,
            required: false,
            default: () => [
                'transparent',
                '#4a7dff',
                '#9ed5ff',
                '#ffdc04',
                '#49d484',
            ],
        },
        domain: {
            type: Array,
            required: false,
            default: () => [0, 100],
        },
        rows: {
            type: Array,
            required: false,
            default: () => [],
        },
        rowTemplate: {
            type: String,
            required: false,
            default: `<tr class="<!= active ? 'selected-bold' : '' !>">
    <td><span class="application" title="<!= application !>"><!= application !></span></td>
    <td><span class="chart"></span></td>
</tr>`,
        },
        size: {
            type: String,
            required: false,
            default: 'large',
        },
        useSelectEffect: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            grid: null,
            chart: null,
            domainHandler: null,
        };
    },
    watch: {
        width(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.chart.render();
            this.grid.next();
        },
        height(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.chart.render();
            this.grid.scrollHeight(newVal);
        },
        domain(newVal, oldVal) {
            if (newVal[0] === oldVal[0] && newVal[1] === oldVal[1]) return;
            this.domainHandler(newVal);
        },
        rows(newVal) {
            this.updateTableData(newVal);
        },
    },
    computed: {
        rootRow() {
            const filteredRows = this.rows.filter(row => row.parentKey === -1);
            if (filteredRows.length === 1) {
                return {
                    children: [],
                    data: filteredRows[0],
                    index: '0',
                    type: 'open',
                };
            }
            return null;
        },
        tableRowHeight() {
            return this.size === 'large' ? 35 : 22;
        },
        chartHeadRowHeight() {
            return this.size === 'large' ? 30 : 27;
        },
        chartBodyRowHeight() {
            return this.size === 'large' ? 14 : 10;
        },
    },
    methods: {
        createHeadChart() {
            const newElem = document.createElement('span');
            newElem.setAttribute('class', 'chart');
            this.$refs.chart.appendChild(newElem);

            return graph.create('chart.builder', newElem, {
                theme: this.theme,
                width: '100%',
                height: this.chartHeadRowHeight,
                padding: 0,
                axis: {
                    x: {
                        type: 'range',
                        domain: this.domain,
                        line: 'solid',
                    },
                    y: {
                        domain: [''],
                        hide: true,
                    },
                },
                brush: [
                    {
                        type: 'asyncgrid',
                        domain: this.domain,
                        splitCount: 10,
                    },
                ],
                style: CHART_THEMES[this.theme],
                render: false,
            });
        },
        createBodyChart(row) {
            const self = this;
            const newElem = row.element.querySelector('.chart');

            return graph.create('chart.builder', newElem, {
                theme: this.theme,
                width: '100%',
                height: this.chartBodyRowHeight,
                padding: 0,
                axis: {
                    data: [row.data],
                    x: {
                        type: 'range',
                        domain: this.domain,
                        hide: true,
                    },
                    y: {
                        domain: [''],
                        hide: true,
                    },
                },
                brush: {
                    type: 'asyncbar',
                    target: this.target,
                    colors: this.colors,
                },
                event: {
                    mouseover(obj, e) {
                        self.$emit(
                            'show-graph',
                            {
                                index: row.index,
                                data: obj.data,
                            },
                            e
                        );
                    },
                    mouseout(obj, e) {
                        self.$emit(
                            'hide-graph',
                            {
                                index: row.index,
                                data: obj.data,
                            },
                            e
                        );
                    },
                },
                style: CHART_THEMES[this.theme],
            });
        },
        covertToTreeData(data, rootRow, rootKey = '0') {
            const newData = [rootRow];
            const rowMap = {};
            const rootRows = [];
            let rootIndex = 0;

            data.forEach(row => {
                const newRow = {
                    children: [],
                    data: row,
                    index: null,
                    type: 'open',
                };

                newData.push(newRow);
                rowMap[row.key] = newRow;

                if (row.parentKey === rootKey) {
                    newRow.index = '0.' + rootIndex;
                    newRow.type = 'fold';
                    rootRows.push(newRow);
                    rootIndex++;
                }
            });

            newData.forEach(row => {
                const parent = rowMap[row.data.parentKey];
                if (parent) parent.children.push(row);
            });

            if (rootRows.length === 0) {
                return [];
            } else {
                rootRows.forEach(rootRow => {
                    createTreeIndexes(rootRow, rootRow.index);
                });

                const result = newData
                    .filter(row => row.index !== null)
                    .sort((a, b) => {
                        if (a.index < b.index) return -1;
                        else if (a.index > b.index) return 1;
                        return 0;
                    });

                return result;
            }
        },
        updateTableData(rows) {
            if (this.rootRow !== null) {
                this.grid.updateTree(
                    this.covertToTreeData(
                        rows,
                        this.rootRow,
                        this.rootRow.data.key
                    )
                );
            } else {
                this.grid.update(rows);
            }
        },
    },
    mounted() {
        const self = this;

        this.grid = grid.create('grid.xtable', this.$refs.grid, {
            fields: ['application', null],
            rowHeight: this.tableRowHeight,
            buffer: 'vscroll',
            resize: true,
            scrollHeight: this.height,
            event: {
                colresize: function(col) {
                    if (col && col.name === 'application') {
                        self.chart.render();
                        this.next();
                    }
                },
                next: _.throttle(rows => {
                    rows.forEach(row => {
                        self.createBodyChart(row);
                    });
                }, 150),
                select: function(row, e) {
                    const cls = e.target.className;

                    if (cls === 'application') {
                        if (self.useSelectEffect) this.select(row.index);

                        self.$emit(
                            'click-row',
                            {
                                index: row.index,
                                data: row.data,
                            },
                            e
                        );
                    } else {
                        // 자식 노드 열기/닫기
                        if (row.children.length > 0) {
                            if (row.type == 'fold') {
                                this.open(row.index);
                            } else {
                                this.fold(row.index);
                            }
                        }
                    }
                },
            },
            tpl: {
                row: this.rowTemplate,
            },
        });

        // 최초 로드시 헤더 및 바디 차트 그리기
        if (this.rows.length > 0) this.updateTableData(this.rows);
        this.chart = this.createHeadChart();

        // 도메인 변경시 지연효과 적용
        this.domainHandler = _.throttle(domain => {
            this.chart.axis(0).set('x', {
                domain: domain,
            });
            this.chart.updateBrush(0, {
                domain: domain,
            });
            this.chart.render();

            setTimeout(() => {
                // 최초 테이블 업데이트 후, next 메소드를 호출하면 이벤트가 바로 적용되지 않음.
                // TODO: 렌더링 시점의 차이인듯 한데, 어떻게 수정하지?
                this.grid.next();
            }, 1);
        }, 500);
    },
};
</script>

<style lang="scss" scoped>
::v-deep tr {
    th:last-child {
        position: relative;
        > span.chart {
            position: absolute !important;
            width: 100%;
            height: 30px;
            top: 0px;
            left: 0px;
        }
    }
    td {
        &.large {
            padding: 10px 9px 6px 9px !important;
        }
        > span.chart {
            display: inline-block;
            width: 100%;
        }
        > span.application {
            cursor: pointer;
            text-decoration: underline;
        }
    }
}
</style>
