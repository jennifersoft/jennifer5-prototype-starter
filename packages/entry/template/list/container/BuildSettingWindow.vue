<template>
    <window
        @cancel="() => $emit('cancel')"
        @apply="onSubmitBuildSetting"
        :open-w="500"
        :open-h="windowHeight"
        :draggable="false"
        :messages="{
            apply: i18n.apply,
            cancel: i18n.cancel,
        }"
        class="build-setting-window"
    >
        <template #subject>
            <span>{{ i18n.autoBuildSet }}</span>
        </template>

        <div class="row-group">
            <div class="row">
                <div class="left">{{ i18n.autoBuild }}</div>
                <div class="right toggle">
                    <toggle-switch v-model="activeAutoBuild" normal />
                </div>
            </div>
        </div>
        <div class="row-group" v-if="activeAutoBuild">
            <div class="row">
                <div class="left" style="flex: 1;">{{ i18n.buildCycle }}</div>
                <div class="right" style="flex: 2;">
                    <dropdown
                        normal
                        :width="mainInputWidth"
                        :items="buildTypes"
                        :selected-value="selectedBuildType"
                        @onchange="onChangeBuildType"
                    ></dropdown>
                    <dropdown
                        v-if="selectedBuildType === 2"
                        normal
                        :width="subInputWidth"
                        :items="weekTypes"
                        :selected-value="selectedBuildEtc"
                        @onchange="onChangeBuildEtc"
                    ></dropdown>
                    <dropdown
                        v-else-if="selectedBuildType === 3"
                        normal
                        :width="subInputWidth"
                        :items="dayTypes"
                        :selected-value="selectedBuildEtc"
                        @onchange="onChangeBuildEtc"
                    ></dropdown>
                    <format-number-input
                        v-else-if="selectedBuildType === 4"
                        normal
                        :style="{ width: `${subInputWidth}px` }"
                        :unit="i18n.dayUnit"
                        :value="selectedBuildEtc"
                        :min="1"
                        :max="31"
                        @input="value => onChangeBuildEtc({ value })"
                    />
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18n.buildDirectory }}</div>
                <div class="right">
                    <dropdown
                        normal
                        :width="250"
                        :items="optDirectoryList"
                        :selected-value="selectedDirectoryKey"
                        @onchange="onChangeDirectoryKey"
                    ></dropdown>
                </div>
            </div>
            <div class="row">
                <div class="left" style="flex: 2;">
                    {{ i18n.buildSendMail }}
                </div>
                <div class="right toggle" style="flex: 1;">
                    <toggle-switch v-model="activeSendEmail" normal />
                </div>
            </div>
        </div>
        <div class="row-group" v-if="activeAutoBuild && activeSendEmail">
            <div class="row">
                <div class="left">{{ i18n.senderMail }}</div>
                <div class="right">
                    <dropdown
                        normal
                        :width="250"
                        :items="optUserMailList"
                        :selected-value="selectedSenderMail"
                        @onchange="onChangeSenderMail"
                    ></dropdown>
                </div>
            </div>
            <div class="row">
                <div class="left">{{ i18n.senderName }}</div>
                <div class="right">
                    <input-field
                        v-model="selectedSenderName"
                        :style="{ width: `${mainInputWidth}px` }"
                    />
                </div>
            </div>
            <div class="row">
                <div class="left" style="flex: 1">{{ i18n.receiver }}</div>
                <div class="right" style="flex: 2">
                    <input-field
                        v-model="selectedReceivers"
                        placeholder="abc@example.com"
                        :style="{ width: `${mainInputWidth}px` }"
                    />
                    <dropdown
                        class="user-group-list"
                        normal
                        :width="mainInputWidth"
                        :items="optUserGroupList"
                        @onchange="onLoadUserMailListInGroup"
                    ></dropdown>
                </div>
            </div>
        </div>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import InputField from '@vuejs/component/Input/InputField';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import { validCheckEmail } from '@common/utility';
