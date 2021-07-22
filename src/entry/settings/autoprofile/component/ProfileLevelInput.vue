<template>
    <div class="profile-level-input">
        <div>
            <b>{{ i18n.minResponseTime }}</b>
            <div class="message" v-html="i18n.M0670"></div>
            <format-number-input
                :width="80"
                :step="100"
                :min="0"
                :value="minResponseTime"
                @input="onChangeMinResponseTime"
            ></format-number-input>
            <span>{{ i18n.ms }}</span>
        </div>
        <div>
            <b>{{ i18n.samplingCycle }}</b>
            <div class="message" v-html="i18n.M0671"></div>
            <format-number-input
                :width="80"
                :step="100"
                :min="0"
                :value="samplingCycle"
                @input="onChangeSamplingCycle"
            ></format-number-input>
            <span>{{ i18n.ms }}</span>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput.vue';

export default Vue.extend({
    inject: ['i18n'],
    components: {
        FormatNumberInput,
    },
    props: {
        minResponseTime: {
            type: Number,
            required: true,
        },
        samplingCycle: {
            type: Number,
            required: true,
        },
    },
    methods: {
        onChangeMinResponseTime(value) {
            this.$emit('change', {
                minResponseTime: value,
                samplingCycle: this.samplingCycle,
            });
        },

        onChangeSamplingCycle(value) {
            this.$emit('change', {
                minResponseTime: this.minResponseTime,
                samplingCycle: value,
            });
        },
    },
});
</script>

<style lang="scss" scoped>
@import '../themes';

.profile-level-input {
    @include themify($themes) {
        color: themed('common-description-font-color');
        margin-top: 40px;

        > div {
            &:first-child {
                padding-bottom: 24px;
                border-bottom: 1px solid themed('common-border-color');
            }
            &:last-child {
                padding-top: 24px;
            }
        }
        .message {
            margin: 16px 0;
        }
    }
}
</style>
