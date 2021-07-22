<template>
    <div class="advanced-options">
        <div class="option">
            <div class="message" v-html="i18n.M0664"></div>
            <div class="baseline-option-group">
                <div>
                    <radio :active="!baselineNone"
                           @change="onChangeAdvancedOption('baselineNone', false)" />
                    <format-number-input
                            :min="0"
                            :width="80"
                            :value="baselineIgnorablePositive"
                            :disabled="baselineNone"
                            @input="
                    value =>
                        onChangeAdvancedOption(
                            'baselineIgnorableMethodElapsedTimeForSendToDataServer',
                            value
                        )
                "
                    />
                    <span>{{ i18n.ms }}</span>
                </div>
                <div>
                    <radio :label="i18n.sendAll"
                           :active="baselineNone"
                           @change="onChangeAdvancedOption('baselineNone', true)" />
                </div>
            </div>
        </div>
        <div class="option">
            <div class="message" v-html="i18n.M0665"></div>
            <format-number-input
                :min="0"
                :width="80"
                :value="methodSamplingStackDepthLimit"
                @input="
                    value =>
                        onChangeAdvancedOption(
                            'methodSamplingStackDepthLimit',
                            value
                        )
                "
            ></format-number-input>
        </div>
        <div class="option">
            <div class="message" v-html="i18n.M0666"></div>
            <format-number-input
                :min="0"
                :width="80"
                :value="checkIntervalForSelectTransactionToProfile"
                @input="
                    value =>
                        onChangeAdvancedOption(
                            'checkIntervalForSelectTransactionToProfile',
                            value
                        )
                "
            ></format-number-input>
            <span>{{ i18n.ms }}</span>
        </div>
        <div class="option">
            <div class="message" v-html="i18n.M0667"></div>
            <format-number-input
                :min="0"
                :width="120"
                :value="clearInterval"
                @input="value => onChangeAdvancedOption('clearInterval', value)"
            ></format-number-input>
            <span>{{ i18n.ms }}</span>
        </div>
        <div class="option">
            <div class="message" v-html="i18n.M0668"></div>
            <format-number-input
                :min="0"
                :width="80"
                :value="maxProfileTargetCount"
                @input="
                    value =>
                        onChangeAdvancedOption('maxProfileTargetCount', value)
                "
            ></format-number-input>
        </div>
        <div class="option">
            <div class="message" v-html="i18n.M0669"></div>
            <format-number-input
                :min="0"
                :width="80"
                :value="profileQueueSize"
                @input="
                    value => onChangeAdvancedOption('profileQueueSize', value)
                "
            ></format-number-input>
        </div>
    </div>
</template>

<script>
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Radio from "@vuejs/component/Toggle/Radio";
import { mapState, mapMutations } from '../store/autoProfile';

export default {
    inject: ['i18n'],
    components: {
        FormatNumberInput,
        Radio,
    },
    computed: {
        ...mapState([
            'baselineIgnorableMethodElapsedTimeForSendToDataServer',
            'baselineNone',
            'methodSamplingStackDepthLimit',
            'checkIntervalForSelectTransactionToProfile',
            'clearInterval',
            'maxProfileTargetCount',
            'profileQueueSize',
        ]),
        baselineIgnorablePositive()  {
            if (this.baselineIgnorableMethodElapsedTimeForSendToDataServer < 0) return 0;
            return this.baselineIgnorableMethodElapsedTimeForSendToDataServer;
        }
    },
    methods: {
        ...mapMutations(['updateInstanceSettings']),
        onChangeAdvancedOption(key, value) {
            this.updateInstanceSettings({
                [key]: value,
            });
            if (key === 'baselineNone') {
                !value && this.updateInstanceSettings({
                    baselineIgnorableMethodElapsedTimeForSendToDataServer: 0,
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.advanced-options {
    @include themify($themes) {
        > .option {
            &:not(:last-child) {
                padding-bottom: 24px;
                border-bottom: 1px solid themed('common-border-color');
            }
            &:not(:first-child) {
                padding-top: 24px;
            }
            > .message {
                margin-bottom: 16px;
                line-height: 22px;
                color: themed('common-description-font-color');
            }
            > .baseline-option-group > :first-child {
                margin-bottom: 8px;
            }
        }
    }
}
</style>
