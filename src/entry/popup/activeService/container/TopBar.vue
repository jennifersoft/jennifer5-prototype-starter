<template>
    <div class="header">
        <popup-title :title="i18n.activeService" :link="'popup_activeService'">
        </popup-title>
        <top-bar
            v-if="useTopBar"
            :type="'agent'"
            :use-multi-domain="true"
            :use-multi-instance="true"
            :batchjob-mode="batchJobMode"
            :domain-ids="domainIds"
            :instance-oids="instanceOids"
            :top-on-content="false"
            @change="onChangeTopBar"
        ></top-bar>
    </div>
</template>

<script>
import { DomainBarBatchjobModeDef } from '@common/definition';
import TopBar from '@vuejs/container/topbar/TopBar';
import PopupTitle from '../component/PopupTitle';
import { getDomainAndInstanceInfo } from '../utility';
import { mapState, mapMutations } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        PopupTitle,
        TopBar,
    },
    data() {
        return {
            batchJobMode: DomainBarBatchjobModeDef.BATCHJOB_EXCLUDE,
        };
    },
    computed: {
        ...mapState({
            domainIds: state => state.domainIds,
            instanceOids: state => state.instanceOids,
            useTopBar: state => {
                return (
                    !state.isIncoming && !state.isOutgoing && !state.isGroupNode
                );
            },
        }),
    },
    methods: {
        ...mapMutations(['toggleUseServiceDump']),
        onChangeTopBar() {
            const { instanceOids } = getDomainAndInstanceInfo();
            this.toggleUseServiceDump(instanceOids.length === 1);
        },
    },
};
</script>

<style lang="scss" scoped>
.header {
}
</style>
