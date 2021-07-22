<template>
    <div class="tool-bar">
        <navigation-bar :show-search-btn="false">
            <navigation-item :label="`${i18n.periodSettingText} (${i18n.day})`">
                <format-number-input
                    v-model="period"
                    use-stepper
                    small
                    :width="60"
                    :min="1"
                    :max="30"
                ></format-number-input>
            </navigation-item>
            <navigation-item :label="i18n.operatingTime">
                <format-number-input
                    class="labeled-input"
                    v-model="startHour"
                    :width="60"
                    :max="24"
                    use-stepper
                    small
                >
                </format-number-input>
                <format-number-input
                    v-model="endHour"
                    :width="60"
                    :max="24"
                    use-stepper
                    small
                ></format-number-input>
            </navigation-item>
            <navigation-item :label="i18n.interval">
                <dropdown
                    class="interval-types"
                    :width="120"
                    :items="intervalTypes"
                    :selected-value="intervalType"
                    @onchange="changeIntervalType"
                ></dropdown>
            </navigation-item>
            <navigation-item :label="i18n.metrics">
                <dropdown
                    :width="180"
                    :items="comparisonTypes"
                    :selected-value="comparisonType"
                    @onchange="changeComparisonType"
                ></dropdown>
            </navigation-item>
        </navigation-bar>
    </div>
</template>

<script>
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { mapState, mapMutations } from '../vuex';

export default {
    inject: {
        i18n: {
            default: {
                periodSettingText: {
                    default: 'Period setting',
                },
                operatingTime: {
                    default: 'Operation time',
                },
                interval: {
                    default: 'Interval',
                },
                basedComparison: {
                    default: 'Based comparison',
                },
                preDefined: {
                    default: 'Predefined',
                },
                userSelection: {
                    default: 'User selection',
                },
                day: {
                    default: 'day',
                },
            },
        },
    },
    components: {
        NavigationBar,
        NavigationItem,
        FormatNumberInput,
        Dropdown,
    },
    computed: {
        ...mapState({
            intervalType: state => state.intervalType,
            comparisonType: state => state.comparisonType,
            tempPeriod: state => state.period,
            tempStartHour: state => state.startHour,
            tempEndHour: state => state.endHour,
        }),
        period: {
            get() {
                return this.tempPeriod;
            },
            set(value) {
                this.updatePeriod(parseInt(value));
            },
        },
        startHour: {
            get() {
                return this.tempStartHour;
            },
            set(value) {
                this.updateStartHour(parseInt(value));
            },
        },
        endHour: {
            get() {
                return this.tempEndHour;
            },
            set(value) {
                this.updateEndHour(parseInt(value));
            },
        },
    },
    data() {
        return {
            intervalTypes: [
                { text: `1${this.i18n.minute}`, value: 1 },
                { text: `5${this.i18n.minute}`, value: 5 },
                { text: `10${this.i18n.minute}`, value: 10 },
                { text: `30${this.i18n.minute}`, value: 30 },
                { text: `1${this.i18n.hour}`, value: 60 },
            ],
            comparisonTypes: [
                { text: this.i18n.preDefined, value: 1 },
                { text: this.i18n.userSelection, value: 2 },
            ],
        };
    },
    methods: {
        ...mapMutations([
            'updateIntervalType',
            'updateComparisonType',
            'updatePeriod',
            'updateStartHour',
            'updateEndHour',
        ]),
        changeIntervalType: function(data) {
            this.updateIntervalType(data.value);
        },
        changeComparisonType: function(data) {
            this.updateComparisonType(data.value);
        },
    },
};
</script>

<style lang="scss" scoped>
.tool-bar {
    margin-top: 24px;
    ::v-deep .input-field-wrapper {
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
    }

    ::v-deep .interval-types {
        .row-list {
            max-height: 140px;
        }
    }
}
</style>
