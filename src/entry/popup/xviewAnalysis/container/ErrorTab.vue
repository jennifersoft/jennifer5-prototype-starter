<template>
    <div class="error-tab">
        <simple-table
            :size="'normal'"
            :columns="tableColumns"
            :rows="errorRows"
            :row-template="tableRowTemplate"
            @click="onClickTableRow"
        ></simple-table>
    </div>
</template>

<script>
import SimpleTable from './SimpleTable';
import { mapState } from '../store/error';

export default {
    components: {
        SimpleTable,
    },
    inject: {
        i18n: {
            default: {
                relatedProfileNo: 'Related Profile No.',
                message: 'Message',
                errorType: 'Error Type',
            },
        },
    },
    computed: {
        ...mapState({
            errorRows: state => state.errorRows,
        }),
    },
    data() {
        return {
            tableColumns: [
                {
                    key: 'errorName',
                    name: this.i18n.errorType,
                    width: '200px',
                    sort: true,
                    active: true,
                },
                {
                    key: 'detailMessage',
                    name: this.i18n.message,
                    width: '60%',
                    sort: true,
                    active: true,
                },
                {
                    key: 'profileIndex',
                    name: this.i18n.relatedProfileNo,
                    width: 'auto',
                    sort: false,
                    active: true,
                },
            ],
            tableRowTemplate: `
                <tr>
                    <td><!= errorName !></td>
                    <td title="<!= detailMessage !>"><!= detailMessage !></td>
                    <! if (profileIndex !== -1) { !>
                    <td class="profile"><!= profileIndex !></td>
                    <! } else { !>
                    <td></td>
                    <! } !>
                </tr>
            `,
        };
    },
    methods: {
        onClickTableRow(row, e) {
            if (e.target.className === 'profile') {
                this.$emit('search-profile', row.data.profileIndex);
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
