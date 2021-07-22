<template>
    <div :class="['detail-table', tab]">
        <sheets-table
            resize
            :table-type="'nowrap'"
            :table-effect="tableEffect"
            :table-size="tableSize"
            :row-height="rowHeight"
            :data="rows"
            :columns="columns"
            :scroll-height="height"
            :template-row="rowTemplate"
        />
    </div>
</template>

<script>
import SheetsTable from 'vue-sheets/src/components/xtable';

export default {
    inject: ['i18n'],
    components: {
        SheetsTable,
    },
    props: {
        tab: {
            type: String,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            required: false,
            default: 300,
        },
    },
    computed: {
        tableEffect() {
            return this.tab === 'diskUsage' ? 'borderless vborderless' : '';
        },
        tableSize() {
            return this.tab === 'diskUsage' ? 'large' : 'normal';
        },
        rowHeight() {
            return this.tab === 'diskUsage' ? 35 : 27;
        },
        columns() {
            const columnMap = {
                file: [
                    {
                        key: 'no',
                        name: this.i18n.no,
                        width: '50px',
                        sort: true,
                    },
                    {
                        key: 'lastModified',
                        name: this.i18n.lastModified,
                        sort: true,
                    },
                    {
                        key: 'fileName',
                        name: this.i18n.fileName,
                        width: '30%',
                        sort: true,
                    },
                    {
                        key: 'mode',
                        name: this.i18n.mode,
                        sort: true,
                    },
                    {
                        key: 'size',
                        name: `${this.i18n.size} (${this.i18n.bytes})`,
                        sort: true,
                    },
                    {
                        key: 'clazz',
                        name: this.i18n.class,
                        sort: true,
                    },
                    {
                        key: 'serviceName',
                        name: this.i18n.serviceName,
                        width: '20%',
                        sort: true,
                    },
                ],
                diskUsage: [
                    {
                        key: 'fileSystem',
                        name: this.i18n.fileSystem,
                        width: '30%',
                        sort: true,
                    },
                    {
                        key: 'currentPercentage',
                        name: `${this.i18n.currentUsage} (%)`,
                        width: '20%',
                        sort: true,
                    },
                    {
                        key: 'freeSpace',
                        name: `${this.i18n.freeSpace} (${this.i18n.mb})`,
                        sort: true,
                    },
                    {
                        key: 'availableSpace',
                        name: `${this.i18n.availableSpace} (${this.i18n.mb})`,
                        sort: true,
                    },
                    {
                        key: 'currentUsage',
                        name: `${this.i18n.currentUsage} (${this.i18n.mb})`,
                        sort: true,
                    },
                    {
                        key: 'total',
                        name: `${this.i18n.total} (${this.i18n.mb})`,
                        sort: true,
                    },
                ],
            };

            return columnMap[this.tab];
        },
        rowTemplate() {
            const templateMap = {
                diskUsage: `<tr>
    <td title="<!= fileSystem !>"><!= fileSystem !></td>
    <td>
        <span class="bar-chart">
            <span class="percent"><span class="gauge" style="width: <!= currentPercentage !>%"></span></span>
            <span class="text"><!= currentPercentage !>%</span>
        </span>
    </td>
    <td align="right"><!= freeSpaceFormat !></td>
    <td align="right"><!= availableSpaceFormat !></td>
    <td align="right"><!= currentUsageFormat !></td>
    <td align="right"><!= totalFormat !></td>
</tr>`,
                file: `<tr>
    <td align="right"><!= no !></td>
    <td><!= lastModifiedFormat !></td>
    <td title="<!= fileName !>"><!= fileName !></td>
    <td><span class="focus <!= mode.toLowerCase() !>"><!= mode !></span></td>
    <td align="right"><!= sizeFormat !></td>
    <td><!= clazz !></td>
    <td title="<!= serviceName !>"><!= serviceName !></td>
</tr>`,
            };

            return templateMap[this.tab];
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-table {
    &.diskUsage {
        @import '~@entry/analysis/service/style/bar-chart-cell.scss';
        @include bar-chart-cell;
    }

    &.file {
        @import '../theme.scss';
        @include themify($themes) {
            ::v-deep tr {
                span.focus {
                    border-radius: 3px;
                    height: 18px;
                    padding: 0px 4px;
                    &.read {
                        background-color: themed('read-link-background-color');
                        color: themed('link-font-color');
                    }
                    &.write {
                        background-color: themed('write-link-background-color');
                        color: themed('link-font-color');
                    }
                }
            }
        }
    }
}
</style>
