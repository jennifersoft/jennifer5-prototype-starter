<template>
    <div class="app">
        <canvas-wrapper />
    </div>
</template>

<script>
import CanvasWrapper from '@entry/analysis/xview/container/CanvasWrapper';
import { mapActions, mapMutations } from 'vuex';
import { Instance } from '@service/oidConfig';

export default {
    inject: ['i18n'],
    components: {
        CanvasWrapper,
    },
    methods: {
        ...mapMutations('xviewAnalysis', [
            'updateStartTimeInSearchedCondition',
            'updateEndTimeInSearchedCondition',
            'updateMinResponseTimeInSearchedCondition',
            'clearTransactions',
            'openAdvancedSearchCondition',
        ]),
        ...mapActions('xviewAnalysis', [
            'fetchResource',
            'fetchTransaction',
            'updateResourceInSearchedCondition',
        ]),
    },
    async mounted() {
        const params = new URLSearchParams(location.search);
        const domainIds = params
            .get('domain_ids')
            .split(',')
            .map(Number);
        const startTime = Number(params.get('start_time'));
        const endTime = Number(params.get('end_time'));

        const instanceList = await Instance.get(domainIds, startTime, endTime);

        const oidList = domainIds.reduce((acc, domainId) => {
            acc[domainId] = instanceList
                .filter(
                    instance => instance.sid === domainId && instance.oid !== -1
                )
                .map(instance => instance.oid);
            return acc;
        }, {});

        this.updateStartTimeInSearchedCondition(startTime);
        this.updateEndTimeInSearchedCondition(endTime);
        this.updateResourceInSearchedCondition({
            oidList: oidList,
            otypeString: 'instance',
        });
        this.clearTransactions();
        this.fetchTransaction();
    },
};
</script>

<style lang="scss">
.app {
    box-sizing: border-box;
    padding: 20px;
    height: 100%;
    .canvas-wrapper {
        height: 100%;
    }
}
</style>
