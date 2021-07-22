<template>
    <div class="statistics-peak-status">
        <div class="title">
            <span>{{peakHourOrDay}}</span>
            <span class="caption">{{i18nPeakTimeOrDay}}</span>
        </div>
        <div class="content">
            <div class="item">
                <span class="name">{{i18nVisitor}}</span>
                <span class="value score">{{visitorCount.toLocaleForAries()}}</span>
            </div>
            <div class="item">
                <span class="name">{{i18nServiceCount}}</span>
                <span class="value score">{{serviceCount.toLocaleForAries()}}</span>
            </div>
            <div class="item">
                <span class="name">{{i18nServiceTime}}</span>
                <span class="value score">{{serviceTime.toLocaleForAries()}}</span>
            </div>
            <div class="item">
                <span class="name">{{i18nServiceRate}}</span>
                <span class="value score">{{serviceRate.toLocaleForAries()}}</span>
            </div>
            <div class="item">
                <span class="name">{{i18nEventCount}} {{descriptionIfSystem}}</span>
                <span class="value score" v-html="eventCountString"></span>
            </div>
            <div class="item">
                <span class="name">{{i18nErrorCount}}</span>
                <span class="value score">{{errorCountString}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from "vuex";
    import { i18n } from "@common/utility";
    import { PAGE_TYPE } from "@entry/statistics/common/common";
    import { OTypeDef } from "@common/definition";
    import { getDayjs, serverDateFormat } from "@common/base";

    const {mapGetters, mapState} = createNamespacedHelpers("statistics");

    export default {
        name: "peakValues",
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
                i18nPeakTimeOrDay: (this.pageType === PAGE_TYPE.DAILY)? i18n.get('ui.label.peakTime') : i18n.get('ui.label.peakDay'),
                i18nVisitor: (this.pageType === PAGE_TYPE.DAILY)? i18n.get('ui.label.visitHour') : i18n.get('ui.label.visitor.daily'),
                i18nServiceCount: (this.pageType !== PAGE_TYPE.PERIOD) ? i18n.get('ui.mx.service_count') : i18n.get('ui.label.operatingTime') + " " + i18n.get('ui.mx.service_count'),
                i18nServiceTime: (this.pageType !== PAGE_TYPE.PERIOD) ? i18n.get('ui.mx.service_time') : i18n.get('ui.label.operatingTime') + " " + i18n.get('ui.mx.service_time'),
                i18nServiceRate: (this.pageType !== PAGE_TYPE.PERIOD) ? i18n.get('ui.mx.service_rate') : i18n.get('ui.label.operatingTime') + " " + i18n.get('ui.mx.service_rate'),
                i18nEventCount: (this.pageType !== PAGE_TYPE.PERIOD) ? i18n.get('ui.mx.event_count') : i18n.get('ui.label.operatingTime') + " " + i18n.get('ui.mx.event_count'),
                i18nErrorCount: (this.pageType !== PAGE_TYPE.PERIOD) ? i18n.get('ui.mx.error_count') : i18n.get('ui.label.operatingTime') + " " + i18n.get('ui.mx.error_count'),
                PAGE_TYPE: PAGE_TYPE,
                serverDateFormat: serverDateFormat,
            }
        },
        computed: {
            ...mapGetters({
                searchCondition : 'searchCondition',
                peakData : 'peakData',
            }),


            descriptionIfSystem() {
                return (this.otype === OTypeDef.BUSINESS)? "" : i18n.get('ui.label.domain.instance');
            },

            eventCountString() {
                const peakData = (this.pageType === PAGE_TYPE.DAILY) ? this.peakData : this.operationPeakDataByMetrics;

                if(peakData.event_count === undefined) return "";

                let eventCount = peakData.event_count.toLocaleForAries();
                if(this.otype === OTypeDef.SYSTEM) eventCount += "<span class='division'> | </span>" + peakData.instance_event_count.toLocaleForAries();

                return eventCount;
            },

            errorCountString() {
                const peakData = (this.pageType === PAGE_TYPE.DAILY) ? this.peakData : this.operationPeakDataByMetrics;

                if(peakData.error_count === undefined) return "";

                // let errorCount = peakData.error_count.toLocaleForAries();
                // if(this.otype === OTypeDef.SYSTEM) errorCount += " | " + peakData.instance_error_count.toLocaleForAries();

                return peakData.error_count.toLocaleForAries();
            },

            peakHourOrDay() {
                return (this.pageType === PAGE_TYPE.DAILY)? this.peakData.peakRangeString :
                    getDayjs((this.metricByPeakTimeCondition === "visit_day") ? this.dailyPeakDataByMetrics.date : this.operationPeakDataByMetrics.date).format(serverDateFormat.short);

            },

            visitorCount() {
                return (this.pageType === PAGE_TYPE.DAILY)? this.peakData.visit_hour : (this.dailyPeakDataByMetrics.visit_day < 0)? 0 : this.dailyPeakDataByMetrics.visit_day;
            },

            serviceCount() {
                return (this.pageType === PAGE_TYPE.DAILY)? this.peakData.service_count : this.operationPeakDataByMetrics.service_count;
            },

            serviceTime() {
                return (this.pageType === PAGE_TYPE.DAILY)? this.peakData.service_time : this.operationPeakDataByMetrics.service_time;
            },

            serviceRate() {
                return  (this.pageType === PAGE_TYPE.DAILY)? this.peakData.service_rate :this.operationPeakDataByMetrics.service_rate;
            },

            operationPeakDataByMetrics() {
                return this.peakData.operation[this.metricByPeakTimeCondition];
            },

            dailyPeakDataByMetrics() {
                return this.peakData.daily[this.metricByPeakTimeCondition];
            },

            metricByPeakTimeCondition() {
                return this.searchCondition.metricByPeakTimeCondition;
            }

        },
    };
</script>
<style lang="scss" scoped>
@import "~@entry/statistics/common/styles/info-box.scss";
.statistics-peak-status {
    @include info-box;
}

</style>