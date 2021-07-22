<template>
    <div class="topbar-sync-box" :class="{ inactive: notUseTopbarInDashboard }">
        <Checkbox
            @change="onClickCheckBox"
            v-model="isDomainBarSync"
            :disabled="notUseTopbarInDashboard"
        />
        <span class="message"> {{ i18n.topbarSync }} </span>
    </div>
</template>

<script>
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';
import { TOPBAR_TYPES } from '@entry/userdefine/dashboardEdit/const';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);

export default {
    name: 'topbarSyncInChartConfigure',
    components: {
        Checkbox,
    },
    props: {},
    data() {
        return {
            i18n: {
                topbarSync: i18n.get('ui.label.topbar.sync'),
            },
        };
    },
    methods: {
        ...mapMutations(['setTopbarSyncOnEditingChart']),

        onClickCheckBox() {
            this.setTopbarSyncOnEditingChart(!this.isDomainBarSync);
        },
    },
    computed: {
        ...mapState(['topbar', 'editingChartOptions']),

        isDomainBarSync() {
            return this.editingChartOptions.domainBarSync;
        },

        notUseTopbarInDashboard() {
            return this.topbar === TOPBAR_TYPES.NONE;
        },
    },

    mounted() {},
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
div.topbar-sync-box {
    @include themify($themes) {
        display: flex;
        align-items: center;
        height: 32px;

        &.inactive {
            opacity: 0.5;

            input[type='checkbox'] {
                cursor: default;
            }
        }

        .message {
            margin-left: 8px;
            font-size: 14px;
            line-height: 14px;
            height: 14px;
            color: themed('edit-component-title2-color');
        }
    }
}
</style>
