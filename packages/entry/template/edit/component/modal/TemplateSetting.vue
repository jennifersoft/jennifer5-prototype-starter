<template>
    <base-window
        class="template-setting"
        :width="width"
        :height="height"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>{{ i18n.title }}</template>
        <template #contents>
            <div class="contents">
                <div class="side" v-if="isNew">
                    <div
                        ref="btn-new-blank"
                        :class="[
                            'item',
                            selectedNewDocument === 'blank.json'
                                ? 'active'
                                : '',
                        ]"
                        @click="onClickNewDocument('blank.json')"
                    >
                        <div class="block">
                            <div class="image">
                                <svg-icon
                                    :icon-type="iconTypes.add"
                                    :width="iconSize"
                                    :height="iconSize"
                                ></svg-icon>
                            </div>
                        </div>
                        <div class="text">{{ i18n.blankPage }}</div>
                    </div>
                    <div
                        ref="btn-new-daily"
                        :class="[
                            'item',
                            selectedNewDocument === 'DailyReport.json'
                                ? 'active'
                                : '',
                        ]"
                        @click="onClickNewDocument('DailyReport.json')"
                    >
                        <div class="block">
                            <div class="image daily"></div>
                        </div>
                        <div class="text">{{ i18n.dailyReport }}</div>
                    </div>
                    <div
                        :class="['item', loadedFileName !== '' ? 'active' : '']"
                    >
                        <div class="block">
                            <div class="image">
                                <svg-icon
                                    :icon-type="iconTypes.upload"
                                    :width="iconSize"
                                    :height="iconSize"
                                ></svg-icon>
                            </div>
                        </div>
                        <div class="text">
                            <span v-if="loadedFileName === ''">{{
                                i18n.importFile
                            }}</span>
                            <span :title="loadedFileName" v-else>{{
                                loadedFileName
                            }}</span>
                        </div>
                        <input ref="file" type="file" accept=".json" />
                    </div>
                </div>
                <div class="main">
                    <div class="item">
                        <div class="left">{{ i18n.domain }}</div>
                        <div :class="['right', domainGroupLayout]">
                            <domain-group-selector
                                ref="domain-group"
                                @elementSelected="onChangeDomain"
                                :selectedOne="selectedOne"
                                :domain-group-tree="domainList"
                            />
                        </div>
                    </div>
                    <div class="item">
                        <div class="left">{{ i18n.subject }}</div>
                        <div class="right">
                            <input-field
                                :width="246"
                                :value="selectedData.title"
                                @input="onChangeTitle"
                            ></input-field>
                        </div>
                    </div>
                    <div class="item">
                        <div class="left">{{ i18n.dateSetting }}</div>
                        <div class="right">
                            <template
                                v-if="
                                    selectedNewDocument === 'DailyReport.json'
                                "
                            >
                                <span class="day">{{ i18n.aDay }}</span>
                            </template>
                            <dropdown
                                normal
                                :width="155"
                                :items="periodList"
                                :selected-value="selectedPeriod"
                                @onchange="onChangePeriodEvent"
                                v-else
                            ></dropdown>
                        </div>
                    </div>
                    <div class="item">
                        <div class="left">
                            <template v-if="selectedPeriod === 1">
                                {{ i18n.operatingTime }}
                            </template>
                        </div>
                        <div class="right">
                            <template v-if="selectedPeriod === 1">
                                <dropdown
                                    normal
                                    :width="60"
                                    :items="startHourList"
                                    :selected-value="selectedStartHour"
                                    @onchange="onChangeStartHourEvent"
                                ></dropdown>
                                ~
                                <dropdown
                                    normal
                                    :width="60"
                                    :items="endHourList"
                                    :selected-value="selectedEndHour"
                                    @onchange="onChangeEndHourEvent"
                                ></dropdown>
                            </template>
                            <template v-else-if="selectedPeriod === 2">
                                <dropdown
                                    normal
                                    :width="125"
                                    :items="dayList"
                                    :selected-value="selectedStartDay"
                                    @onchange="onChangeStartDayEvent"
                                ></dropdown>
                                ~
                                <dropdown
                                    normal
                                    :width="125"
                                    :items="dayList"
                                    :selected-value="selectedEndDay"
                                    @onchange="onChangeEndDayEvent"
                                ></dropdown>
                            </template>
                            <template v-else-if="selectedPeriod === 4">
                                <div class="dropdown-wrapper">
                                    <span>D-</span>
                                    <dropdown
                                        normal
                                        :width="60"
                                        :items="dateList"
                                        :selected-value="selectedStartDate"
                                        @onchange="onChangeStartDateEvent"
                                    ></dropdown>
                                </div>
                                ~
                                <div class="dropdown-wrapper">
                                    <span>D-</span>
                                    <dropdown
                                        normal
                                        :width="60"
                                        :items="dateList"
                                        :selected-value="selectedEndDate"
                                        @onchange="onChangeEndDateEvent"
                                    ></dropdown>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </base-window>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n, getByteLength, isJSONString } from '@common/utility';
