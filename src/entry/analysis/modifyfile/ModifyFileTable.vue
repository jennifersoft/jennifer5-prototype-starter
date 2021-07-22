<template>
    <table class="table classic hover" ref="table">
        <thead>
            <tr>
                <th width="50px">{{ i18n.no }}</th>
                <th>{{ i18n.fileName }}</th>
                <th>{{ i18n.path }}</th>
                <th>{{ i18n.modificationTime }}</th>
                <th>{{ i18n.size }} ({{ i18n.bytes }})</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';

jui.use(XTableComp);

const TEMPLATE_ROW = `<tr>
    <td><!= row.seq.toLocaleForAries() !></td>
    <td><!= fileName !></td>
    <td><!= directory !></td>
    <td><!= timestamp !></td>
    <td><!= size.toLocaleForAries() !></td>
</tr>`;

export default {
    name: 'ModifyFileTable',
    inject: {
        i18n: {
            default: () => ({
                no: 'no',
                fileName: 'fileName',
                path: 'path',
                modificationTime: 'modificationTime',
                size: 'size',
                bytes: 'bytes',
            }),
        },
    },
    props: {
        list: {
            type: Array,
            default: () => [],
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
            if (next !== prev) {
                this.table.scrollHeight(next);
            }
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: [null, 'fileName', 'directory', 'lastModified', 'size'],
            sort: [1, 2, 3, 4],
            resize: true,
            event: {
                sort: function(column, e) {
                    setSortEff(column, e, true);
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
