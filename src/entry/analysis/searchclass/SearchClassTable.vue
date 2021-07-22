<template>
    <table class="table classic hover" ref="table">
        <thead>
        <tr>
            <th>{{ i18n.jarFileName }}</th>
            <th>{{ i18n.path }}</th>
            <th>{{ i18n.className }}</th>
            <th>{{ i18n.jarFileModifiedTime }}</th>
        </tr>
        </thead>
        <tbody></tbody>
    </table>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import {setSortEff} from "@common/utility";
import {TEMPLATE_ROW} from "@entry/analysis/searchclass/template";

jui.use(XTableComp);

export default {
    name: "SearchClassTable",
    inject: {
        i18n: {
            default: () => ({
                jarFileName: 'jarFileName',
                path: 'path',
                className: 'className',
                jarFileModifiedTime: 'jarFileModifiedTime',
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
            fields: ['jarFileName', 'directory', 'className', 'lastModified'],
            sort: true,
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
    }
}
</script>

<style scoped>

</style>