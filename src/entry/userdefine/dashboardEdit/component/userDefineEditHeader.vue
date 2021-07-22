<template>
    <div id="userDefineDashboardContentHeader" class="row">
        <div>
            <span
                class="title"
                ref="title"
                contenteditable="true"
                @keydown.enter.prevent
                @focusout="changeTitleWhenFocusout"
                v-html="title"
            ></span>
            <btn
                :items="[{ value: 'info', iconType: ICON_TYPE.info }]"
                class="border-none info-icon"
                style="margin: 6px 0;"
                :data-tooltip-text="message.tooltip"
            />
            <div class="dashboard-menu-btn">
                <btn
                    v-if="isModifyDashboard"
                    :items="[{ text: message.buttonDelete }]"
                    normal
                    @click="onClickDelete"
                />
                <btn
                    :items="[{ text: message.buttonSave }]"
                    class="focus"
                    normal
                    @click="onClickSave"
                />
                <btn
                    :items="[{ iconType: ICON_TYPE.help }]"
                    class="border-none"
                    normal
                    @click="linkManual('r_userDefine_dashboard_edit')"
                />
            </div>

            <cancel-or-apply-window
                :message="message.deleteDashboardConfirmMessage"
                v-show="isShowConfirmWindow"
                @cancel="hideConfirmWindow"
                @apply="confirmDelete"
            />
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import CancelOrApplyWindow from '@entry/userdefine/dashboardEdit/component/window/cancelOrApplyWindow';
import { linkManual } from '@common/utility';

const {
    mapGetters,
    mapState,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('userdefine');

export default {
    name: 'userDefineEditHeader',
    directives: {},
    components: {
        CancelOrApplyWindow,
        Btn,
    },
    data: function() {
        return {
            message: {
                buttonSave: i18n.get('ui.button.save'),
                buttonDelete: i18n.get('ui.button.delete'),

                tooltip: i18n.get('M0610'),
                deleteDashboardConfirmMessage: i18n.get('M0270'),
            },
            isShowConfirmWindow: false,
            ICON_TYPE: ICON_TYPE,
        };
    },
    methods: {
        ...mapMutations(['setTitle']),

        ...mapActions([
            'getRedirectURLAfterSaveDashboard',
            'getRedirectURLAfterDeleteDashboard',
        ]),

        changeTitleWhenFocusout(e) {
            this.setTitle(e.target.innerText);
        },

        hideConfirmWindow() {
            this.isShowConfirmWindow = false;
        },

        onClickDelete() {
            this.isShowConfirmWindow = true;
        },

        async confirmDelete() {
            document.location = await this.getRedirectURLAfterDeleteDashboard();
        },

        async onClickSave() {
            this.setTitle(this.$refs.title.innerText);

            document.location = await this.getRedirectURLAfterSaveDashboard();
        },
    },

    computed: {
        ...mapState(['title', 'dashboardKey']),

        isModifyDashboard() {
            return this.dashboardKey !== undefined;
        },
    },

    created() {
        this.linkManual = linkManual;
    },
};
</script>
<style lang="scss" scoped>
@import 'themes.scss';

#userDefineDashboardContentHeader {
    @include themify($themes) {
        background: themed('header-background-color');
        color: themed('header-text-color');

        > div {
            display: flex;
            flex-direction: row;
            margin: 12px 0 12px 20px;

            [data-tooltip-text] {
                position: relative;
                cursor: help;
            }

            [data-tooltip-text]:hover::after {
                color: themed('header-info-tooltip-text-color');
                background-color: themed(
                    'header-info-tooltip-background-color'
                );
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2),
                    0 4px 8px 3px rgba(0, 0, 0, 0.08);
                border-radius: 3px;

                font-size: 12px;
                margin-bottom: 10px;
                padding: 7px;
                position: absolute;
                width: auto;
                min-width: 300px;
                max-width: 500px;
                word-wrap: break-word;

                z-index: 9999;
                top: 30px;
                left: 0;
                opacity: 1;

                content: attr(data-tooltip-text);
            }

            .dashboard-menu-btn {
                margin-left: auto;
                margin-right: 20px;
                display: flex;
                flex-direction: row;

                > div {
                    margin: 0 4px;

                    &.help {
                        margin: 0 17px;

                        .icon-help {
                            font-size: 15px;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        span.title {
            font-size: 16px;
            line-height: 34px;
            font-weight: bold;
            min-width: 50px;
            white-space: pre-line;
            word-wrap: break-word;
            display: inline-block;
            text-align: left;
            vertical-align: middle;
            margin: auto 9px;
            padding: 0 10px;
            color: themed('typography-color-primary');
            border-radius: 2px;
            &:hover {
                box-shadow: 0 0 0 1px themed('border-color');
            }
            &:focus {
                box-shadow: 0 0 0 1px themed('background-color-purple');
                outline: none;
            }
        }
    }
}
</style>
