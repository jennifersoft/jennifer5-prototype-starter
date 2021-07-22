<template>
    <div class="message-tab">
        <simple-table
            :size="'normal'"
            :columns="tableColumns"
            :rows="messageRows"
            :row-template="tableRowTemplate"
            @click="onClickTableRow"
        ></simple-table>
    </div>
</template>

<script>
import SimpleTable from './SimpleTable';
import { mapState } from '../store/message';

export default {
    components: {
        SimpleTable,
    },
    inject: {
        i18n: {
            default: {
                no: 'No.',
                message: 'Message',
            },
        },
    },
    computed: {
        ...mapState({
            messageRows: state => state.messageRows,
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
                    key: 'message',
                    name: this.i18n.message,
                    width: 'auto',
                    sort: true,
                    active: true,
                },
            ],
            tableRowTemplate: `
                <tr><td class="profile"><!= no !></td><td title="<!= message !>"><!= message !></td></tr>
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
