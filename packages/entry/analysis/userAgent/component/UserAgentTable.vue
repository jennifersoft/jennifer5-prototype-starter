<template>
    <div id="userAgentTable" class="xtable" ref="table">
        <table class="table simple headline stripeless table hover">
            <thead>
                <tr>
                    <th width="50%">
                        {{ i18n[dataType] }}
                    </th>
                    <th>
                        {{ i18n.hit }}
                        <i
                            class="icon-arrow1"
                            style="position: static; float: right; margin-left: -20px;"
                        ></i>
                    </th>
                    <th>{{ i18n.responseTime }}({{ i18n.ms }})</th>
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

const TEMPLATE_ROW = `<tr>
    <td><!= key !></td>
    <td align="right"><!= hit.toLocaleForAries() !></td>
    <td align="right"><!= responseTime.toLocaleForAries() !></td>
</tr>`;

export default {
    name: 'UserAgentTable',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                browser: 'browser',
                os: 'os',
                device: 'device',
                hit: 'hit',
                responseTime: 'responseTime',
                ms: 'ms',
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
        dataType: {
            type: String,
            required: true,
            default: 'browser',
        },
    },
    watch: {
        list: {
            handler(next) {
                this.table.update(next);
            },
            immediate: false,
        },
        height(next) {
            this.table.scrollHeight(next);
            this.table.resize();
        },
    },
    methods: {
        onSortEnd(key, order) {
            this.$emit('sort-end', { key, order });
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: ['key', 'hit', 'responseTime'],
            resize: true,
            scrollHeight: self.scrollHeight,
            sort: [0, 1, 2],
            sortCache: true,
            // sortLoading: true,
            sortIndex: [1],
            sortOrder: 'desc',
            event: {
                sort: function(column, e) {
                    setSortEff(column, e, true);
                },
                sortEnd: function(column, _) {
                    const { name, order } = column;
                    self.onSortEnd(name, order);
                },
            },
            tpl: {
                row: TEMPLATE_ROW,
            },
        });
        this.table.scrollHeight(this.height);
    },
};
</script>

<style scoped></style>
