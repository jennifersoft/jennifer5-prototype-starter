<template>
    <div class="back-button">
        <div class="left">
            <svg-icon
                :icon-type="iconType"
                :width="iconSize"
                :height="iconSize"
                @click.native="backToScreenMode"
            ></svg-icon>
        </div>
        <div class="right">
            <template v-if="parentName !== null">
                {{ parentName }} >&nbsp;<strong>{{
                    selectedDomain.shortName
                }}</strong>
            </template>
            <template v-else>{{ selectedDomain.shortName }}</template>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapMutations } from '../vuex';
import { createFullName, createNameMap } from '../../base/utility';

export default {
    components: {
        SvgIcon,
    },
    data() {
        return {
            iconType: ICON_TYPE.arrowBack,
            iconSize: 20,
        };
    },
    computed: {
        ...mapState({
            domainGroupTree: state => state.domainGroupTree,
            selectedDomain: state => state.selectedDomain,
        }),
        parentName() {
            const nameMap = createNameMap(this.domainGroupTree);
            const treeIndex = this.selectedDomain.parentIndex;
            if (treeIndex)
                return createFullName(treeIndex, [nameMap[treeIndex]], nameMap);
            return null;
        },
    },
    methods: {
        ...mapMutations(['backToScreenMode']),
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.back-button {
    @include themify($themes) {
        display: flex;
        padding-top: 5px;
        height: 24px;
        > div {
            display: inline-flex;

            &.left {
                color: themed('back-button-background-color');
                cursor: pointer;
                margin-right: 24px;
                margin-left: -6px;
            }
            &.right {
                font-size: 12px;
                font-weight: normal;
                > strong {
                    font-size: 16px;
                    margin-top: -4px;
                }
            }
        }
    }
}
</style>
