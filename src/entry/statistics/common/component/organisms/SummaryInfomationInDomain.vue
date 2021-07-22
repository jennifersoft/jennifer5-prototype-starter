<template>
    <div class="statistics-info-wrapper">
        <search-condition-values />
        <represent-values />
        <peak-values />
    </div>
</template>

<script>
    import { PAGE_TYPE } from "@entry/statistics/common/common";
    import { OTypeDef } from "@common/definition";
    import { createNamespacedHelpers } from "vuex";
    import VueSearchCondition from "@entry/statistics/common/component/infomation/SearchConditionValues";
    import VueRepresentValues from "@entry/statistics/common/component/infomation/RepresentValues";
    import VuePeakValues from "@entry/statistics/common/component/infomation/PeakValues";

    const {mapGetters, mapState, mapMutations} = createNamespacedHelpers("statistics");

    export default {
        name: "summaryInfomationInDomain",
        inject: {
            pageType: {
                default: PAGE_TYPE.DAILY,
            },
            otype: {
                default: OTypeDef.SYSTEM
            }
        },
        components: {
            searchConditionValues: VueSearchCondition,
            representValues: VueRepresentValues,
            peakValues: VuePeakValues,
        },
        data() {
            return {
                PAGE_TYPE: PAGE_TYPE,
            };
        },
        computed: {
            ...mapState({
                domainId : 'domainId',
            }),
        },
    };
</script>

<style lang="scss" scoped>
.statistics-info-wrapper {
    display: flex;
    > * {
        flex: 1;
        &:not(:last-child) {
            margin-right: 16px;
        }
    }
}
</style>