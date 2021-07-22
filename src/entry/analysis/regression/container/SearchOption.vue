<template>
    <div class="search-option">
        <div class="resource-metric-group">
            <date-picker
                @update:date="dateChangeHandler"
                :select-count="period"
                :date="currentDate"
                :messages="messages"
                :prevent-future="false"
                type="inline"
            />
            <resource-selector
                @tab-change="tabChangeHandler"
                @row-selected="resourceSelectHandler"
                @row-unselected="resourceUnselectHandler"
                :tab="currentResource"
                :no-border="false"
                :selectable="true"
                :no-all-check="true"
                :resources="resources"
            ></resource-selector>
            <list-selector
                @check="metricSelectHandler"
                :list="currentMetrics"
                :multi-select="true"
                :title-label="i18n.metrics"
                v-if="comparisonType == 2"
            ></list-selector>
        </div>
        <div class="footer">
            <btn normal
                :items="[{ text: i18n.search }]"
                :disabled="isDisabled"
                :loading="isLoading"
                @click="clickSearchButton"
            ></btn>
        </div>
    </div>
</template>

<script>
import { getDayjs } from '@common/base';
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import DatePicker from '@vuejs/component/DatePicker/DatePicker';
import Btn from '@vuejs/component/button/Btn';
import messages from '@vuejs/component/messages';
import { mapState, mapMutations } from '../vuex';

export default {
    components: {
        DatePicker,
        ResourceSelector,
        ListSelector,
        Btn,
    },
    inject: {
        i18n: {
            default: {
                metrics: 'Metrics',
                search: 'Search',
            },
        },
    },
    props: {
        resources: {
            type: Array,
            required: false,
            default: () => [],
        },
        isLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
        currentDate: {
            type: Object,
            required: false,
            default: () => getDayjs(),
        },
        currentMetrics: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    computed: {
        ...mapState({
            period: state => state.period,
            searchTime: state => state.searchTime,
            comparisonType: state => state.comparisonType,
            currentResource: state => state.currentResource,
            isDisabled: state => {
                return (
                    state.domainId == -1 ||
                    state.metricNames.length == 0 ||
                    state.startHour >= state.endHour
                );
            },
        }),
    },
    data() {
        return {
            messages,
        };
    },
    methods: {
        ...mapMutations([
            'updateSearchTime',
            'updateCurrentResource',
            'updateTargetData',
            'updateMetricData',
        ]),
        dateChangeHandler(time) {
            this.updateSearchTime(time.valueOf());
        },
        tabChangeHandler(tab) {
            this.updateCurrentResource(tab);
        },
        resourceSelectHandler(m) {
            this.updateTargetData([m.sid, m.oid, m.shortName]);
        },
        resourceUnselectHandler() {
            this.updateTargetData([-1, -1]);
        },
        metricSelectHandler(items) {
            this.updateMetricData([
                items.map(item => item.label),
                items.map(item => item.value),
            ]);
        },
        clickSearchButton() {
            this.$emit('submit');
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.search-option {
    @include themify($themes) {
        box-sizing: border-box;
        border: 1px solid themed('search-option-border-color');
        border-radius: 4px;
        margin-top: 8px;
        display: flex;
        height: 324px;
        flex-direction: column;

        .resource-metric-group {
            display: flex;
            border-right: none;
            flex: 1;
            box-sizing: border-box;
            padding: 16px 8px 16px 16px;
            align-items: center;
            > :not(:last-child) {
                margin-right: 8px;
            }

            ::v-deep {
                .resource-selector-container {
                    width: 280px;
                }
                .list-selector-container {
                    width: 330px;
                }
            }
        }

        .footer {
            height: 52px;
            padding: 0 8px;
            border-top: 1px solid themed('search-option-border-color');
            display: flex;
            justify-content: flex-end;
            align-items: center;

            &.overflow {
                box-shadow: 0 -3px 5px -2px
                    themed('search-option-border-shadow-color');
            }
        }
    }
}
</style>
