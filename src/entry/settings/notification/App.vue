<template>
    <div class="app">
        <div class="title">{{ i18nMessages.title }}</div>
        <div class="row">
            <div class="left">{{ i18nMessages.pushAlarm }}</div>
            <div class="right">
                <toggle-switch normal v-model="activePushAlarm"></toggle-switch>
            </div>
        </div>
        <div class="row">
            <div class="left">{{ i18nMessages.pushAlarmSound }}</div>
            <div class="right">
                <toggle-switch
                    normal
                    v-model="activeAlarmSound"
                ></toggle-switch>
            </div>
        </div>

        <template v-if="isAdmin">
            <div class="row">
                <div class="left">{{ i18nMessages.alarmEventLevel }}</div>
                <div class="right">
                    <div class="checkbox-wrapper">
                        <checkbox
                            :label="i18nMessages.normal"
                            v-model="normalStatus.active"
                        ></checkbox>
                    </div>
                    <div class="checkbox-wrapper">
                        <checkbox
                            :label="i18nMessages.warning"
                            v-model="warningStatus.active"
                        ></checkbox>
                    </div>
                    <div class="checkbox-wrapper">
                        <checkbox
                            :label="i18nMessages.fatal"
                            v-model="fatalStatus.active"
                        ></checkbox>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18nMessages.alarmEventTime }}</div>
                <div class="right">
                    <div class="input-wrapper">
                        <div class="subject">{{ i18nMessages.normal }}</div>
                        <div class="main">
                            <format-number-input
                                normal
                                :width="89"
                                :min="0"
                                :max="300"
                                v-model="normalStatus.delay"
                            ></format-number-input>
                            <span>{{ i18nMessages.sec }}</span>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="subject">{{ i18nMessages.warning }}</div>
                        <div class="main">
                            <format-number-input
                                normal
                                :width="89"
                                :min="0"
                                :max="300"
                                v-model="warningStatus.delay"
                            ></format-number-input>
                            <span>{{ i18nMessages.sec }}</span>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="subject">{{ i18nMessages.fatal }}</div>
                        <div class="main">
                            <format-number-input
                                normal
                                :width="89"
                                :min="0"
                                :max="300"
                                v-model="fatalStatus.delay"
                            ></format-number-input>
                            <span>{{ i18nMessages.sec }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18nMessages.alarmSound }}</div>
                <div class="right">
                    <div class="dropdown-wrapper">
                        <div class="subject">{{ i18nMessages.normal }}</div>
                        <div class="main">
                            <dropdown
                                normal
                                :width="438"
                                :items="soundItems"
                                :selected-value="normalStatus.sound"
                                @onchange="onChangeNormalSound"
                            ></dropdown>
                            <btn
                                normal
                                :items="[{ iconType: iconTypes.soundOn }]"
                                @click="onPlaySoundItem('normalStatus')"
                            ></btn>
                        </div>
                    </div>
                    <div class="dropdown-wrapper">
                        <div class="subject">{{ i18nMessages.warning }}</div>
                        <div class="main">
                            <dropdown
                                normal
                                :width="438"
                                :items="soundItems"
                                :selected-value="warningStatus.sound"
                                @onchange="onChangeWarningSound"
                            ></dropdown>
                            <btn
                                normal
                                :items="[{ iconType: iconTypes.soundOn }]"
                                @click="onPlaySoundItem('warningStatus')"
                            ></btn>
                        </div>
                    </div>
                    <div class="dropdown-wrapper">
                        <div class="subject">{{ i18nMessages.fatal }}</div>
                        <div class="main">
                            <dropdown
                                normal
                                :width="438"
                                :items="soundItems"
                                :selected-value="fatalStatus.sound"
                                @onchange="onChangeFatalSound"
                            ></dropdown>
                            <btn
                                normal
                                :items="[{ iconType: iconTypes.soundOn }]"
                                @click="onPlaySoundItem('fatalStatus')"
                            ></btn>
                        </div>
                    </div>
                    <checkbox
                        :label="i18nMessages.soundLoop"
                        v-model="soundLoop"
                    ></checkbox>
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18nMessages.alarmSaveStatus }}</div>
                <div class="right">
                    <div class="dropdown-wrapper">
                        <div class="subject">
                            {{ i18nMessages.alarmMaxAge }}
                        </div>
                        <div class="main">
                            <dropdown
                                normal
                                :width="90"
                                :items="ageItems"
                                :selected-value="maxAge"
                                @onchange="onChangeMaxAge"
                            ></dropdown>
                        </div>
                    </div>
                    <div class="dropdown-wrapper">
                        <div class="subject">
                            {{ i18nMessages.alarmMaxCount }}
                        </div>
                        <div class="main">
                            <dropdown
                                normal
                                :width="90"
                                :items="countItems"
                                :selected-value="maxCount"
                                @onchange="onChangeMaxCount"
                            ></dropdown>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <btn
                    class="primary"
                    normal
                    :loading="saveLoading"
                    :items="[{ text: i18nMessages.saveChanges }]"
                    @click="onClickSaveBtn"
                ></btn>
            </div>

            <audio
                v-for="sound in soundItems"
                :name="`sound_${sound.value}`"
                :key="sound.value"
                muted="muted"
            >
                <source
                    v-if="sound.value > 0 && sound.value < 4"
                    :src="`/sound/${sound.text}`"
                    type="audio/mpeg"
                />
                <source
                    v-else
                    :src="`/static/sound/read?name=${sound.text}`"
                    type="audio/mpeg"
                />
            </audio>
        </template>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { loadUserInfo } from '../basic/service';
