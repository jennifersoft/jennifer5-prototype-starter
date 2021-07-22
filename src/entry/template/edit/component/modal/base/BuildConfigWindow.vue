<template>
    <base-window
        class="build-config-window"
        :draggable="false"
        :width="700"
        :height="430"
        :parent-width="parentWidth"
        :parent-height="parentHeight"
        @cancel="onClickCancelBtn"
        @apply="onClickBuildBtn"
    >
        <template #subject>{{ i18n.setting }}</template>
        <template #contents>
            <div class="contents">
                <div class="item" v-if="parentKey === 'title'">
                    <div class="left">{{ i18n.chartTitle }}</div>
                    <div class="right">
                        <input-field
                            :value="individualData.title"
                            :width="200"
                            @input="onUpdateParentConfig"
                        ></input-field>
                    </div>
                </div>
                <div class="item" v-else>
                    <div class="left">{{ i18n.maxRow }}</div>
                    <div class="right">
                        <format-number-input
                            :value="individualData.maxRow"
                            :max="100"
                            :width="80"
                            @input="onUpdateParentConfig"
                        ></format-number-input>
                    </div>
                </div>
                <div class="item">
                    <div class="left">{{ i18n.customSetting }}</div>
                    <div class="right">
                        <build-config
                            :check-manual-domain="checkManualDomain"
                            :check-manual-domain-disabled="
                                checkManualDomainDisabled
                            "
                            :check-manual-day="checkManualDay"
                            :check-manual-day-hidden="checkManualDayHidden"
                            :build-time-value="buildTimeValue"
                            :run-time-value="runTimeValue"
                            @update="onUpdateBuildConfig"
                        ></build-config>
                    </div>
                </div>
            </div>
        </template>
    </base-window>
</template>
<script>
import InputField from '@vuejs/component/Input/InputField';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import BaseWindow from '../BaseWindow';
import BuildConfig from './BuildConfig';
import { i18n } from '@common/utility';

export default {
    components: {
        BaseWindow,
        BuildConfig,
        InputField,
        FormatNumberInput,
    },
    props: {
        parentKey: {
            type: String,
            required: true,
            validator: v => {
                return ['title', 'maxRow'].includes(v);
            },
        },
        parentWidth: {
            type: Number,
            required: true,
        },
        parentHeight: {
            type: Number,
            required: true,
        },

        title: {
            type: String,
            required: false,
            default: '',
        },
        maxRow: {
            type: Number,
            required: false,
            default: 40,
        },
        checkManualDomain: {
            type: Boolean,
            required: true,
        },
        checkManualDay: {
            type: Boolean,
            required: true,
        },
        buildTimeValue: {
            type: String,
            required: true,
        },
        runTimeValue: {
            type: String,
            required: true,
        },

        checkManualDomainDisabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        checkManualDayHidden: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            i18n: {
                setting: i18n.get('ui.label.setting'),
                chartTitle: i18n.get('ui.label.chartTitle'),
                maxRow: i18n.get('ui.label.maxRows'),
                customSetting: i18n.get('ui.label.customSetting'),
            },
            individualData: {
                title: this.title,
                maxRow: this.maxRow,
            },
            commonData: {
                checkManualDomain: this.checkManualDomain,
                checkManualDay: this.checkManualDay,
                buildTimeValue: this.buildTimeValue,
                runTimeValue: this.runTimeValue,
            },
        };
    },
    methods: {
        onClickCancelBtn() {
            this.$emit('cancel');
        },
        onClickBuildBtn() {
            this.$emit('apply', {
                [this.parentKey]: this.individualData[this.parentKey],
                ...this.commonData,
            });
        },
        onUpdateParentConfig(value) {
            this.individualData[this.parentKey] = value;
        },
        onUpdateBuildConfig(data) {
            this.commonData = data;
        },
    },
};
</script>
<style lang="scss" scoped>
.build-config-window {
    @import '../../../style/window-sub-title';
    @include window-sub-title;

    @import '../../../themes';
    @include themify($themes) {
        .contents {
            > .item {
                display: flex;
                margin-bottom: 24px;
                max-height: 36px;
                &:first-child {
                    line-height: 36px;
                }
                > .left {
                    flex: 0 0 170px;
                    font-size: 14px;
                    font-weight: 500;
                    color: themed('common-font-color');
                }
                > .right {
                    flex: 1;
                }
            }
        }
    }
}
</style>
