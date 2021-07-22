<template>
    <div class="tool-bar">
        <btn
            class="border-none"
            normal
            :items="[{ text: i18n.domainGroupManagement }]"
            :pressed="activeDomainGroupWindow"
            @click="() => (activeDomainGroupWindow = !activeDomainGroupWindow)"
        ></btn>
        <btn
            class="border-none"
            normal
            icon-first
            :items="[{ text: i18n.newDomain, iconType: iconTypes.add }]"
            @click="addDetailDomain"
        ></btn>
        <div class="splitter"></div>
        <btn
            class="border-none"
            normal
            icon-first
            :disabled="checkedDomainIds.size === 0"
            :items="[{ iconType: iconTypes.trashcan }]"
            @click="removeCheckedDomainList"
        ></btn>
        <domain-group-window
            @cancel="() => (activeDomainGroupWindow = false)"
            v-if="activeDomainGroupWindow"
        ></domain-group-window>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import DomainGroupWindow from './DomainGroupWindow';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        DomainGroupWindow,
    },
    computed: {
        ...mapState({
            checkedDomainIds: state => state.checkedDomainIds,
        }),
    },
    data() {
        return {
            iconTypes: {
                add: ICON_TYPE.add,
                trashcan: ICON_TYPE.trashcan,
            },
            activeDomainGroupWindow: false,
        };
    },
    methods: {
        ...mapMutations(['addDetailDomain']),
        ...mapActions(['removeCheckedDomainList']),
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.tool-bar {
    @include themify($themes) {
        position: absolute;
        right: 24px;
        top: 14px;

        > .splitter {
            display: inline-block;
            margin: 0 6px -6px 6px;
            width: 1px;
            height: 16px;
            background: themed('common-border-color');
        }
    }
}
</style>
