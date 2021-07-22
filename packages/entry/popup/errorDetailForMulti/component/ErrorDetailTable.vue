<template>
    <div id="errorTableList" class="xtable nowrap" ref="table">
        <table class="table simple headline stripeless hover">
            <thead>
                <tr>
                    <th>{{ i18n.time }}</th>
                    <th>{{ i18n.domain }}</th>
                    <th>{{ i18n.target }}</th>
                    <th>{{ i18n.errorType }}</th>
                    <th>{{ i18n.message }}</th>
                    <th>{{ i18n.value }}</th>
                    <th>{{ i18n.transaction }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';
import { TEMPLATE_ROW } from "@entry/popup/errorDetailForMulti/templates";

jui.use(XTableComp);

export default {
    name: 'ErrorDetailTable',
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        height: {
            type: Number,
            default: 580,
        },
        rows: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        height(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.table.scrollHeight(newVal);
            this.table.resize();
        },
        rows(next) {
            this.table.update(next);
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', this.$refs.table, {
            fields: [
                'time',
                'domainName',
                'name',
                'errorTypeName',
                'detailMessage',
                'value',
                null,
            ],
            resize: true,
            sort: [0, 1, 2, 3, 4, 5],
            sortCache: true,
            sortLoading: true,
            scrollHeight: this.height,
            event: {
                select: (row, e) => self.$emit('click', row, e),
                sort: (column, e) => setSortEff(column, e, true),
            },
            tpl: {
                row: TEMPLATE_ROW,
            },
        });
        this.table.update(this.rows);
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.table {
    ::v-deep tbody tr {
        @include themify($themes) {
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
