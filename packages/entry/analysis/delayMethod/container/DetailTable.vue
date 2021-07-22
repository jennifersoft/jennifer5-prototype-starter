<template>
    <div class="detail-table">
        <sheets-table
            resize
            :table-type="'nowrap'"
            :table-effect="'hover borderless vborderless'"
            :table-size="'large'"
            :data="rows"
            :columns="columns"
            :scroll-height="height"
            :template-row="rowTemplate"
            :row-height="35"
        />
    </div>
</template>

<script>
import SheetsTable from 'vue-sheets/src/components/xtable';
import { mapState } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        SheetsTable,
    },
    computed: {
        ...mapState({
            height: state => state.tableHeight,
            rows: state => state.tableRows,
        }),
    },
    data() {
        return {
            columns: [
                {
                    key: 'method',
                    name: this.i18n.method,
                    width: '70%',
                    sort: true,
                },
                {
                    key: 'callCount',
                    name: this.i18n.callCount,
                    sort: true,
                },
                {
                    key: 'percentage',
                    name: this.i18n.rate,
                    width: '20%',
                    sort: true,
                },
            ],
            rowTemplate: `<tr>
    <td title="<!= method !>"><!= method !></td>
    <td align="right"><!= callCountFormat !></td>
    <td>
        <span class="bar-chart">
            <span class="percent"><span class="gauge" style="width: <!= percentage !>%"></span></span>
            <span class="text"><!= percentageFormat !></span>
        </span>
    </td>
</tr>`,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/analysis/service/style/bar-chart-cell.scss';

.detail-table {
    @include bar-chart-cell;
}
</style>
