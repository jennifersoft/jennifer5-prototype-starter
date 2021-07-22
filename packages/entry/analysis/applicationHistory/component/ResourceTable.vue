<template>
    <table ref="grid" class="table large stripeless nowrap">
        <thead>
            <tr>
                <th>{{ i18n.lastModified }}</th>
                <th>{{ i18n.resourceType }}</th>
                <th>{{ i18n.resourceStatus }}</th>
                <th width="50%">{{ i18n.resourceName }}</th>
                <th>{{ i18n.compareCode }}</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</template>

<script>
import jui from 'juijs-grid';
import Table from 'juijs-grid/src/components/table';
import XTable from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';
import BaseTable from './BaseTable';

jui.use(Table, XTable);

export default {
    inject: ['i18n'],
    mixins: [BaseTable],
    props: {
        filters: {
            type: Object,
            required: false,
            default: () => {
                return {
                    type: '',
                    name: '',
                };
            },
        },
    },
    watch: {
        filters(newVal) {
            if (newVal.type === '' && newVal.name === '') {
                this.tableObj.rollback();
            } else {
                this.tableObj.filter(d => {
                    const validType =
                        d.resourceTypeFormat === newVal.type.toUpperCase();
                    const validName =
                        d.resourceName.indexOf(newVal.name) !== -1;

                    if (newVal.type !== '' && newVal.name !== '')
                        return validType && validName;
                    else if (newVal.type !== '' && newVal.name === '')
                        return validType;
                    else if (newVal.type === '' && newVal.name !== '')
                        return validName;

                    return true;
                });
            }
        },
    },
    mounted() {
        this.tableObj = jui.create('grid.xtable', this.$refs.grid, {
            fields: [
                'lastModified',
                'resourceType',
                'resourceStatus',
                'resourceName',
                null,
            ],
            resize: true,
            sort: true,
            sortCache: true,
            sortLoading: true,
            scrollHeight: this.height,
            rowHeight: 35,
            data: this.rows,
            event: {
                sort: setSortEff,
                click: (row, e) => {
                    if (e.target.className === 'popup-btn') {
                        this.$emit('show-contents', row.data);
                    }
                },
            },
            tpl: {
                row: `<tr>
    <td><!= timeFormat !></td>
    <td><!= resourceTypeFormat !></td>
    <td align="center"><span class="resource-label <!= resourceStatusFormat.toLowerCase() !>"><!= resourceStatusFormat !></span></td>
    <td title="<!= resourceName !>"><!= resourceName !></td>
    <td align="center"><! if (existContents) { !><span class="popup-btn">${this.i18n.viewPopup}</span><! } !></td>
</tr>`,
            },
        });
    },
};
</script>
