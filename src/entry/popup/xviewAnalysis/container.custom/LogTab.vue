<template>
    <div class="log-tab">
        <textarea
            ref="textarea"
            :style="{ width: `${mainWidth}px`, height: `${mainHeight}px` }"
            :value="customLog"
            wrap="off"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            readonly
        ></textarea>
    </div>
</template>

<script>
import { mapState as baseMapState } from '../store/base';
import { mapState, mapActions } from '../store.custom/log';

export default {
    computed: {
        ...baseMapState({
            mainWidth: state => state.mainWidth - 32,
            mainHeight: state => state.mainHeight - 36,
            transactionRow: state => state.transactionRow,
        }),
        ...mapState({
            customLog: state => state.customLog,
        }),
    },
    methods: {
        ...mapActions(['loadCustomLog']),
    },
    created() {
        const { sid, instId, txid, collectionTime } = this.transactionRow;

        this.loadCustomLog({
            domainId: sid,
            instanceId: instId,
            transactionId: txid,
            collectionTime: collectionTime,
        });
    },
};
</script>

<style lang="scss" scoped>
@import '../style/PlainText.scss';

.log-tab {
    @include plain-text;
}
</style>
