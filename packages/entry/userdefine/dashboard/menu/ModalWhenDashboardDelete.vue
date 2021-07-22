<template>
    <div class="modal-when-dashboard-delete">
        <modal
            :is-show="isShowDeleteConfirmWindow"
            :contents-width="300"
            :contents-height="50"
            @apply="deleteDashboard"
            @cancel="setDeleteDashboardKey(undefined)"
        >
            <template #subject>
                <span>{{ i18n.subject }}</span>
            </template>
            <div>
                <span>{{ i18n.contents }}</span> <br />
                <span>{{ i18n.subject }}</span>
            </div>
        </modal>
    </div>
</template>

<script>
import Modal from '@vuejs/component/window/Modal';
import { createNamespacedHelpers } from 'vuex';
import { deleteDashboard } from '@entry/userdefine/dashboardEdit/http';

const {
    mapGetters,
    mapState,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('dashboardMenus');

export default {
    name: 'ModalWhenDashboardDelete',
    components: {
        Modal,
    },
    inject: {
        i18n: {
            default: {
                subject: 'subject',
                contents: 'contents',
                apply: 'apply',
                cancel: 'cancel',
            },
        },
    },
    methods: {
        ...mapMutations(['removeUserDefinedMenu', 'setDeleteDashboardKey']),

        async deleteDashboard() {
            this.removeUserDefinedMenu(this.deleteDashboardKey);

            const params = { key: this.deleteDashboardKey };

            await deleteDashboard(params);

            this.moveIfCurrentDashboardRemoved();
        },

        moveIfCurrentDashboardRemoved() {
            const url = new URL(window.location.href);
            const urlSearchParams = new URLSearchParams(url.search);
            if (
                url.pathname === '/userdefine/dashboard' &&
                urlSearchParams.get('key') === this.deleteDashboardKey
            ) {
                document.location = '/userdefine/dashboard';
            }

            this.setDeleteDashboardKey(undefined);
        },
    },
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['isShowDeleteConfirmWindow']),
        ...mapState(['deleteDashboardKey']),
    },
};
</script>
<style lang="scss" scoped>
.modal-when-dashboard-delete {
}
</style>
