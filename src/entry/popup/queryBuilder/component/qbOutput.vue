<template>
    <div class="output" :style="{ height: height + 'px' }">
        <xtable
            ref="ui"
            v-if="tab == 'table'"
            :key="tableKey"
            :table-type="'simple headline nowrap'"
            :table-effect="''"
            :table-size="'small'"
            :table-width="width"
            :scroll-width="tableScrollWidth"
            :scroll-height="scrollHeight - 26"
            :columns="tableColumns"
            :data="tableRows"
            :template-row="tableRowTemplate"
            :row-height="22"
            :resize="true"
            :sort-type="'multi'"
        >
        </xtable>
        <div
            class="scroll"
            v-if="tab != 'table'"
            :style="{
                height: scrollHeight + 'px',
                'max-height': scrollHeight + 'px',
            }"
        >
            <pre
                v-if="tab == 'console'"
            ><div v-for="message in messages">{{ message }}</div></pre>
            <pre v-if="tab == 'json'">{{ prettyJsonString }}</pre>
        </div>
    </div>
</template>

<script>
import XTableComp from 'vue-sheets/src/components/xtable';

export default {
    components: {
        xtable: XTableComp,
    },
    props: {
        tab: {
            type: String,
            required: true,
        },
        columns: {
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
        messages: {
            type: Array,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        csvName: {
            type: String,
            required: true,
        },
    },
    watch: {
        columns(newVal) {
            let width = 0;
            let tpl = '';
            newVal.forEach(col => {
                width += col.name.length * 7;

                if (col.type == 'TIMESTAMP') {
                    tpl += `<td style="font-style: italic;"><!= getDayjs(${col.key}).format(serverDateFormat.longWithSec) !></td>`;
                } else if (col.type == 'BOOLEAN') {
                    tpl += `<td><input type="checkbox" style="cursor: default; opacity: 1;" disabled <!= ${col.key} ? 'checked' : '' !> /></td>`;
                } else if (
                    col.type == 'BIGINT' ||
                    col.type == 'INTEGER' ||
                    col.type == 'DOUBLE'
                ) {
                    tpl += `<td align="right"><!= ${col.key} !></td>`;
                } else if (col.type == 'CLOB' || col.type == 'BLOB') {
                    tpl += `<td>(${col.type})</td>`;
                } else {
                    tpl += `<td><!= ${col.key} !></td>`;
                }
            });

            this.tableRowTemplate = `<tr>${tpl}</tr>`;
            this.tableScrollWidth = width;
            this.tableKey += 1;
            this.tableRows = this.rows;
        },
    },
    computed: {
        scrollHeight() {
            return this.height - 40;
        },
        tableColumns() {
            return this.columns.map(col => {
                return {
                    key: col.key,
                    name: col.name,
                    sort: true,
                };
            });
        },
        prettyJsonString() {
            const newRows = this.rows.map(row => {
                return Object.values(row);
            });
            return JSON.stringify(newRows, null, 2);
        },
    },
    data() {
        return {
            tableKey: 0,
            tableRows: [],
            tableRowTemplate: '<tr></tr>',
            tableScrollWidth: 0,
        };
    },
};
</script>

<style lang="scss" scoped>
.output {
    margin-top: 1px;

    .scroll {
        overflow: auto;
        > pre {
            margin: 0;
        }
    }

    /deep/ .xtable th {
        border-top-width: 0px !important;

        &:first-child {
            border-top-left-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
            border-left-width: 0px !important;
        }
        &:last-child {
            border-top-right-radius: 0px !important;
            border-bottom-right-radius: 0px !important;
            border-right-width: 0px !important;
        }
    }
}
</style>
