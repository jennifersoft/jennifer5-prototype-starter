<template>
    <div class="app">
        <detail-code :use-popup="false"></detail-code>
    </div>
</template>

<script>
import DetailCode from '@entry/analysis/loadedClasses/container/DetailCode';
import { mapMutations } from '@entry/analysis/loadedClasses/store/loadedClasses';

export default {
    components: {
        DetailCode,
    },
    props: {
        className: {
            type: String,
            required: true,
        },
        domainId: {
            type: Number,
            required: true,
        },
        instanceOid: {
            type: Number,
            required: true,
        },
    },
    methods: {
        ...mapMutations(['updateDetailName', 'updateTargetData']),
    },
    beforeMount() {
        this.updateDetailName(this.className);
        this.updateTargetData({
            domainId: this.domainId,
            instanceOid: this.instanceOid,
        });
    },
};
</script>

<style lang="scss" scoped>
.app {
    display: inline;
}
</style>