import { mapState as baseMapState } from '@entry/document/list/vuex';
import { mapState, mapActions } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        Window,
        Dropdown,
        ToggleSwitch,
        InputField,
        FormatNumberInput,
    },
    props: {
        mailForm: {
            type: Object,
            required: true,
        },
    },
    watch: {
        // Props
        mailForm(data) {
            this.selectedKey = data.key;
            this.selectedDirectoryKey = data.directoryKey;
            this.activeAutoBuild = data.buildDist !== '';
            this.activeSendEmail = data.useSendMail;
            this.selectedSenderMail = data.senderMail;
            this.selectedSenderName = data.senderName;
            this.selectedReceivers = data.receivers;

            if (this.activeAutoBuild) {
                const tokens = data.buildDist.split(',');
                if (tokens[0]) this.selectedBuildType = parseInt(tokens[0]);
                if (tokens[1]) this.selectedBuildEtc = parseInt(tokens[1]);

                if (this.activeSendEmail)
                    this.windowHeight =
                        this.activeAutoBuild && active ? 450 : 340;
            }
        },

        // Data
        activeSendEmail(active) {
            this.windowHeight = active ? 450 : 340;
        },
    },
    data() {
        const buildTypeNames = [
            this.i18n.daily,
            this.i18n.weekly,
            this.i18n.monthly,
            this.i18n.custom,
        ];
        const weekTypeNames = [
            this.i18n.sunday,
            this.i18n.monday,
            this.i18n.tuesday,
            this.i18n.wednesday,
            this.i18n.thursday,
            this.i18n.friday,
            this.i18n.saturday,
        ];

        return {
            mainInputWidth: 150,
            subInputWidth: 120,
            windowHeight: 340,

            buildTypes: buildTypeNames.map((text, i) => {
                return { text: text, value: i + 1 };
            }),
            weekTypes: weekTypeNames.map((text, i) => {
                return { text: text, value: i + 1 };
            }),
            dayTypes: [...Array(31).keys()].map(i => {
                return { text: `${i + 1}${this.i18n.dayUnit}`, value: i + 1 };
            }),

            selectedBuildType: 1,
            selectedBuildEtc: 1, // buildType 값에 따라 값이 달라짐
            selectedDirectoryKey: '*',
            selectedKey: null,

            activeAutoBuild: false,
            activeSendEmail: false,

            selectedSenderMail: '',
            selectedSenderName: 'Reporter',
            selectedReceivers: '',
        };
    },
    computed: {
        ...baseMapState({
            directoryList: state =>
                state.directoryList
                    .filter(dir => dir.key !== '*')
                    .map(dir => {
                        return {
                            text: dir.name,
                            value: dir.key,
                        };
                    }),
        }),
        ...mapState({
            userMailList: state =>
                state.userMailList.map(data => {
                    return {
                        text: data.mail,
                        value: data.key,
                    };
                }),
            userGroupList: state =>
                state.userGroupList.map(group => {
                    return {
                        text: group.value,
                        value: group.key,
                    };
                }),
        }),
        optDirectoryList() {
            return [
                { text: this.i18n.noDir, value: '*' },
                ...this.directoryList,
            ];
        },
        optUserMailList() {
            return [
                { text: `(${this.i18n.noChoice})`, value: '' },
                ...this.userMailList,
            ];
        },
        optUserGroupList() {
            return [
                { text: this.i18n.addByGroup, value: '' },
                ...this.userGroupList,
            ];
        },
    },
    methods: {
        ...mapActions(['loadUserMailListInGroup', 'saveTemplateBuildSetting']),
        async onLoadUserMailListInGroup({ value }) {
            const mailList = await this.loadUserMailListInGroup(value);
            this.selectedReceivers = mailList
                .filter(mail => validCheckEmail(mail) && mail !== '')
                .join(';');
        },
        onChangeBuildType({ value }) {
            this.selectedBuildType = value;
            this.selectedBuildEtc = 1;
        },
        onChangeBuildEtc({ value }) {
            this.selectedBuildEtc = value;
        },
        onChangeSenderMail({ value }) {
            this.selectedSenderMail = value;
        },
        onChangeDirectoryKey({ value }) {
            this.selectedDirectoryKey = value;
        },
        async onSubmitBuildSetting() {
            if (this.activeSendEmail && this.selectedReceivers === '') {
                this.$emit('alert', this.i18n.M0299);
                return;
            }

            await this.saveTemplateBuildSetting({
                buildDist:
                    this.selectedBuildType === 1
                        ? '1'
                        : `${this.selectedBuildType},${this.selectedBuildEtc}`,
                checkSendMail: this.activeSendEmail,
                directoryKey: this.selectedDirectoryKey,
                key: this.selectedKey,
                mailReceiver: this.selectedReceivers,
                mailSender: this.selectedSenderMail,
                mailSenderName: this.selectedSenderName,
            });

            this.$emit('apply');
        },
    },
};
</script>

<style lang="scss" scoped>
.build-setting-window {
    .body {
        .row-group {
            > .row {
                display: flex;
                margin-bottom: 10px;
                height: 36px;
                line-height: 36px;
                > div {
                    flex: 1;
                    &.right {
                        text-align: right;
                        &.toggle {
                            line-height: 24px;
                        }
                    }
                }
            }
        }
    }

    ::v-deep .aries-ui-dropdown .row-list {
        text-align: left;
    }

    ::v-deep .user-group-list .row-list {
        height: 65px;
    }
}
</style>
