<template>
    <div class="detail-tabs">
        <div class="top">
            <tab-list
                small
                :tabs="tabList"
                :active-tab="activeTab"
                :tooltip-position="'top-left'"
                @change="onChangeTab"
            ></tab-list>

            <loading-indicator v-if="tabLoading"></loading-indicator>

            <detail-toolbar></detail-toolbar>
        </div>

        <div class="contents" :key="tabSequence">
            <timeline-tab
                v-if="activeTab === tabKeys.TIMELINE"
                @search-profile="showSearchTextProfile"
            ></timeline-tab>
            <text-tab v-else-if="activeTab === tabKeys.TEXT"></text-tab>
            <section-tab
                v-else-if="activeTab === tabKeys.SECTION"
                @search-profile="showSearchTextProfile"
            ></section-tab>
            <socket-tab
                v-else-if="activeTab === tabKeys.SOCKET"
                @search-profile="showSearchTextProfile"
            ></socket-tab>
            <file-tab
                v-else-if="activeTab === tabKeys.FILE"
                @search-profile="showSearchTextProfile"
            ></file-tab>
            <message-tab
                v-else-if="activeTab === tabKeys.MESSAGE"
                @search-profile="showSearchTextProfile"
            ></message-tab>
            <error-tab
                v-else-if="activeTab === tabKeys.ERROR"
                @search-profile="showSearchTextProfile"
            ></error-tab>
            <stacktrace-tab
                v-else-if="activeTab === tabKeys.STACKTRACE"
            ></stacktrace-tab>
            <async-tab v-else-if="activeTab === tabKeys.ASYNC"></async-tab>
            <cics-tab v-else-if="activeTab === tabKeys.CICS"></cics-tab>
            <custom-log-tab
                v-else-if="activeTab === tabKeys.CUSTOM_LOG"
            ></custom-log-tab>
            <div v-else>Unknown Tab</div>
        </div>

        <confirm-window
            :message="alertMessage"
            @cancel="() => (profileNo = '')"
            @apply="applySearchTextProfile"
            v-if="profileNo !== ''"
        ></confirm-window>
    </div>
</template>

<script>
import LoadingIndicator from '@vuejs/component/Loading/LoadingIndicator';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import TabList from '@vuejs/component/tab/Tab';
import DetailToolbar from './DetailToolbar';
import TimelineTab from './TimelineTab';
import TextTab from './TextTab';
import SectionTab from './SectionTab';
import SocketTab from './SocketTab';
import FileTab from './FileTab';
import MessageTab from './MessageTab';
import ErrorTab from './ErrorTab';
import StacktraceTab from './StacktraceTab';
import AsyncTab from './AsyncTab';
import CicsTab from './CicsTab';
import CustomLogTab from '../container.custom/LogTab';
import { TAB_KEYS } from '../constant';
import { mapState, mapMutations } from '../store/base';
import { i18n } from '@common/utility';
import { TIMELINE_STATUS_MESSAGES } from '../constant';

