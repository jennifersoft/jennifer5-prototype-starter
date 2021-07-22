<template>
    <transition-group
        name="list"
        class="search-condition-queue-wrapper"
        tag="div"
    >
        <div
            v-for="(item, index) in list"
            class="queue-item"
            @mouseover="onMouseover(index)"
            @mouseleave="onMouseleave"
            :key="item.key"
            @click="clickRow(item.key)"
            :class="{ selected: selectedLineKey === item.key }"
        >
            <div class="switch-wrapper" @click.prevent.stop>
                <toggle-switch
                    :small="true"
                    :switch-button-color="item.displayOption.switchButtonColor"
                    :switch-color="item.displayOption.switchColor"
                    :active="live(item.displayOption)"
                    @change="toggleLive(item.displayOption)"
                ></toggle-switch>
            </div>

            <span class="date-text">{{ displayDateText(item) }}</span>
            <strong class="metric-text">{{ displayMetricName(item) }}</strong>
            <span class="target-text">{{ displayTargetText(item) }}</span>
            <div
                class="button-group"
                v-if="hoverIndex === index"
                @click.stop="clickEvent($event)"
            >
                <btn
                    v-show="modifiedRatio(item.displayOption)"
                    :tooltip-options="{
                        message: i18n.originratio,
                        position: 'top-center',
                    }"
                    :items="[{ iconType: refreshIcon }]"
                    @click="refreshRatio(item.key)"
                />

                <btn
                    :tooltip-options="{
                        message: i18n.export,
                        position: 'top-center',
                    }"
                    :items="[{ iconType: arrowDownwardIcon }]"
                    @click="emitShowExtraDropdown()"
                />

                <popup-list
                    v-if="showExtraDropdown"
                    :items="downloadItems"
                    @update:active-index="onSelectExtraDropdown"
                    :width="200"
                    :style="extraDropdownStyle"
                    normal
                    no-select
                />
                <btn
                    :tooltip-options="{
                        message: i18n.delete,
                        position: 'top-center',
                    }"
                    :items="[{ iconType: closeIcon }]"
                    @click="removeCondition(item.key)"
                />
            </div>
            <alert-window
                :message="alertMessage"
                @cancel="() => (alertMessage = '')"
                v-if="alertMessage !== ''"
            ></alert-window>
        </div>
    </transition-group>
</template>

<script>
import AlertWindow from '@vuejs/component/window/AlertWindow';
import Btn from '@vuejs/component/button/Btn';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import { mapActions, mapState, mapMutations } from 'vuex';
import { LicenseStatusDef } from '@common/definition';
import { Observer } from '@common/legacy/Observer';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';
import { getDayjs, serverDateFormat } from '@common/base';

