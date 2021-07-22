<template>
    <div class="xtable" ref="table">
        <table class="table simple headline hover stripeless count-table">
            <thead>
                <tr>
                    <th>{{ i18n.eventLevel }}</th>
                    <th>{{ i18n.time }}</th>
                    <th>{{ i18n.target }}</th>
                    <th>{{ i18n.eventType }}</th>
                    <th>{{ i18n.count }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { i18n, setSortEff } from '@common/utility';

jui.use(XTableComp);

const TEMPLATE_ROW_COUNT = `
<! if(eventLevelName == "FATAL") { !>
<tr style="font-weight: bold;">
    <td><i class="status-badge fatal"></i>
<! } else if(eventLevelName == "WARNING") { !>
<tr >
    <td><i class="status-badge warning"></i>
<! } else { !>
<tr>
    <td><i class="status-badge normal"></i>
<! } !>
    <!= eventLevelName !></td>
    <td><!= timeConverted !></td>
    <td><!=	nameWithDomain !></td>
    <td><!=	errorTypeNameWithUnit !></td>
    <td align="right"><!= count.toLocaleForAries() !> </td>
</tr>`;

export default {
    name: 'DbEventCountTable',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                time: 'time',
                domain: 'domain',
                target: 'target',
                eventType: 'eventType',
                eventLevel: 'eventLevel',
                count: 'count',
                message: 'message',
                value: 'value',
                transaction: 'transaction',
                application: 'application',
            }),
        },
    },
    props: {
        list: {
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    watch: {
        list(next) {
            this.table.update(next);
        },
        height(next, prev) {
            if (!!this.$refs.table && next !== prev)
                this.table.scrollHeight(next);
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: [
                'eventLevelName',
                'time',
                'name',
                'errorTypeName',
                'count',
            ],
            resize: true,
            rowHeight: 25,
            sort: true,
            sortCache: true,
            event: {
                sort: function(column, e) {
                    setSortEff(column, e, true);
                },
            },
            tpl: {
                row: TEMPLATE_ROW_COUNT,
            },
        });
        this.table.scrollHeight(this.height);
    },
};
</script>

<style lang="scss" scoped>
@import "~@entry/analysis/dbmetrics/event/styles/table-style.scss";
.count-table ::v-deep {
    @include table-style;
}
</style>
