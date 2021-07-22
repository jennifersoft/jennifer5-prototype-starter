<template>
    <div class="socket-tab">
        <simple-table
            :size="'normal'"
            :columns="tableColumns"
            :rows="socketRows"
            :row-template="tableRowTemplate"
            @click="onClickTableRow"
        ></simple-table>
    </div>
</template>

<script>
import SimpleTable from './SimpleTable';
import { mapState } from '../store/socket';

export default {
    components: {
        SimpleTable,
    },
    inject: {
        i18n: {
            default: {
                no: 'No.',
                mode: 'Mode',
                localIp: 'Local IP',
                remoteIp: 'Remote IP',
            },
        },
    },
    computed: {
        ...mapState({
            socketRows: state => state.socketRows,
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
                    key: 'localIp',
                    name: this.i18n.localIp,
                    width: 'auto',
                    sort: true,
                    active: true,
                },
                {
                    key: 'remoteIp',
                    name: this.i18n.remoteIp,
                    width: 'auto',
                    sort: true,
                    active: true,
                },
            ],
            tableRowTemplate: `
                <tr>
                    <td class="profile"><!= no !></td>
                    <td><!= mode !></td>
                    <td><!= localIp !></td>
                    <td><!= remoteIp !></td>
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
