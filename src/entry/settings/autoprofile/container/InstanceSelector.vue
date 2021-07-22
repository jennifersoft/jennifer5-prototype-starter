<template>
    <div class="instance-selector">
        <domain-group-selector
            @elementSelected="onSelectDomainGroup"
            :selectedOne="selectedOne"
            :domain-group-tree="domainList"
        ></domain-group-selector>
        <div class="separator"></div>
        <instance-bar
            :items="instanceList"
            :selected-item="instanceId"
            @select="onSelectInstance"
        ></instance-bar>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DomainGroupSelector from '@vuejs/component/Domain/DomainGroupSelector/DomainGroupSelector';
import InstanceBar from '../component/InstanceBar';
import { mapState, mapMutations, mapActions } from '../store/instanceSelector';

const baseStore = createNamespacedHelpers('domain');

export default {
    components: {
        DomainGroupSelector,
        InstanceBar,
    },
    computed: {
        ...baseStore.mapState(['domainList', 'selectedOne']),
        ...baseStore.mapGetters(['sidList']),
        ...mapState(['instanceList', 'instanceId', 'domainId']),
    },
    watch: {
        // 도메인그룹 박스 변경시
        sidList(newVal, oldVal) {
            if (newVal[0] === oldVal[0]) return;
            this.loadFirstInstanceData(newVal[0]);
        },
    },
    methods: {
        ...baseStore.mapMutations(['selectDomain']),
        ...baseStore.mapActions(['updateMultiDomainFlag']),
        ...mapMutations(['changeInstanceId', 'changeDomainId']),
        ...mapActions(['loadInstances']),
        onSelectDomainGroup(element) {
            this.selectDomain(element.treeIndex);
        },
        async onSelectInstance(instanceId) {
            this.changeInstanceId(instanceId);
            this.$emit('change', {
                domainId: this.domainId,
                instanceId,
            });
        },
        async loadFirstInstanceData(domainId) {
            this.changeDomainId(domainId);
            await this.loadInstances();
            this.$emit('change', {
                domainId,
                instanceId: this.instanceId,
            });
        },
    },
    async beforeMount() {
        this.updateMultiDomainFlag(false);
        this.loadFirstInstanceData(this.sidList[0]);
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.instance-selector {
    @include themify($themes) {
        width: 100%;
        padding: 16px;
        border-radius: 3px;
        border: 1px solid themed('instance-selector-border-color');
        box-shadow: themed('instance-selector-box-shadow');

        > .separator {
            width: 100%;
            height: 1px;
            margin: 16px 0 14px 0;
            background-color: themed('instance-selector-border-color');
        }
    }
}
</style>
