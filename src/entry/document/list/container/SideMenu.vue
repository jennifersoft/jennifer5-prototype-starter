<template>
    <div class="side-menu">
        <div class="top">
            <side-menu-item
                :icon-type="iconTypes.viewAllReports"
                :title="i18n.viewAllReports"
                style="cursor: pointer;"
                @click.native="onClickDirectoryLink()"
            ></side-menu-item>
        </div>
        <div class="bottom">
            <div class="title">
                <div class="left">
                    <span>{{ i18n.allDirectories }}</span>
                </div>
                <div class="right">
                    <btn
                        :items="[{ iconType: iconTypes.add }]"
                        :tooltipOptions="{
                            position: 'top-right',
                            message: i18n.addDirectory,
                        }"
                        @click.native="onAddNewDirectory"
                    />
                </div>
            </div>
            <div
                class="list"
                :style="{ height: scrollHeight, 'max-height': scrollHeight }"
                v-click-outside="onCloseDirectoryMenu"
            >
                <side-menu-item
                    v-for="(dir, index) in directoryList"
                    :key="index"
                    :icon-type="iconTypes.directory"
                    :title="dir.name"
                    :active="dir.key === directoryKey"
                    :use-more="true"
                    @click#title="onClickDirectoryLink(dir.key)"
                    @click#more="e => onClickDirectoryMore(dir.key, e)"
                ></side-menu-item>

                <layered-menu
                    :width="150"
                    :left="110"
                    :top="directoryMenuTop"
                    v-if="showDirectoryMenu"
                >
                    <popup-list
                        no-scroll
                        :items="[
                            { text: i18n.changeName },
                            { text: i18n.delete },
                        ]"
                        @update:active-index="onClickDirectoryMenu"
                    />
                </layered-menu>
            </div>
        </div>

        <window
            class="prompt-window"
            :messages="prompt.messages"
            :draggable="false"
            :open-x="prompt.left"
            :open-y="prompt.top"
            :open-w="350"
            @cancel="onCancelPromptWindow"
            @apply="onApplyPromptWindow"
            v-if="prompt.subject !== ''"
        >
            <template #subject>{{ prompt.subject }}</template>
            <div>{{ prompt.text }}</div>
            <input-field
                :validator="checkDirectoryName"
                v-model="prompt.input"
            ></input-field>
        </window>
    </div>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import Btn from '@vuejs/component/button/Btn';
import InputField from '@vuejs/component/Input/InputField';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import clickOutside from '@vuejs/directive/clickOutside';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import SideMenuItem from '../component/SideMenuItem';
import messages from '@vuejs/component/messages';
import { getByteLength } from '@common/utility';
import { mapState, mapActions } from '../vuex';

export default {
    inject: {
        i18n: {
            default: {},
        },
    },
    components: {
        Window,
        SideMenuItem,
        Btn,
        PopupList,
        LayeredMenu,
        InputField,
    },
    directives: { clickOutside },
    data() {
        return {
            iconSize: 16,
            iconTypes: {
                viewAllReports: ICON_TYPE.template,
                myReports: ICON_TYPE.happy,
                directory: ICON_TYPE.file,
                add: ICON_TYPE.add,
            },
            directoryMenuTop: 0,
            showDirectoryMenu: false,
            selectedDirectoryKey: '*',

            prompt: {
                messages: messages,
                left: window.innerWidth / 2 - 175,
                top: window.innerHeight / 2 - 100,
                subject: '',
                text: '',
                input: '',
                key: null,
            },
        };
    },
    computed: {
        ...mapState({
            directoryKey: state => state.directoryKey,
            directoryList: state =>
                state.directoryList.filter(dir => dir.key !== '*'),
        }),
        scrollHeight() {
            return `${window.innerHeight - 166}px`;
        },
    },
    methods: {
        ...mapActions(['saveDirectoryName', 'deleteDirectory']),
        onClickDirectoryLink(key) {
            if (key === '' || !key) location.href = '/report/document/list';
            else location.href = `/report/document/list?directoryKey=${key}`;
        },
        onClickDirectoryMore(key, e) {
            this.directoryMenuTop = e.y - 50;

            if (this.selectedDirectoryKey === key && this.showDirectoryMenu)
                this.showDirectoryMenu = false;
            else {
                this.showDirectoryMenu = true;
                this.selectedDirectoryKey = key;
            }
        },
        onAddNewDirectory() {
            this.prompt = {
                ...this.prompt,
                subject: this.i18n.addDirectory,
                text: this.i18n.M0626,
                input: '',
                key: null,
            };
        },
        onClickDirectoryMenu(index) {
            const targetDirs = this.directoryList.filter(
                dir => dir.key === this.selectedDirectoryKey
            );

            if (targetDirs.length > 0) {
                const dir = targetDirs[0];

                if (index === 0) {
                    this.prompt = {
                        ...this.prompt,
                        subject: this.i18n.changeName,
                        text: this.i18n.M0625,
                        input: targetDirs[0].name,
                        key: dir.key,
                    };
                } else if (index === 1) {
                    this.deleteDirectory(dir).then(() => {
                        this.onClickDirectoryLink();
                    });
                }
            }

            this.onCloseDirectoryMenu();
        },
        onCloseDirectoryMenu() {
            this.showDirectoryMenu = false;
        },
        onCancelPromptWindow() {
            this.prompt = { ...this.prompt, subject: '', text: '', input: '' };
        },
        onApplyPromptWindow() {
            const dirName = this.prompt.input;

            if (this.checkDirectoryName(dirName)) {
                if (this.prompt.key) {
                    this.saveDirectoryName({
                        name: dirName,
                        key: this.prompt.key,
                    });

                    this.onCancelPromptWindow();
                } else {
                    this.saveDirectoryName({
                        name: dirName,
                        key: null,
                    }).then(() => {
                        this.onClickDirectoryLink();
                    });
                }
            }
        },
        checkDirectoryName(name) {
            return getByteLength(name) <= 40;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.side-menu {
    @include themify($themes) {
        overflow-x: hidden;
        height: 100%;
        padding-top: 16px;
        border-right: 1px solid themed('layout-border-color');

        > .top {
            margin-bottom: 24px;
        }

        > .bottom {
            > .list {
                position: relative;
                overflow-y: auto;
            }
        }

        .title {
            display: flex;
            padding: 0px 16px;
            margin-bottom: 4px;

            > * {
                flex: 1;
            }

            > .left {
                line-height: 26px;

                > span {
                    font-size: 11px;
                    color: themed('side-menu-all-font-color');
                }
            }

            > .right {
                text-align: right;
            }
        }

        ::v-deep .row-list {
            border-radius: 3px !important;
        }

        ::v-deep .input-field-wrapper {
            margin-top: 6px;
        }

        ::v-deep .layered-menu {
            position: fixed;
        }
    }
}
</style>