export default {
    name: 'SearchConditionQueue',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                delete: 'delete',
                dataChart: 'Chart Data',
                data24HourRaw: 'Raw Data',
                time: 'time',
                value: 'value',
            }),
        },
    },
    components: { ToggleSwitch, Btn, Dropdown, PopupList, AlertWindow },
    props: {
        list: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            hoverIndex: -1,
            showExtraDropdown: false,
            showBottomExtraDropdown: false,
            downloadItems: [
                { text: this.i18n.dataChart, value: 'chartData' },
                { text: this.i18n.data24HourRaw, value: 'rawData' },
            ],
            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations('performancebrowser', ['selectLineKey']),

        ...mapActions('performancebrowser', [
            'removeCondition',

            'downloadChartData',
            'downloadRawData',
        ]),
        onMouseover(i) {
            this.hoverIndex = i;
        },
        onMouseleave() {
            this.hoverIndex = -1;
            this.showExtraDropdown = false;
        },
        clickEvent(e) {
            const isNewLine = Array.from(this.$el.classList).includes(
                'newLine'
            );

            this.showBottomExtraDropdown =
                isNewLine && !this.chartOnlyLayout
                    ? e.pageY > 580
                    : e.pageY > 341;
            e.stopPropagation();
        },
        clickRow(key) {
            const newKey = this.selectedLineKey === key ? undefined : key;

            this.selectLineKey(newKey);
            this.chart.lineSelectByDom(newKey);
            this.chart.paintChart();
        },
        removeRow(key) {
            if (this.selectedLineKey === key) this.selectLineKey(undefined);
            this.removeCondition(key);
        },
        refreshRatio(key) {
            this.chart.getModel().models[key].ratio = 1;
            this.chart.paintChart();
        },
        emitShowExtraDropdown(key, event) {
            this.showExtraDropdown = true;
        },

        onSelectExtraDropdown(index) {
            this.showExtraDropdown = false;
            const value = this.downloadItems[index].value;

            const item = this.list[this.hoverIndex];
            const key = item.key;
            const fileName =
                `${this.displayDateText(item)} ${this.displayMetricName(
                    item
                )} ${this.displayTargetText(item)}`.replace(/\s+/g, ' ') +
                '.csv';

            const i18n = this.i18n;
            if (value === 'chartData')
                this.downloadChartData({ key, fileName, i18n });
            else if (value === 'rawData') {
                if (this.selected.periodDays > 1) {
                    this.alertMessage = i18n.M0522;
                    return;
                }
                this.downloadRawData({ key, fileName });
            }
        },
        modifiedRatio({ model }) {
            return model.ratio !== 1;
        },
        toggleLive({ agent }) {
            agent.license_status =
                agent.license_status === LicenseStatusDef.STOPPED
                    ? LicenseStatusDef.RUNNING
                    : LicenseStatusDef.STOPPED;

            this.chart.paintChart();
        },
        live({ agent }) {
            return agent.license_status === LicenseStatusDef.RUNNING;
        },
        displayDateText({ stime, etime }) {
            const startDate = getDayjs(stime).format(serverDateFormat.short);
            const endDate = getDayjs(etime - 1).format(serverDateFormat.short);

            if (startDate === endDate) {
                return startDate;
            } else {
                return `${startDate} ~ ${endDate}`;
            }
        },
        displayMetricName({ displayOption }) {
            return displayOption.metricName;
        },
        displayTargetText({ displayOption }) {
            const { domainName, shortName } = displayOption;
            if (domainName === shortName) {
                return `[${domainName}]`;
            } else {
                return `[${domainName} > ${shortName}]`;
            }
        },
    },
    computed: {
        ...mapState('performancebrowser', [
            'chart',
            'selected',
            'chartOnlyLayout',
            'selectedLineKey',
        ]),
        extraDropdownStyle() {
            const style = {
                right: '26px',
            };
            if (this.showBottomExtraDropdown) style.bottom = '26px';
            else style.top = '26px';
            return style;
        },
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
        this.arrowDownwardIcon = ICON_TYPE.arrowDownward;
        this.refreshIcon = ICON_TYPE.refresh;

        Observer.on(
            ChartKeywordInObserver.SELECT_LINE_IN_PERFORMANCE_CHART,
            key => {
                this.selectLineKey(key);
            }
        );
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
        selected-border-color: #8652ff,
        btn-bg-color: #ffffff,
        behaviors-hover-color: rgba(0, 0, 0, 0.05),
        typography-color-primary: #212121,
        item-shadow-color: rgba(0, 0, 0, 0.05),
    ),
    dark: (
        border-color: #4e4e4e,
        selected-border-color: #8652ff,
        btn-bg-color: #1c1c1c,
        behaviors-hover-color: rgba(255, 255, 255, 0.05),
        typography-color-primary: #e8e8e8,
        item-shadow-color: rgba(0, 0, 0, 0.3),
    ),
);
.search-condition-queue-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    @include themify($themes) {
        .queue-item {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            cursor: pointer;
            box-sizing: border-box;
            line-height: 16px;
            padding: 12px 8px;
            border: 1px solid themed('border-color');
            border-radius: 3px;
            &:hover {
                background: themed('behaviors-hover-color');
                box-shadow: 0 1px 2px 0 themed('item-shadow-color');
            }
            &:not(:last-child) {
                margin-bottom: 4px;
            }

            &.selected {
                border: 1px solid themed('selected-border-color');
            }

            .switch-wrapper {
                margin-right: 16px;
                display: inline-flex;
            }

            .date-text,
            .metric-text,
            .target-text {
                color: themed('typography-color-primary');
                padding-right: 5px;
            }

            .button-group {
                position: absolute;
                right: 10px;
                z-index: 10;

                .aries-ui-btn {
                    margin: -6px 0;
                    ::v-deep .item {
                        background: themed('btn-bg-color');
                    }
                }
            }
        }
    }
}

.list-enter-active {
    transition: opacity 0.3s, transform 0.3s;
}
.list-leave-active {
    position: absolute;
}
.list-move {
    transition: transform 0.5s;
}
.list-enter {
    opacity: 0;
    transform: translateX(12px);
}
.list-leave,
.list-leave-to {
    opacity: 0;
}
</style>
