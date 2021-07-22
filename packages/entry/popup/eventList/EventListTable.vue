<template>
    <div id="eventListTable" class="xtable nowrap" ref="table">
        <table class="table simple normal headline stripeless hover">
            <thead>
                <tr>
                    <th width="100px">
                        {{ i18n.eventLevel }}
                    </th>
                    <th width="120px">{{ i18n.time }}</th>
                    <th width="75px">
                        {{ i18n.target }}
                    </th>
                    <th>{{ i18n.eventType }}</th>
                    <th>{{ i18n.message }}</th>
                    <th width="75px">{{ i18n.value }}</th>
                    <th width="100px">
                        {{ i18n.transaction }}
                    </th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs-grid';
import XTableComp from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';
import { TEMPLATE_ROW } from "@entry/popup/eventList/templates";

jui.use(XTableComp);

export default {
    name: 'EventListTable',
    inject: {
        i18n: {
            default: {
                eventLevel: 'Event level',
                time: 'Time',
                target: 'Target',
                eventType: 'Event typ',
                message: 'Message',
                value: 'Value',
                transaction: 'Transaction',
            }
        },
        theme: {
            default: 'classic',
        }
    },
    props: {
        height: {
            type: Number,
            required: true,
            default: 580,
        },
        rows: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    watch: {
        height(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.table.scrollHeight(newVal);
            this.table.resize();
        },
        rows: {
            handler(next) {
                this.table.update(next);
            },
            deep: true,
        },
    },
    mounted() {
        this.table = jui.create('grid.xtable', this.$refs.table, {
            fields: [
                'eventLevelName',
                'time',
                'name',
                'errorTypeName',
                'message',
                'value',
                null,
            ],
            resize: true,
            colshow: true,
            sort: [0, 1, 2, 3, 4, 5],
            sortIndex: 'time',
            sortOrder: 'desc',
            sortCache: true,
            scrollHeight: this.height,
            rowHeight: 28,
            buffer: 'vscroll',
            event: {
                select: (row, e) => this.$emit('click', row, e),
                sort: setSortEff,
            },
            tpl: {
                row: TEMPLATE_ROW,
            },
        });
        if (this.rows.length > 0) {
            this.table.update(this.rows);
        }
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.table {
    ::v-deep tbody tr {
        @include themify($themes) {
            .status-badge {
                display: inline-block;
                width: 8px;
                height: 8px;
                margin-right: 4px;
                border-radius: 50%;
                background-image: none !important;

                &.fatal {
                    background-color: #ff4f55;
                }

                &.warning {
                    background-color: #fddd2f;
                }

                &.normal {
                    background-color: #497eff;
                }
            }
            .link {
                display: inline-block;
                cursor: pointer;
                border-radius: 3px;
                height: 18px;
                line-height: 18px;

                &.more {
                    font-weight: normal;
                    padding: 0 4px;
                    margin-right: 4px;
                    background-color: themed('badge-background-skyblue');
                }

                &.transaction {
                    padding: 0 8px;

                    &:hover {
                        background-color: themed('behaviors-hover-color');
                    }

                    &:active {
                        background-color: themed('behaviors-press-color');
                    }
                }
            }
        }
    }
}
</style>