export default {
    components: {
        LoadingIndicator,
        ConfirmWindow,
        TabList,
        DetailToolbar,
        TimelineTab,
        TextTab,
        SectionTab,
        SocketTab,
        FileTab,
        MessageTab,
        ErrorTab,
        StacktraceTab,
        AsyncTab,
        CicsTab,
        CustomLogTab,
    },
    inject: {
        i18n: {
            default: {
                timelineAnalysis: 'Timeline',
                textAnalysis: 'Text',
                sectionAnalysis: 'Section',
                socket: 'Socket',
                file: 'File',
                message: 'Message',
                error: 'ERROR',
                stackTrace: 'StackTrace',
                async: 'ASYNC',
                cics: 'CICS',
                customLog: 'CustomLog',
            },
        },
    },
    data() {
        return {
            tabKeys: TAB_KEYS,
            profileNo: '',
        };
    },
    computed: {
        ...mapState({
            activeTab: state => state.activeTab,
            tabSequence: state => state.tabSequence,
            tabLoading: state => state.tabLoading,
            profileStatus: state => state.profileStatus,
            socketCount: state => state.socketCount,
            fileCount: state => state.fileCount,
            messageCount: state => state.messageCount,
            stacktraceCount: state => state.stacktraceCount,
            errorCount: state => state.errorCount,
            asyncCount: state => state.asyncCount,
            cicsCount: state => state.cicsCount,
            customLogCount: state => state.customLogCount,
        }),
        tabList() {
            const tabList = [
                {
                    key: TAB_KEYS.TIMELINE,
                    value: this.i18n.timelineAnalysis,
                    tooltipMessage:
                        TIMELINE_STATUS_MESSAGES[this.profileStatus],
                },
                {
                    key: TAB_KEYS.TEXT,
                    value: this.i18n.textAnalysis,
                },
                {
                    key: TAB_KEYS.SECTION,
                    value: this.i18n.sectionAnalysis,
                },
                {
                    key: TAB_KEYS.SOCKET,
                    value: this.i18n.socket,
                    disabled: this.socketCount === 0,
                    caption: this.socketCount,
                },
                {
                    key: TAB_KEYS.FILE,
                    value: this.i18n.file,
                    disabled: this.fileCount === 0,
                    caption: this.fileCount,
                },
                {
                    key: TAB_KEYS.MESSAGE,
                    value: this.i18n.message,
                    disabled: this.messageCount === 0,
                    caption: this.messageCount,
                },
                {
                    key: TAB_KEYS.ERROR,
                    value: this.i18n.error,
                    disabled: this.errorCount === 0,
                    caption: this.errorCount,
                },
                {
                    key: TAB_KEYS.STACKTRACE,
                    value: this.i18n.stackTrace,
                    disabled: this.stacktraceCount === 0,
                    caption: this.stacktraceCount,
                },
                {
                    key: TAB_KEYS.ASYNC,
                    value: this.i18n.async,
                    disabled: this.asyncCount === 0,
                },
                {
                    key: TAB_KEYS.CICS,
                    value: this.i18n.cics,
                    disabled: this.cicsCount === 0,
                },
            ];

            // 프로파일 상태가 이상이 있을 경우에 대한 처리
            tabList[0].caption = tabList[0].tooltipMessage !== ''
                ? 'unknown' : undefined;

            // 커스텀 기능은 비활성화를 하지 않음
            if (this.customLogCount > 0) {
                tabList.push({
                    key: TAB_KEYS.CUSTOM_LOG,
                    value: this.i18n.customLog,
                });
            }

            return tabList;
        },
        alertMessage() {
            return i18n.get('M0604', `${parseInt(this.profileNo)}`);
        },
    },
    watch: {
        socketCount(count) {
            if (this.activeTab === TAB_KEYS.SOCKET && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
        fileCount(count) {
            if (this.activeTab === TAB_KEYS.FILE && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
        messageCount(count) {
            if (this.activeTab === TAB_KEYS.MESSAGE && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
        errorCount(count) {
            if (this.activeTab === TAB_KEYS.ERROR && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
        stacktraceCount(count) {
            if (this.activeTab === TAB_KEYS.STACKTRACE && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
        asyncCount(count) {
            if (this.activeTab === TAB_KEYS.ASYNC && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
        cicsCount(count) {
            if (this.activeTab === TAB_KEYS.CICS && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
        customLogCount(count) {
            if (this.activeTab === TAB_KEYS.CUSTOM_LOG && count === 0)
                this.onChangeTab(TAB_KEYS.TIMELINE);
        },
    },
    methods: {
        ...mapMutations(['changeActiveTab']),
        onChangeTab(tab) {
            if (this.tabLoading || this.activeTab === tab) return;

            this.changeActiveTab(tab);
            this.$emit('load-profile-data');
        },
        showSearchTextProfile(no) {
            this.profileNo = no;
        },
        applySearchTextProfile() {
            this.changeActiveTab(TAB_KEYS.TEXT);
            this.$emit('load-profile-data', this.profileNo);
            this.profileNo = '';
        },
        getNextTabIndex(tabIndex, step) {
            const tabs = Object.values(TAB_KEYS);
            let nextIndex = tabIndex + step;

            if (nextIndex < 0) nextIndex = tabs.length - 1;
            else if (nextIndex === tabs.length) nextIndex = 0;

            const nextTab = tabs[nextIndex];
            if (
                (nextTab === TAB_KEYS.SOCKET && this.socketCount === 0) ||
                (nextTab === TAB_KEYS.FILE && this.fileCount === 0) ||
                (nextTab === TAB_KEYS.MESSAGE && this.messageCount === 0) ||
                (nextTab === TAB_KEYS.ERROR && this.errorCount === 0) ||
                (nextTab === TAB_KEYS.STACKTRACE &&
                    this.stacktraceCount === 0) ||
                (nextTab === TAB_KEYS.ASYNC && this.asyncCount === 0) ||
                (nextTab === TAB_KEYS.CICS && this.cicsCount === 0) ||
                (nextTab === TAB_KEYS.CUSTOM_LOG && this.customLogCount === 0)
            ) {
                return this.getNextTabIndex(nextIndex, step);
            }

            return nextIndex;
        },

        keydownEventHandler(e) {
            if (this.tabLoading) return;

            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                const tabs = Object.values(TAB_KEYS);
                let tabIndex = this.getNextTabIndex(
                    tabs.indexOf(this.activeTab),
                    e.code === 'ArrowLeft' ? -1 : 1
                );

                this.onChangeTab(tabs[tabIndex]);
                e.preventDefault();
            }
        },
    },
    beforeMount() {
        window.addEventListener('keydown', this.keydownEventHandler);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.keydownEventHandler);
    },
};
</script>

<style lang="scss" scoped>
.detail-tabs {
    padding: 0px 24px 25px 24px;

    > .top {
        position: relative;

        ::v-deep .aries-loading-indicator {
            top: 30px;
        }
    }

    > .contents {
        margin-top: 16px;
    }
}
</style>