import {
    savePushAlarm,
    loadAlarmOptions,
    loadSoundFiles,
    saveAlarmOptions,
} from './service';
import i18nMessages from './i18n';

export default {
    inject: ['isAdmin'],
    components: {
        Btn,
        ToggleSwitch,
        Checkbox,
        FormatNumberInput,
        Dropdown,
    },
    data() {
        return {
            saveLoading: false,
            activePushAlarm: false,
            activeAlarmSound: false,

            normalStatus: {
                active: true,
                delay: 3,
                sound: 1,
            },
            warningStatus: {
                active: true,
                delay: 5,
                sound: 2,
            },
            fatalStatus: {
                active: true,
                delay: 8,
                sound: 3,
            },
            soundLoop: false,
            maxAge: 10,
            maxCount: 20,

            ageItems: Array.from({ length: 7 }, (_, i) => {
                const v = i + 1;
                return {
                    text: `${v}`,
                    value: v,
                };
            }),
            countItems: Array.from({ length: 10 }, (_, i) => {
                const v = (i + 1) * 10;
                return {
                    text: `${v}`,
                    value: v,
                };
            }),
            soundItems: [],

            iconTypes: {
                soundOn: ICON_TYPE.soundOn,
            },
            i18nMessages,
        };
    },
    methods: {
        async onClickSaveBtn() {
            this.saveLoading = true;
            await savePushAlarm(this.activePushAlarm, this.activeAlarmSound);
            await saveAlarmOptions(
                this.normalStatus,
                this.warningStatus,
                this.fatalStatus,
                this.soundLoop,
                this.maxAge,
                this.maxCount
            );
            location.reload();
        },
        async createUserInfo() {
            const { data } = await loadUserInfo();
            this.activePushAlarm = data.desktopPush;
            this.activeAlarmSound = data.soundPush;
        },
        async createAlarmOptions() {
            const { data } = await loadAlarmOptions();
            this.$set(this.normalStatus, 'active', data.normalStatus);
            this.$set(this.normalStatus, 'delay', data.normalTimeout / 1000);
            this.$set(this.normalStatus, 'sound', data.normalSound);
            this.$set(this.warningStatus, 'active', data.warningStatus);
            this.$set(this.warningStatus, 'delay', data.warningTimeout / 1000);
            this.$set(this.warningStatus, 'sound', data.warningSound);
            this.$set(this.fatalStatus, 'active', data.fatalStatus);
            this.$set(this.fatalStatus, 'delay', data.fatalTimeout / 1000);
            this.$set(this.fatalStatus, 'sound', data.fatalSound);
            this.soundLoop = data.soundLoop;
            this.maxAge = data.maxAge;
            this.maxCount = data.maxCount;

            loadSoundFiles().then(res => {
                this.soundItems = res.data.map(row => {
                    return {
                        text: row.name,
                        value: row.key,
                    };
                });
            });
        },
        onChangeNormalSound({ value }) {
            this.$set(this.normalStatus, 'sound', value);
        },
        onChangeWarningSound({ value }) {
            this.$set(this.warningStatus, 'sound', value);
        },
        onChangeFatalSound({ value }) {
            this.$set(this.fatalStatus, 'sound', value);
        },
        onChangeMaxAge({ value }) {
            this.maxAge = value;
        },
        onChangeMaxCount({ value }) {
            this.maxCount = value;
        },
        onPlaySoundItem(type) {
            const selector = `[name=sound_${this[type].sound}]`;
            document.querySelector(selector).play();
        },
    },
    async created() {
        await this.createUserInfo();
        if (this.isAdmin) await this.createAlarmOptions();
    },
};
</script>

<style lang="scss" scoped>
@import '../basic/base.scss';

.app {
    .right {
        .checkbox-wrapper,
        .input-wrapper,
        .dropdown-wrapper {
            &:not(:last-child) {
                margin-bottom: 16px;
            }
        }

        .dropdown-wrapper {
            > .subject {
                margin-bottom: 8px;
            }
            > .main {
                display: flex;
                > * {
                    margin-right: 8px;
                }
            }
        }

        .input-wrapper {
            display: flex;
            > .subject {
                width: 60px;
                line-height: 36px;
            }
            > .main {
                > span {
                    margin-left: 4px;
                }
            }
        }
    }
}
</style>
