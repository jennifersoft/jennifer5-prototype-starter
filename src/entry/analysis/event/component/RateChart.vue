<template>
    <div class="rate-chart">
        <div
            :class="['item', item.active || isAllChecked ? 'active' : '']"
            @click="onClickForPieChart(index)"
            v-for="(item, index) in pieActives"
        >
            <span
                class="bar"
                :style="{ width: `${getCountToPercent(item.count)}` }"
            >
            </span>
            <span class="text name">{{ item.name }}</span>
            <span class="text">
                <tooltip
                    :message="getNumberFormat(item.count)"
                    :position="'center-left'"
                >
                    <strong>{{ getCountToPercent(item.count) }}</strong>
                </tooltip>
            </span>
        </div>
    </div>
</template>

<script>
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { i18n } from '@common/utility';

export default {
    components: {
        Tooltip,
    },
    props: {
        tableData: {
            type: Array,
            required: false,
            default: null,
        },
        tableFilterMode: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    watch: {
        tableData: function(newVal) {
            if (this.tableFilterMode) return;

            this.pieData = [...newVal];
            this.pieActives = [];

            const dataMap = {};
            for (let i = 0; i < newVal.length; i++) {
                const key = this.getPieDataKey(newVal[i]);

                if (!dataMap[key]) {
                    dataMap[key] = {
                        name: key,
                        active: false,
                        count: 1,
                    };

                    this.pieActives.push(dataMap[key]);
                } else {
                    dataMap[key].count += 1;
                }
            }

            this.pieActives.sort((a, b) => b.count - a.count);
        },
    },
    data: function() {
        return {
            pieActives: [],
            pieData: [],
        };
    },
    computed: {
        // 모든 아이템이 체크가 안되있으면, 모두 체크되었는걸로 간주한다.
        isAllChecked() {
            let result = true;
            for (let i = 0; i < this.pieActives.length; i++) {
                if (this.pieActives[i].active) {
                    result = false;
                    break;
                }
            }
            return result;
        },
    },
    methods: {
        onClickForPieChart(index) {
            const activeKeys = {};

            this.pieActives[index].active = !this.pieActives[index].active;
            this.pieActives.map(item => (activeKeys[item.name] = item.active));

            this.$emit(
                'ratefilter#table',
                this.pieData.filter(
                    item => activeKeys[this.getPieDataKey(item)]
                ),
                this.pieData
            );
        },
        getPieDataKey(data) {
            return data.mxidName != ''
                ? i18n.get('ui.mx.' + data.mxidName)
                : data.errorTypeName;
        },
        getCountToPercent(val) {
            return ((val / this.pieData.length) * 100).toFixed(1) + '%';
        },
        getNumberFormat(val) {
            return val.toLocaleForAries();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.rate-chart {
    @include themify($themes) {
        max-height: 208px;
        overflow-y: auto;
        padding: 8px 10px;
        > .item {
            position: relative;
            cursor: pointer;
            height: 24px;
            line-height: 24px;
            margin-bottom: 2px;
            border-radius: 3px;
            border: 1px solid themed('common-border-color');

            &:hover {
                background-color: themed(
                    'rate-chart-hover-item-background-color'
                );
            }
            &:not(.active) {
                > * {
                    opacity: 0.5;
                }
            }

            > .bar {
                position: absolute;
                border-radius: 2px;
                background-color: themed(
                    'rate-chart-item-bar-background-color'
                );
                height: 100%;
            }
            > .text {
                position: absolute;

                &.name {
                    left: 8px;
                }

                &:last-child {
                    right: 8px;
                }
            }
        }
    }
}
</style>
