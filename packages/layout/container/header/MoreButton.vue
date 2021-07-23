<template>
    <div class="more-button" v-click-outside="onHideMoreMenu">
        <btn
            class="border-none"
            normal
            :tooltip-options="{
                message: i18nMessages.more,
            }"
            :pressed="showMoreMenu"
            :items="[{ iconType: iconType }]"
            @click="onToggleMoreMenu"
        />

        <layered-menu :width="300" :right="0" :top="40" v-if="showMoreMenu">
            <popup-list
                type="space"
                no-scroll
                normal
                :items="items"
                @update:active-index="clickMoreMenuItem"
                v-if="items.length > 0"
            />
            <popup-list
                type="checkbox"
                no-scroll
                normal
                multi-select
                :items="[{ text: i18nMessages.M0652 }]"
                :active-index="[activeStartPage]"
                @update:active-index="changeActiveStartPage"
            />
            <popup-list
                type="space"
                no-scroll
                normal
                :items="[{ text: i18nMessages.shareTheCurrentPage }]"
                @update:active-index="shareAutoLoginUrl"
            />
        </layered-menu>

        <confirm-window
            :message="confirmMessage"
            @cancel="() => (confirmMessage = '')"
            @apply="onChangeStartPage"
            v-if="confirmMessage !== ''"
        ></confirm-window>

        <window
            class="share-url-window"
            hide-footer
            :open-w="480"
            :open-h="140"
            :open-x="shareUrlWindowLeft"
            :open-y="shareUrlWindowTop"
            @cancel="() => (autoLoginUrl = '')"
            v-if="autoLoginUrl !== ''"
        >
            <template #subject>
                <div class="window-head">
                    {{ i18nMessages.shareTheCurrentPage }}
                </div>
            </template>
            <div>
                <div class="url-n-btn">
                    <input-field small :value="autoLoginUrl" :width="340" />
                    <btn
                        :items="[{ text: i18nMessages.copy }]"
                        class="border-none size-medium primary outlined"
                        @click="copyAutoLoginUrl"
                    />
                </div>
            </div>
        </window>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import PopupList from '@vuejs/component/dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import Window from '@vuejs/component/window/Window';
import InputField from '@vuejs/component/input/InputField';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import clickOutside from '@vuejs/directive/clickOutside';
import i18nMessages from '../../i18n';
import { mapState, mapActions } from '../../vuex';

export default {
    directives: { clickOutside },
    components: {
        Btn,
        PopupList,
        LayeredMenu,
        Window,
        InputField,
        ConfirmWindow,
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            iconType: ICON_TYPE.moreHorizon,
            showMoreMenu: false,
            confirmMessage: '',
            autoLoginUrl: '',
            pageList: [],
            i18nMessages,
        };
    },
    computed: {
        ...mapState({
            user: state => state.user,
        }),
        activeStartPage() {
            return this.getCurrentUrl() === this.user.startPage;
        },
        shareUrlWindowLeft() {
            return window.innerWidth / 2 - 240;
        },
        shareUrlWindowTop() {
            return window.innerHeight / 2 - 120;
        },
    },
    methods: {
        ...mapActions([
            'changeStartPage',
            'fetchMenuListAll',
            'createAutoLoginUrl',
        ]),
        async onToggleMoreMenu() {
            if (!this.showMoreMenu && this.pageList.length === 0) {
                const { data } = await this.fetchMenuListAll();
                this.pageList = data;
            }
            this.showMoreMenu = !this.showMoreMenu;
        },
        onHideMoreMenu() {
            this.showMoreMenu = false;
        },
        async onChangeStartPage() {
            await this.changeStartPage(this.getCurrentUrl());
            this.confirmMessage = '';
        },
        async changeActiveStartPage() {
            if (this.activeStartPage) {
                await this.changeStartPage('');
            } else {
                const startPage = this.user.startPage;

                if (startPage !== '') {
                    this.onHideMoreMenu();
                    this.autoLoginUrl = '';

                    const pageInfo = this.getPageInfo(startPage);
                    this.confirmMessage = i18nMessages.M0653.split('%s').join(
                        pageInfo.name
                    );
                } else {
                    await this.changeStartPage(this.getCurrentUrl());
                }
            }
        },
        async shareAutoLoginUrl() {
            this.onHideMoreMenu();
            this.confirmMessage = '';

            const page = this.getPageInfo(this.getCurrentUrl());
            if (page) {
                const { data } = await this.createAutoLoginUrl({
                    memo: `${i18nMessages[page.type]} / ${page.name}`,
                    url: page.url,
                });
                this.autoLoginUrl =
                    location.origin + '/login/redirect?token=' + data.key;
            }
        },
        copyAutoLoginUrl() {
            const input = document.querySelector(
                '.share-url-window .url-n-btn input'
            );
            input.select();
            document.execCommand('copy');
        },
        getPageInfo(url) {
            return this.pageList.filter(row => row.url === url)[0];
        },
        getCurrentUrl() {
            return location.pathname === '/userdefine/dashboard' &&
                location.search !== ''
                ? location.pathname + location.search
                : location.pathname;
        },
        clickMoreMenuItem(index) {
            this.onHideMoreMenu();

            const item = this.items[index];
            if (typeof item.event === 'string') {
                // TODO: 좋은 방법은 아닌것 같은데, 현재는 MoreButton을 CommonHeader에서만 사용해서 괜찮을 것 같기도 함.
                const target = this.$parent || this;
                target.$emit(item.event);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import './themes';

.more-button {
    position: relative;
    display: inline-flex;

    .share-url-window {
        .url-n-btn {
            padding: 2px 9px;
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            @include themify($themes) {
                border: 1px solid themed('more-button-input-box-border-color');
            }
            .input-field-wrapper {
                border: none;
            }
        }
    }
}
</style>
