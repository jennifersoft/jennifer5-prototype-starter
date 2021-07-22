<template>
    <div class="profile-level-selector">
        <div class="profile-level">
            <div class="check">
                <checkbox
                    :active="AutoProfileLevel[profileLevel] === 0"
                    @change="onChangeAutoProfileLevel(0)"
                ></checkbox>
            </div>
            <div class="info">
                <div class="message" v-html="i18n.M0660"></div>
                <profile-level-text
                    :min-response-time="1000"
                    :sampling-cycle="1000"
                    v-if="AutoProfileLevel[profileLevel] === 0"
                ></profile-level-text>
            </div>
        </div>
        <div class="profile-level">
            <div class="check">
                <checkbox
                    :active="AutoProfileLevel[profileLevel] === 1"
                    @change="onChangeAutoProfileLevel(1)"
                ></checkbox>
            </div>
            <div class="info">
                <div class="message" v-html="i18n.M0661"></div>
                <profile-level-text
                    :min-response-time="100"
                    :sampling-cycle="100"
                    v-if="AutoProfileLevel[profileLevel] === 1"
                ></profile-level-text>
            </div>
        </div>
        <div class="profile-level">
            <div class="check">
                <checkbox
                    :active="AutoProfileLevel[profileLevel] === 2"
                    @change="onChangeAutoProfileLevel(2)"
                ></checkbox>
            </div>
            <div class="info">
                <div class="message" v-html="i18n.M0662"></div>
                <profile-level-text
                    :min-response-time="0"
                    :sampling-cycle="10"
                    v-if="AutoProfileLevel[profileLevel] === 2"
                ></profile-level-text>
            </div>
        </div>
        <div class="profile-level">
            <div class="check">
                <checkbox
                    :active="AutoProfileLevel[profileLevel] === 3"
                    @change="onChangeAutoProfileLevel(3)"
                ></checkbox>
            </div>
            <div class="info">
                <div class="message" v-html="i18n.M0663"></div>
                <profile-level-input
                    :min-response-time="baselineMethodElapsedTimeForProfile"
                    :sampling-cycle="methodSamplingIntervalDuringProfile"
                    @change="onChangeProfileLevelInput"
                    v-if="AutoProfileLevel[profileLevel] === 3"
                ></profile-level-input>
            </div>
        </div>
    </div>
</template>

<script>
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import ProfileLevelText from '../component/ProfileLevelText';
import ProfileLevelInput from '../component/ProfileLevelInput';
import { AutoProfileLevel } from '@common/definition';
import { mapState, mapMutations } from '../store/autoProfile';

export default {
    inject: ['i18n'],
    components: {
        Checkbox,
        ProfileLevelText,
        ProfileLevelInput,
    },
    computed: {
        ...mapState([
            'profileLevel',
            'baselineMethodElapsedTimeForProfile',
            'methodSamplingIntervalDuringProfile',
        ]),
    },
    data() {
        return {
            AutoProfileLevel,
        };
    },
    methods: {
        ...mapMutations(['updateInstanceSettings']),
        onChangeAutoProfileLevel(index) {
            this.updateInstanceSettings({
                profileLevel: Object.keys(AutoProfileLevel)[index],
            });
        },
        onChangeProfileLevelInput(data) {
            this.updateInstanceSettings({
                baselineMethodElapsedTimeForProfile: data.minResponseTime,
                methodSamplingIntervalDuringProfile: data.samplingCycle,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.profile-level-selector {
    @include themify($themes) {
        color: themed('common-description-font-color');

        > .profile-level {
            display: flex;
            line-height: 22px;

            &:not(:first-child) {
                padding-top: 24px;
            }

            &:not(:last-child) {
                padding-bottom: 24px;
                border-bottom: 1px solid themed('common-border-color');
            }

            > .check {
                flex: 0 30px;
                padding-top: 22px;
            }

            > .info {
                flex: 1;
            }
        }
    }
}
</style>
