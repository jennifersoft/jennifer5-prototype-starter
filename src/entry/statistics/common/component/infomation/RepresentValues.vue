<template>
    <div v-if="pageType === PAGE_TYPE.DAILY" class="statistics-representation daily">
        <div class="grid-row">
            <div class="grid-item">
                <span class="value">{{getAccumulatedNumber(totalData.today.visit_day).toLocaleForAries()}}</span>
                <span class="name">{{i18n.visitorDaily}}</span>
            </div>
            <div class="grid-item">
                <span class="value"> {{getAccumulatedNumber(totalData.todayWithOperateTime.service_count).toLocaleForAries()}}</span>
                <span class="name">{{i18n.operatingTime}} {{i18n.mxServiceCount}}</span>
            </div>
        </div>
        <div class="grid-row">
            <div class="grid-item">
                <span class="value event"> {{getAccumulatedNumber(totalData.todayWithOperateTime.event_count).toLocaleForAries()}}</span>
                <span class="name">{{i18n.operatingTime}} {{i18n.mxEventCount}}</span>
            </div>
            <div class="grid-item">
                <span class="value error"> {{getAccumulatedNumber(totalData.todayWithOperateTime.error_count).toLocaleForAries()}}</span>
                <span class="name">{{i18n.operatingTime}} {{i18n.mxErrorCount}}</span>
            </div>
        </div>
    </div>
    <div v-else class="statistics-representation period">
        <div class="grid-row">
            <div class="grid-item">
                <div class="value-group">
                    <span class="time">{{peakDateByMaxVisitor}}</span>
                    <span class="value">{{getAccumulatedNumber(visitorCount).toLocaleForAries()}}</span>
                </div>
                <span class="name">{{i18nMaxVisitor}}</span>
            </div>
            <div class="grid-item">
                <div class="value-group">
                    <span class="time">{{peakDateByMaxServiceCount}}</span>
                    <span class="value">{{getAccumulatedNumber(serviceCount).toLocaleForAries()}}</span>
                </div>
                <span class="name">{{i18nMaxCallCount}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from "vuex";
    import { i18n } from "@common/utility";
    import { PAGE_TYPE } from "@entry/statistics/common/common";
    import { getDayjs, serverDateFormat } from "@common/base";

    const {mapGetters, mapState} = createNamespacedHelpers("statistics");

    const TICK_COUNT = 12;
    export default {
        name: "representValues",
        inject: {
            pageType: {
                default: PAGE_TYPE.DAILY,
            },
        },
        data() {
            return {
                i18n: {
                    visitorDaily: i18n.get('ui.label.visitor.daily'),
                    operatingTime: i18n.get('ui.label.operatingTime'),
                    mxServiceCount: i18n.get('ui.mx.service_count'),
                    mxEventCount: i18n.get('ui.mx.event_count'),
                    mxErrorCount: i18n.get('ui.mx.error_count'),
                },
                PAGE_TYPE: PAGE_TYPE,
                serverDateFormat: serverDateFormat,
                tick: 0,
            }
        },
        computed: {
            ...mapGetters({
                totalData : 'totalData',
                searchCondition : 'searchCondition',
                peakData : 'peakData',
            }),
            i18nMaxVisitor() {
                return (this.pageType === PAGE_TYPE.MONTHLY)? i18n.get('ui.label.maxMonthlyVisitors') :  i18n.get('ui.label.maxPeriodVisitors');
            },
            i18nMaxCallCount() {
                return (this.pageType === PAGE_TYPE.MONTHLY)? i18n.get('ui.label.maxMonthlyCalls') :  i18n.get('ui.label.maxPeriodCalls');
            },
            peakDateByMaxVisitor() {
                return getDayjs(this.peakData.daily.visit_day.date).format(serverDateFormat.short);
            },
            peakDateByMaxServiceCount() {
                return getDayjs(this.peakData.operation.service_count.date).format(serverDateFormat.short);
            },
            visitorCount() {
                return (this.peakData.daily.visit_day.visit_day < 0)? 0 : this.peakData.daily.visit_day.visit_day;
            },
            serviceCount() {
                return this.peakData.operation.service_count.service_count;
            },

        },
        methods: {
            getAccumulatedNumber(val) {
                if (this.tick === this.TICK_COUNT) return (val / this.TICK_COUNT * this.tick);
                return Math.floor(val / this.TICK_COUNT) * this.tick;
            }
        },
        mounted() {
            this.TICK_COUNT = TICK_COUNT;
            const timeout = setInterval(() => {
                if (this.tick === this.TICK_COUNT) {
                    clearInterval(timeout);
                    return;
                }
                this.tick += 1;
            }, 95);
        }
    };
</script>
<style lang="scss" scoped>
@import "~@common/scss/themes.scss";

$themes: (
    classic: (
        typography-color-primary: #212121,
        typography-color-grey1: #616161,
        border-color: #e8e8e8,
    ),
    dark: (
        typography-color-primary: #e8e8e8,
        typography-color-grey1: #999999,
        border-color: #4e4e4e,
    ),
);

.statistics-representation {
    @include themify($themes) {
        box-sizing: border-box;
        height: 242px;
        display: flex;
        flex-direction: column;
        border: 1px solid themed('border-color');
        border-radius: 4px;

        &.daily {
            > :first-child {
                border-bottom: 1px solid themed('border-color');
            }
        }

        .grid-row {
            flex: 1;
            display: flex;
            > .grid-item {
                flex: 1;
                padding-top: 16px;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                word-break: keep-all;
                text-align: center;

                &:first-child {
                    border-right: 1px solid themed('border-color');
                }

                .name {
                    color: themed('typography-color-grey1');
                    font-size: 14px;
                    width: 140px;
                }

                .value {
                    color: themed('typography-color-primary');
                    font-size: 20px;
                    font-weight: bold;
                    &.event {
                        color: #fa9d0d;
                    }
                    &.error {
                        color: #ff4f55;
                    }
                }

                .value-group {
                    display: flex;
                    padding : 22px 0;
                    flex-basis: 92px;
                    flex-direction: column;
                    justify-content: space-evenly;
                    align-items: center;
                    .time {
                        font-size: 14px;
                        color: themed('typography-color-primary');
                    }
                }
            }
        }
    }
}

</style>