import { getAllChildren } from '@vuejs/component/Resource/Tree/treeAction';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import DomainGroupSelector from '@vuejs/component/Domain/DomainGroupSelector/DomainGroupSelector.vue';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import InputField from '@vuejs/component/Input/InputField';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import BaseWindow from './BaseWindow';
import { HOURS, DAYS, DATES, PERIODS } from '../../constant';

const domain = createNamespacedHelpers('domain');
const { mapState, mapActions } = createNamespacedHelpers('template');

export default {
    components: {
        BaseWindow,
        DomainGroupSelector,
        SvgIcon,
        InputField,
        Dropdown,
    },
    computed: {
        ...domain.mapState(['domainList', 'selectedOne']),
        ...mapState([
            'key',
            'title',
            'domainGroupTitle',
            'domainGroupIndex',
            'domains',
            'buildDay',
            'buildTime',
        ]),
        isNew() {
            return this.domains.length == 0;
        },
        width() {
            return this.isNew ? 680 : 510;
        },
        height() {
            return this.isNew ? 608 : 410;
        },
    },
    data() {
        return {
            i18n: {
                title: i18n.get('ui.label.template.conf'),
                subject: i18n.get('ui.label.title'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                domain: i18n.get('ui.label.domain'),
                dateSetting: i18n.get('ui.label.template.dateSetting'),
                operatingTime: i18n.get('ui.label.operatingTime'),
                startDate: i18n.get('ui.label.startDate'),
                endDate: i18n.get('ui.label.endDate'),
                defaultValue: i18n.get('ui.label.defaultValue'),
                dailyReport: i18n.get('ui.label.dailyReport'),
                importFile: i18n.get('ui.button.import'),
                aDay: i18n.get('ui.label.time.aDay'),
                fileName: i18n.get('ui.label.fileName'),
                blankPage: i18n.get('ui.label.blankPage'),
                M0215: i18n.get('M0215'),
                M0508: i18n.get('M0508'),
                M0377: i18n.get('M0377'),
                M0649: i18n.get('M0649'),
            },
            iconTypes: {
                add: ICON_TYPE.add,
                upload: ICON_TYPE.arrowUpward,
            },
            iconSize: 24,

            selectedData: {
                domainGroupTitle: '',
                domainGroupIndex: '0',
                domains: [],
                buildDay: '1',
                buildTime: '0,0,24',
                title: '',
            },

            selectedNewDocument: 'blank.json',
            loadedFileName: '',

            selectedPeriod: 1,
            selectedStartDay: 1,
            selectedEndDay: 1,
            selectedStartDate: 1,
            selectedEndDate: 1,

            // 사실상 전체 운영시간의 첫번째 값은 의미가 없음
            activeOperatingTime: true,
            selectedStartHour: 0,
            selectedEndHour: 24,

            // 컴포넌트 메타데이터
            periodList: PERIODS,
            dayList: DAYS,
            dateList: DATES,
            startHourList: HOURS,
            endHourList: HOURS,

            // 도메인 그룹 영역 레이아웃 (or 'vertical')
            domainGroupLayout: '',
        };
    },
    methods: {
        ...domain.mapMutations(['selectDomainWithoutCache']),
        ...mapActions(['loadTemplateSetting']),

        onChangeDomain(element) {
            this.changeDomainGroupLayout();
            this.selectDomainWithoutCache(element.treeIndex);

            this.selectedData.domainGroupTitle = element.label;
            this.selectedData.domainGroupIndex = element.treeIndex;

            if (element.data.sid === -1)
                this.selectedData.domains = getAllChildren(
                    element.treeIndex,
                    this.domainList
                )
                    .filter(d => d.data.sid !== -1)
                    .map(d => d.data.sid);
            else this.selectedData.domains = [element.data.sid];
        },
        onClickNewDocument(file) {
            if (this.loadedFileName !== '') return;

            this.selectedNewDocument = file;
            if (file === 'DailyReport.json') this.selectedPeriod = 1;
        },
        onClickCancelBtn() {
            if (this.isNew) this.$emit('go-list');
            else this.$emit('hide-layer');
        },
        onClickSubmitBtn() {
            if (this.selectedData.title === '') {
                this.$emit('alert', this.i18n.M0215);
                return;
            }

            if (getByteLength(this.selectedData.title) > 40) {
                this.$emit('alert', this.i18n.M0508);
                return;
            }

            // 운영시간 유효성 검사
            if (this.selectedStartHour >= this.selectedEndHour) {
                this.$emit('alert', this.i18n.M0649);
                return;
            }

            // 기간 설정이 사용자정의 일때, D-시작일이 D-종료일보다 크거나 같아야 함.
            const tokens = this.selectedData.buildDay.split(',');
            if (
                tokens[0] === '4' &&
                parseInt(tokens[2]) > parseInt(tokens[1])
            ) {
                this.$emit('alert', this.i18n.M0377);
                return;
            }

            // 선택된 도메인이 없을 경우, 이전 화면에서 선택된 도메인 정보를 기본값으로 설정한다.
            if (this.isNew && this.selectedData.domains.length === 0) {
                this.onChangeDomain(this.selectedOne);
            }

            this.loadTemplateSetting({
                data: this.selectedData,
                file: this.selectedNewDocument,
            }).then(json => {
                if (json) this.$emit('load-template', json);
                this.$emit('update-resource-list');
                this.$emit('update-metrics-map');
                this.$emit('hide-layer');
            });
        },

        onChangeTitle(text) {
            this.selectedData.title = text;
        },
        onChangePeriodEvent(data) {
            this.activeOperatingTime = data.value === 1;
            this.selectedPeriod = data.value;
            this.updateBuildConfig();
        },
        onChangeStartDayEvent(data) {
            this.selectedStartDay = data.value;
            this.updateBuildConfig();
        },
        onChangeEndDayEvent(data) {
            this.selectedEndDay = data.value;
            this.updateBuildConfig();
        },
        onChangeStartDateEvent(data) {
            this.selectedStartDate = data.value;
            this.updateBuildConfig();
        },
        onChangeEndDateEvent(data) {
            this.selectedEndDate = data.value;
            this.updateBuildConfig();
        },
        onChangeStartHourEvent(data) {
            this.selectedStartHour = data.value;
            this.updateBuildConfig();
        },
        onChangeEndHourEvent(data) {
            this.selectedEndHour = data.value;
            this.updateBuildConfig();
        },
        updateBuildConfig() {
            const buildTimeValueTokens = [this.selectedPeriod];

            if (this.selectedPeriod === 2) {
                buildTimeValueTokens.push(this.selectedStartDay);
                buildTimeValueTokens.push(this.selectedEndDay);
            } else if (this.selectedPeriod === 4) {
                buildTimeValueTokens.push(this.selectedStartDate);
                buildTimeValueTokens.push(this.selectedEndDate);
            }

            const runTimeValueTokens = [
                this.activeOperatingTime ? 1 : 0,
                this.selectedStartHour,
                this.selectedEndHour,
            ];

            this.selectedData.buildDay = buildTimeValueTokens.join(',');
            this.selectedData.buildTime = runTimeValueTokens.join(',');
        },
        changeDomainGroupLayout() {
            // DomainGroupSelector 넓이가 레이아웃보다 클 경우에 대한 처리
            setTimeout(() => {
                const ref = this.$refs['domain-group'];

                // TODO: 역시 ref를 사용하는 구현 방식은 마음에 들지 않는다.
                if (ref) {
                    const nodes = ref.$el.getElementsByClassName(
                        'three-depth-box'
                    );

                    let width = 0;
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i];
                        if (!node.className.includes('fade-leave'))
                            width += node.getBoundingClientRect().width;
                    }

                    this.domainGroupLayout = width > 320 ? 'vertical' : '';
                }
            }, 100);
        },
    },
    created() {
        this.selectedData.title = this.title;
        this.selectedData.domainGroupTitle = this.domainGroupTitle;
        this.selectedData.domainGroupIndex = this.domainGroupIndex;
        this.selectedData.domains = this.domains;

        const buildTimeValueTokens = this.buildDay.split(',');
        this.selectedPeriod = parseInt(buildTimeValueTokens[0]);
        this.selectedStartDay = parseInt(buildTimeValueTokens[1]) || 1;
        this.selectedEndDay = parseInt(buildTimeValueTokens[2]) || 1;
        this.selectedStartDate = parseInt(buildTimeValueTokens[1]) || 1;
        this.selectedEndDate = parseInt(buildTimeValueTokens[2]) || 1;

        const runTimeValueTokens = this.buildTime.split(',');
        this.activeOperatingTime = parseInt(runTimeValueTokens[0]) === 1;
        this.selectedStartHour = parseInt(runTimeValueTokens[1]) || 0;
        this.selectedEndHour = parseInt(runTimeValueTokens[2]) || 24;

        this.updateBuildConfig();
    },
    mounted() {
        if (this.isNew) {
            this.$refs.file.addEventListener('change', e => {
                const file = e.target.files[0];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = evt => {
                        const jsonStr = evt.target.result;

                        if (isJSONString(jsonStr)) {
                            this.selectedNewDocument = JSON.parse(jsonStr);
                            this.loadedFileName = file.name;
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }

        this.changeDomainGroupLayout();
    },
};
</script>
<style lang="scss" scoped>
.template-setting {
    @import '../../style/window-sub-title';
    @include window-sub-title;

    @import '../../themes';
    @include themify($themes) {
        .contents {
            display: flex;
            height: 100%;

            > .side {
                flex: 0 0 124px;
                padding-right: 24px;
                margin-right: 24px;
                border-right: 1px solid
                    themed('window-template-setting-side-border-color');

                > .item {
                    margin-bottom: 14px;
                    cursor: pointer;
                    position: relative;
                    &.active {
                        > .block {
                            background-color: themed(
                                'window-template-setting-side-item-active-block-background-color'
                            );
                            border-color: themed(
                                'window-template-setting-side-item-active-block-border-color'
                            );
                        }
                    }
                    > .block {
                        padding: 16px 29px;
                        border-radius: 4px;
                        background-color: themed(
                            'window-template-setting-side-item-block-background-color'
                        );
                        border-width: 1px;
                        border-style: solid;
                        border-color: transparent;

                        > .image {
                            width: 64px;
                            height: 82px;
                            box-shadow: themed(
                                'window-template-setting-side-item-image-box-shadow'
                            );
                            border: solid 1px
                                themed('label-with-dropdown-border-color');
                            background-color: themed(
                                'window-template-setting-side-item-image-background-color'
                            );

                            &.daily {
                                background-image: url('../../asset/Thumbnail_DailyReport.jpg');
                            }
                            > svg {
                                margin-top: 30px;
                                margin-left: 20px;
                                ::v-deep path {
                                    fill: themed(
                                        'window-template-setting-side-item-image-icon-color'
                                    );
                                }
                            }
                        }
                    }
                    > .text {
                        margin-top: 6px;
                        font-size: 12px;
                        font-weight: 500;
                        text-align: center;
                        color: themed('common-font-color');
                        > span {
                            display: inline-block;
                            max-width: 100px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    > input[type='file'] {
                        position: absolute;
                        display: inline-block;
                        width: 120px;
                        height: 120px;
                        left: 0px;
                        top: 0px;
                        cursor: pointer;
                        opacity: 0;
                    }
                }
            }
            > .main {
                flex: 1;

                > .item {
                    display: flex;
                    margin-bottom: 15px;
                    > .left {
                        flex: 0 0 130px;
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 36px;
                        height: 36px;
                        color: themed('common-font-color');
                    }
                    > .right {
                        flex: 1;

                        > span.day {
                            display: inline-block;
                            margin-top: 8px;
                        }

                        &.vertical {
                            ::v-deep .domain-group-selector {
                                > div {
                                    flex-direction: column;
                                }
                            }
                        }

                        .dropdown-wrapper {
                            display: inline-flex;

                            > span {
                                display: inline-block;
                                border-top-left-radius: 4px;
                                border-bottom-left-radius: 4px;
                                padding: 6px 12px;
                                max-height: 34px;
                                border-left: 1px solid
                                    themed('label-with-dropdown-border-color');
                                border-top: 1px solid
                                    themed('label-with-dropdown-border-color');
                                border-bottom: 1px solid
                                    themed('label-with-dropdown-border-color');
                                background-color: themed(
                                    'label-with-dropdown-background-color'
                                );
                            }
                            ::v-deep .aries-ui-dropdown {
                                margin-left: -1px;
                                border-top-left-radius: 0px !important;
                                border-bottom-left-radius: 0px !important;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
