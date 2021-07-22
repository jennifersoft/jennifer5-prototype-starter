<template>
    <div class="app">
        <div class="title">{{ i18nMessages.title }}</div>
        <div class="row">
            <div class="left">{{ i18nMessages.startPage }}</div>
            <div class="right">
                <dropdown
                    normal
                    :display-row-count="5"
                    :width="commonWidth"
                    :items="menuItems"
                    :selected-value="selectedMenu"
                    :button-options="{ text: noSelectMessage }"
                    @onchange="onChangeMenu"
                ></dropdown>
            </div>
        </div>
        <div class="row">
            <div class="left">{{ i18nMessages.settingExpandedDashboard }}</div>
            <div class="right">
                <div
                    class="information"
                    :style="{ 'max-width': `${commonWidth}px` }"
                >
                    {{ i18nMessages.M0349 }}
                </div>

                <div class="message">{{ i18nMessages.targetCount }}</div>

                <format-number-input
                    :width="80"
                    :max="1000"
                    v-model="selectedTargetCount"
                ></format-number-input>
            </div>
        </div>
        <div class="row">
            <div class="left">{{ i18nMessages.language }}</div>
            <div class="right">
                <dropdown
                    normal
                    :width="commonWidth"
                    :items="languageItems"
                    :selected-value="selectedLanguage"
                    @onchange="onChangeLanguage"
                ></dropdown>
            </div>
        </div>
        <div class="row">
            <div class="left">{{ i18nMessages.theme }}</div>
            <div class="right">
                <dropdown
                    normal
                    :width="commonWidth"
                    :items="themeItems"
                    :selected-value="selectedTheme"
                    @onchange="onChangeTheme"
                ></dropdown>
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
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Btn from '@vuejs/component/button/Btn';
import { saveAll, loadUserInfo, loadMenuItems } from './service';
import i18nMessages from './i18n';

const { mapState } = createNamespacedHelpers('server');

export default {
    components: {
        Dropdown,
        FormatNumberInput,
        Btn,
    },
    computed: {
        ...mapState({
            language: state => state.language,
            theme: state => state.theme,
            expandedDashboardTargetCount: state =>
                state.expandedDashboardTargetCount,
        }),
    },
    data() {
        return {
            menuItems: [],
            languageItems: [
                {
                    text: i18nMessages.korean,
                    value: 'ko',
                },
                {
                    text: i18nMessages.english,
                    value: 'en',
                },
                {
                    text: i18nMessages.japanese,
                    value: 'ja',
                },
            ],
            themeItems: [
                {
                    text: i18nMessages.classicTheme,
                    value: 'classic',
                },
                {
                    text: i18nMessages.darkTheme,
                    value: 'dark',
                },
            ],

            noSelectMessage: '',
            selectedMenu: '/dashboard/multiDomain',
            selectedTargetCount: 10,
            selectedLanguage: 'en',
            selectedTheme: 'classic',

            commonWidth: 480,
            saveLoading: false,

            i18nMessages,
        };
    },
    methods: {
        onChangeMenu({ value }) {
            this.selectedMenu = value;
            this.noSelectMessage = '';
        },
        onChangeLanguage({ value }) {
            this.selectedLanguage = value;
        },
        onChangeTheme({ value }) {
            this.selectedTheme = value;
        },
        onClickSaveBtn() {
            this.saveLoading = true;

            saveAll(
                this.selectedMenu,
                this.selectedTargetCount,
                this.selectedLanguage,
                this.selectedTheme
            )
                .then(() => {
                    location.reload();
                })
                .catch(() => {
                    // TODO: 에외 처리하기
                });
        },
        async createMenuItems() {
            const { data } = await loadMenuItems();
            this.menuItems = data.map(row => {
                return {
                    text: `${i18nMessages[row.type]} / ${row.name}`,
                    value: row.url,
                };
            });
        },
        async createUserInfo() {
            const { data } = await loadUserInfo();
            this.selectedMenu = data.defaultMenuCode;

            // 시작화면이 설정되지 않았을 때
            if (!this.selectedMenu)
                this.noSelectMessage = i18nMessages.noChoice;
        },
    },
    async created() {
        await this.createMenuItems();
        await this.createUserInfo();
        this.selectedTheme = this.theme;
        this.selectedLanguage = this.language;
        this.selectedTargetCount = this.expandedDashboardTargetCount;
    },
};
</script>

<style lang="scss" scoped>
@import './base.scss';

$themes: (
    classic: (
        information-font-color: #616161,
    ),
    dark: (
        information-font-color: #999,
    ),
);

.app {
    @include themify($themes) {
        .information {
            color: themed('information-font-color');
        }
        .message {
            margin: 16px 0px 8px 0px;
            font-size: 12px;
        }
    }
}
</style>
