<template>
    <base-window
        class="table-choice"
        :width="1066"
        :height="530"
        :use-footer="false"
        @cancel="onClickHideBtn"
    >
        <template #subject>{{ i18n.table }}</template>
        <template #contents>
            <div class="contents">
                <div>
                    <div class="category">{{ i18n.searchDB }}</div>
                    <div class="menu">
                        <span>{{ i18n.dbmetrics }}</span>
                        <btn
                            ref="test-btn"
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableMetrics')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dailyDomainInstance }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableMetricsComparePivot')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dbevent }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableEvent')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dberror }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableError')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dberrorRate }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableErrorCountRate')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.diskUsage }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableDiskUsage')"
                        ></btn>
                    </div>
                </div>
                <div>
                    <div class="category">{{ i18n.topn }}</div>
                    <div class="menu">
                        <span>{{ i18n.dbmetrics }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableMetricsTopN')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dbservice }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableServiceTopN')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dbevent }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableEventTopN')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dberror }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableErrorTopN')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dberrorService }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableErrorApplicationTopn')"
                        ></btn>
                    </div>
                </div>
                <div>
                    <div class="category">{{ i18n.summary }}</div>
                    <div class="menu">
                        <span>{{ i18n.metricsComparison }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('TableMetricsSummary')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.sumOfMetrics }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="
                                onClickShowBtn('TableMetricsSummaryMultidomain')
                            "
                        ></btn>
                    </div>
                </div>
            </div>
        </template>
    </base-window>
</template>
<script>
import BaseWindow from './BaseWindow';
import Btn from '@vuejs/component/button/Btn';
import { i18n } from '@common/utility';

export default {
    components: {
        BaseWindow,
        Btn,
    },
    data() {
        return {
            i18n: {
                table: i18n.get('ui.label.table'),
                searchDB: i18n.get('ui.label.search.db'),
                multiDomain: i18n.get('ui.title.multiDomain'),
                summary: i18n.get('ui.label.summary'),
                dbmetrics: i18n.get('ui.title.dbmetrics'),
                dbservice: i18n.get('ui.title.dbservice'),
                dbevent: i18n.get('ui.title.dbevent'),
                dberror: i18n.get('ui.title.dberror'),
                dberrorRate: i18n.get('ui.title.dberror.rate'),
                dberrorService: i18n.get('ui.title.dberror.application'),
                dailyDomainInstance: i18n.get('ui.title.dailyDomainInstance'),
                diskUsage: i18n.get('ui.label.diskUsage'),
                topn: i18n.get('ui.label.topn'),
                insert: i18n.get('ui.label.insert'),
                metricsComparison: i18n.get('ui.label.metricsComparison'),
                sumOfMetrics: i18n.get('ui.label.sumOfMetrics'),
            },
        };
    },
    methods: {
        onClickHideBtn() {
            this.$emit('hide-layer');
        },
        onClickShowBtn(id) {
            this.$emit('show-layer', id);
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../../themes';
.table-choice {
    @include themify($themes) {
        ::v-deep .head {
            > .title {
                color: themed('common-font-color') !important;
            }
        }
    }

    @import '../../style/table-choice';
    @include table-choice;
}
</style>
