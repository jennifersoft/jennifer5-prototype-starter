<template>
    <div class="statistic-search-condition">
        <div class="content">
            <div class="item">
                <span class="name">{{i18nSearchRange}}</span>
                <span class="value">{{searchDateOrMonth}}</span>
            </div>
            <div class="item">
                <span class="name">{{i18n.domain}}</span>
                <span class="value domain">{{domainName}}</span>
            </div>
            <div class="item">
                <span class="name">{{i18n.operatingTime}}</span>
                <span class="value worktime">{{searchCondition.operateTime}}</span>
            </div>
            <div class="item target-list" :class="{on: isShowTooltip}">
                <span class="name">{{otypeName}}</span>
                <span class="value instance" :title="instanceNamesText"ref="instanceNames">{{instanceNamesText}}</span>
<!--                <i class="icon-info-message" :tooltip="instanceNamesText"></i>-->
            </div>
            <div class="item">
                <span class="name">{{i18nPeakCondition}}</span>
                <span class="value">{{peakTimeCondition}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from "vuex";
    import { OTypeDef } from "@common/definition";
    import { i18n } from "@common/utility";
    import { PAGE_TYPE } from "@entry/statistics/common/common";

    const {mapGetters, mapState} = createNamespacedHelpers("statistics");

    export default {
        name: "searchConditionValues",
        inject: {
            pageType: {
                default: PAGE_TYPE.DAILY,
            },
            otype: {
                default: OTypeDef.SYSTEM,
            },
        },
        data() {
            return {
                instanceBoxWidth: 0,
                i18n: {
                    domain: i18n.get('ui.label.domain'),
                    operatingTime: i18n.get('ui.label.operatingTime'),
                    instance: i18n.get('ui.label.instance'),
                    business: i18n.get('ui.label.business'),
                }
            }
        },
        watch: {
            instanceNamesText() {
                this.$nextTick(() => {
                    this.instanceBoxWidth = this.$refs.instanceNames.clientWidth;
                })
            }
        },
        computed: {
            peakTimeCondition () {
              return i18n.get('ui.mx.'+this.searchCondition.metricByPeakTimeCondition)
            },

            ...mapGetters({
                searchCondition : 'searchCondition',
                searchTimeInDaily: 'searchTimeInDaily',
                searchTimeInMonthly: 'searchTimeInMonthly',
                searchTimeInPeriod: 'searchTimeInPeriod',
            }),

            ...mapState([
                'domainName'
            ]),

            instanceNamesText() {
                return this.searchCondition.names.join(',');
            },

            isShowTooltip() {
                return this.instanceBoxWidth > 220;
            },

            i18nSearchRange() {
                let result;
                if(this.pageType === PAGE_TYPE.DAILY) result = i18n.get('ui.label.search.date');
                else if(this.pageType === PAGE_TYPE.MONTHLY) result = i18n.get('ui.label.search.month');
                else if(this.pageType === PAGE_TYPE.PERIOD) result = i18n.get('ui.label.template.searchTerm');

                return result;
            },

            i18nPeakCondition() {
                let result;
                if(this.pageType === PAGE_TYPE.DAILY) result = i18n.get('ui.label.peakTimeCondition');
                else result = i18n.get('ui.label.peakDayCondition');

                return result;
            },

            searchDateOrMonth() {
                let result;
                if(this.pageType === PAGE_TYPE.DAILY) result = this.searchTimeInDaily.dateInFormat;
                else if(this.pageType === PAGE_TYPE.MONTHLY) result = this.searchTimeInMonthly.dateInYYMM;
                else if(this.pageType === PAGE_TYPE.PERIOD) result = this.searchTimeInPeriod.startDateInFormat + " ~ " + this.searchTimeInPeriod.endDateInFormat;

                return result;
            },

            otypeName() {
                return (this.otype === OTypeDef.BUSINESS)? this.i18n.business : this.i18n.instance;
            }
        }
    };
</script>

<style lang="scss" scoped>
@import "~@entry/statistics/common/styles/info-box.scss";
.statistic-search-condition {
    @include info-box(48px, 0);
}
</style>