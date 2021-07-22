<template>
    <table class="table classic hover" ref="table">
        <thead>
        <tr>
            <th width="30%">{{ i18n.class }}</th>
            <th>{{ i18n.filePath }}</th>
        </tr>
        </thead>
        <tbody></tbody>
    </table>
</template>

<script>
import jui from 'juijs';
import TableComp from 'juijs-grid/src/components/xtable';

jui.use(TableComp);

const TEMPLATE_ROW = `<tr>
    <td><!= key !></td>
    <td><!= value !></td>
</tr>`;
export default {
    name: "JarcheckTable",
    inject: {
        i18n: {
            default: () => ({
                class: 'class',
                filePath: 'filePath',
            })
        }
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        height: {
            type: Number,
            required: true,
        }
    },
    watch: {
        list(next) {
            this.table.update(next);
        },
        height(next, prev) {
            if (next !== prev) {
                this.table.scrollHeight(next);
            }
        }
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            resize: true,
            tpl: {
                row: TEMPLATE_ROW,
            },
        });
        this.table.scrollHeight(this.height);
    }
}
</script>

<style lang="scss" scoped>
.table {
    ::v-deep tbody tr:first-child {
        font-weight: bold;
    }
}
</style>