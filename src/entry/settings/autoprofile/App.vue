<template>
    <div class="root">
        <div class="app">
            <div class="title">
                {{ i18nMessages.title }}
                <span class="auto-profile-list-btn">
                    <btn
                        normal
                        class="border-none"
                        :pressed="openAutoProfileList"
                        :items="[{ iconType: iconTypes.menu }]"
                        :tooltip-options="{
                            message: i18nMessages.profiledMethods,
                            position: 'center-left',
                        }"
                        @click="onToggleAutoProfileList"
                    ></btn>
                </span>
            </div>
            <div class="row">
                <instance-selector
                    @change="onChangeInstanceSelector"
                ></instance-selector>
            </div>
            <div class="row">
                <div class="left">{{ i18nMessages.instance }}</div>
                <div class="right">
                    <strong>{{ name }}</strong>
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18nMessages.activeProfileSettings }}</div>
                <div class="right">
                    <toggle-switch
                        :active="enable"
                        @change="onActiveAutoProfile"
                    ></toggle-switch>
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18nMessages.minResponseTime }}</div>
                <div class="right">
                    <div class="message" v-html="i18nMessages.M0659"></div>
                    <div class="form">
                        <format-number-input
                            :value="baselineTransactionElapsedTimeForProfile"
                            :width="80"
                            :step="100"
                            :min="0"
                            @input="onChangeMinResponseTime"
                        ></format-number-input>
                        <span>{{ i18nMessages.ms }}</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18nMessages.profileLevel }}</div>
                <div class="right">
                    <profile-level-selector></profile-level-selector>
                </div>
            </div>
            <!-- TODO: 에이전트가 준비되면 활성화하기 -->
            <div class="row" v-if="false">
                <div class="left">{{ i18nMessages.exceptPackageProfile }}</div>
                <div class="right">
                    <except-profile-package></except-profile-package>
                </div>
            </div>
            <div class="row">
                <div class="left">
                    {{ i18nMessages.settingAdvancedOptions }}
                </div>
                <div class="right">
                    <advanced-options
                        v-if="openAdvancedOptions"
                    ></advanced-options>
                </div>
                <span class="icon">
                    <btn
                        normal
                        class="border-none"
                        :items="[
                            {
                                iconType: openAdvancedOptions
                                    ? iconTypes.open
                                    : iconTypes.fold,
                            },
                        ]"
                        @click="onToggleAdvancedOptions"
                    ></btn>
                </span>
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
        </div>
        <div class="side-menu" v-if="openAutoProfileList">
            <div class="top">
                {{ i18nMessages.profiledMethods }}
                <span class="close">
                    <btn
                        normal
                        class="border-none"
                        :items="[{ iconType: iconTypes.close }]"
                        @click="() => (openAutoProfileList = false)"
                    ></btn>
                </span>
            </div>
            <div class="bottom">
                <profile-queue
                    :items="profiledMethods"
                    :use-delete-btn="false"
                    @except="method => (profiledMethod = method)"
                ></profile-queue>
            </div>
        </div>
        <confirm-window
            :message="i18nMessages.M0672"
            @cancel="() => (profiledMethod = '')"
            @apply="onAddExceptProfiledMethod"
            v-if="profiledMethod !== ''"
        ></confirm-window>
    </div>
</template>

<script>
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Search from '@vuejs/component/Input/Search';
import Btn from '@vuejs/component/button/Btn';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import InstanceSelector from './container/InstanceSelector';
import ProfileLevelSelector from './container/ProfileLevelSelector';
import AdvancedOptions from './container/AdvancedOptions';
import ExceptProfilePackage from './container/ExceptProfilePackage';
import ProfileQueue from './component/ProfileQueue';
import i18nMessages from './i18n';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapMutations, mapActions } from './store/autoProfile';
import { mapState as isMapState } from './store/instanceSelector';
import './vuex';

export default {
    provide: {
        i18n: i18nMessages,
    },
    components: {
        ConfirmWindow,
        ProfileQueue,
        ToggleSwitch,
        FormatNumberInput,
        Search,
        Btn,
        InstanceSelector,
        ProfileLevelSelector,
        AdvancedOptions,
        ExceptProfilePackage,
    },
    computed: {
        ...mapState([
            'name',
            'enable',
            'baselineTransactionElapsedTimeForProfile',
            'profiledMethods',
        ]),
        ...isMapState(['domainId', 'instanceId']),
    },
    data() {
        return {
            i18nMessages,
            openAdvancedOptions: false,
            openAutoProfileList: false,
            iconTypes: {
                open: ICON_TYPE.arrowUp,
                fold: ICON_TYPE.arrowDown,
                menu: ICON_TYPE.document,
                close: ICON_TYPE.close,
            },
            profiledMethod: '',
            saveLoading: false,
        };
    },
    methods: {
        ...mapMutations(['updateInstanceSettings', 'addIgnoreClassOrPackages']),
        ...mapActions([
            'saveInstanceSettings',
            'loadInstanceSettings',
            'loadProfiledMethods',
        ]),
        onActiveAutoProfile(enable) {
            this.updateInstanceSettings({
                enable,
            });
        },
        onChangeMinResponseTime(value) {
            this.updateInstanceSettings({
                baselineTransactionElapsedTimeForProfile: value,
            });
        },
        onToggleAdvancedOptions() {
            this.openAdvancedOptions = !this.openAdvancedOptions;
        },
        onAddExceptProfiledMethod() {
            if (this.profiledMethod !== '') {
                this.addIgnoreClassOrPackages(this.profiledMethod);
                this.profiledMethod = '';
            }
        },
        onToggleAutoProfileList() {
            this.openAutoProfileList = !this.openAutoProfileList;
        },
        async onChangeInstanceSelector(payload) {
            await this.loadInstanceSettings(payload);
            this.loadProfiledMethods(payload);
        },
        async onClickSaveBtn() {
            this.saveLoading = true;
            this.saveInstanceSettings({
                domainId: this.domainId,
                instanceId: this.instanceId,
            })
                .then(() => {
                    location.reload();
                })
                .catch(err => {
                    console.error(err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
@import './themes.scss';

.root {
    display: flex;

    @include themify($themes) {
        > .app {
            flex: 3;
            font-size: 12px;

            > .title {
                position: relative;
                height: 29px;

                > .auto-profile-list-btn {
                    position: absolute;
                    top: -4px;
                    right: 12px;
                }
            }

            > .row {
                position: relative;

                > .right {
                    > .form {
                        margin-top: 16px;

                        > span {
                            margin-left: 4px;
                        }
                    }

                    > .message {
                        color: themed('common-description-font-color');
                    }
                }

                > .icon {
                    position: absolute;
                    right: 0px;
                    top: 12px;
                }
            }
        }

        > .side-menu {
            flex: 2;
            border-left: 1px solid themed('common-border-color');

            > .top {
                position: relative;
                color: themed('common-subject-font-color');
                border-bottom: 1px solid themed('common-border-color');
                padding: 17px 24px;
                height: 29px;
                font-size: 16px;
                font-weight: 500;
                > .close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                }
            }
            > .bottom {
                padding: 16px 24px;
            }
        }
    }
}

@import '../basic/base.scss';
</style>
