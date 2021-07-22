<template>
    <window
        :open-w="270"
        :open-h="512"
        :open-x="style.left"
        :open-y="style.top"
        :messages="messages"
        class="baseline-configure-window"
        @cancel="$emit('cancel')"
        @apply="apply"
    >
        <template v-slot:subject>
            {{ i18n.title }}
        </template>
        <div class="chapter">
            <span>{{ i18n.date }} </span>
        </div>
        <div class="conditionList">
            <option-group
                :options="basicConditionList"
                :active="checkedShowValue"
                type="checkbox"
                @change="onChangeShowValue"
            />
            <option-group
                :options="basicConditionListForLabel"
                :active="showLabels"
                type="switch"
                @change="onChangeshowLabel"
            />
        </div>
        <div class="chapter" style="margin-top: 20px;">
            <span>
                {{ i18n.peakDayCondition }}
            </span>
        </div>
        <div class="conditionList">
            <option-group
                :options="peakdayConditionList"
                :active="checkedShowValue"
                type="checkbox"
            />
            <option-group
                :options="peakdayConditionListForLabel"
                :active="showLabels"
                type="switch"
            />
        </div>
    </window>
</template>
<script>
import Window from '@vuejs/component/window/Window';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import OptionGroup from '@vuejs/component/Toggle/OptionGroup';
import { i18n } from '@common/utility';
import { mapMutations, mapState } from 'vuex';
import messages from '@vuejs/component/messages';

export default {
    name: 'baselineConfigureWindow',
    components: { Window, Checkbox, OptionGroup },
    data() {
        return {
            messages,
            i18n: {
                title: i18n.get('ui.label.baseline.setting'),
                date: i18n.get('ui.label.date'),
                yesterday: i18n.get('ui.label.time.yesterday'),
                lastweek: i18n.get('ui.label.time.lastweek'),
                thisweek: i18n.get('ui.label.time.thisweek'),
                lastmonth: i18n.get('ui.label.time.lastmonth'),
                thismonth: i18n.get('ui.label.time.thismonth'),
                lastyear: i18n.get('ui.label.time.lastyear'),
                thisyear: i18n.get('ui.label.time.thisyear'),

                peakDayCondition: i18n.get('ui.label.peakDayCondition'),
                labelShow: i18n.get('ui.label.label.show'),

                isYesterday: false,
                isLastweek: false,
                isLastmonth: false,
                isYesterdayOnPeakday: false,
            },
            basicConditionList: [
                {
                    label: i18n.get('ui.label.time.yesterday'),
                    value: 'yesterday',
                },
                {
                    label: i18n.get('ui.label.time.lastweek'),
                    value: 'lastweek',
                },
                {
                    label: i18n.get('ui.label.time.lastmonth'),
                    value: 'lastmonth',
                },
            ],
            basicConditionListForLabel: [
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'yesterday',
                },
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'lastweek',
                },
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'lastmonth',
                },
            ],

            peakdayConditionList: [
                {
                    label: i18n.get('ui.label.time.thisweek'),
                    value: 'peakdayofthisweek',
                },
                {
                    label: i18n.get('ui.label.time.lastweek'),
                    value: 'peakdayoflastweek',
                },
                {
                    label: i18n.get('ui.label.time.thismonth'),
                    value: 'peakdayofthismonth',
                },
                {
                    label: i18n.get('ui.label.time.lastmonth'),
                    value: 'peakdayoflastmonth',
                },
                {
                    label: i18n.get('ui.label.time.thisyear'),
                    value: 'peakdayofthisyear',
                },
                {
                    label: i18n.get('ui.label.time.lastyear'),
                    value: 'peakdayoflastyear',
                },
            ],
            peakdayConditionListForLabel: [
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'peakdayofthisweek',
                },
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'peakdayoflastweek',
                },
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'peakdayofthismonth',
                },
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'peakdayoflastmonth',
                },
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'peakdayofthisyear',
                },
                {
                    label: i18n.get('ui.label.label.show'),
                    value: 'peakdayoflastyear',
                },
            ],

            checkedShowValue: [],
            showLabels: [],
        };
    },
    methods: {
        ...mapMutations('userdefine', [
            'configureBaselineConditionOnEditingChart',
        ]),

        onChangeShowValue(actives) {
            this.checkedShowValue = actives;
        },
        onChangeshowLabel(actives) {
            this.showLabels = actives;
        },

        apply() {
            const configure = {
                dateConditionList: this.checkedShowValue.join(','),
                labelDateConditionList: this.showLabels.join(','),
            };
            this.configureBaselineConditionOnEditingChart(configure);

            this.$emit('apply');
        },
    },
    computed: {
        ...mapState('userdefine', [
            'editingChartOptions',
            'componentsAreaSize',
        ]),

        style() {
            const { width, height } = this.componentsAreaSize;

            return {
                left: width * this.editingChartOptions.endx * 0.01 + 70 + 'px',
                top:
                    height * this.editingChartOptions.starty * 0.01 +
                    145 +
                    'px',
            };
        },
    },
    mounted() {
        if (this.editingChartOptions.charttype === 'line.compare') {
            this.checkedShowValue = this.editingChartOptions.dateConditionList
                ? this.editingChartOptions.dateConditionList.split(',')
                : [];
            this.showLabels = this.editingChartOptions.labelDateConditionList
                ? this.editingChartOptions.labelDateConditionList.split(',')
                : [];
        }
    },
    watch: {},
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.baseline-configure-window {
    .body {
        .chapter {
            height: 32px;
            line-height: 32px;
            @include themify($themes) {
                border-bottom: 1px solid
                    themed('window-content-border-bottom-color');
            }
        }
        .conditionList {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            > .condition {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 32px;
                line-height: 32px;
                @include themify($themes) {
                    border-bottom: 1px solid
                        themed('window-content-border-bottom-color');
                }

                input + span {
                    margin-left: 8px;
                }

                span + input {
                    margin-left: 8px;
                }
            }
        }
    }
}
</style>
