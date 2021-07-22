<template>
    <div class="file-tab">
        <simple-table
            :size="'normal'"
            :columns="tableColumns"
            :rows="fileRows"
            :row-template="tableRowTemplate"
            @click="onClickTableRow"
        ></simple-table>
    </div>
</template>

<script>
import SimpleTable from './SimpleTable';
import { mapState } from '../store/file';

export default {
    components: {
        SimpleTable,
    },
    inject: {
        i18n: {
            default: {
                no: 'No.',
                mode: 'Mode',
                fileName: 'File Name',
            },
        },
    },
    computed: {
        ...mapState({
            fileRows: state => state.fileRows,
        }),
    },
    data() {
        return {
            tableColumns: [
                {
                    key: 'no',
                    name: this.i18n.no,
                    width: '40px',
                    sort: false,
                    active: true,
                },
                {
                    key: 'mode',
                    name: this.i18n.mode,
                    width: 'auto',
                    sort: true,
                    active: true,
                },
                {
                    key: 'name',
                    name: this.i18n.fileName,
                    width: '80%',
                    sort: true,
                    active: true,
                },
            ],
            tableRowTemplate: `
                <tr>
                    <td class="profile"><!= no !></td>
                    <td><!= mode !></td>
                    <td title="<!= name !>"><!= name !></td>
                </tr>
            `,
        };
    },
    methods: {
        onClickTableRow(row, e) {
            if (e.target.className === 'profile') {
                this.$emit('search-profile', row.data.no);
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
