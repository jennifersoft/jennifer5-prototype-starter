<template>
    <div class="top-menu">
        <div class="title" v-html="subject"></div>
        <div class="tools">
            <template v-if="isAdmin">
                <dropdown
                    :is-simple-style="true"
                    :items="[
                        { text: i18n.myReports, value: 0 },
                        { text: i18n.allReports, value: 1 },
                    ]"
                    :width="185"
                    :selected-value="viewAll ? 1 : 0"
                    @onchange="onClickViewAllReports"
                ></dropdown>
                <div class="separator"></div>
            </template>

            <btn
                :items="[{ iconType: iconTypes.copyReport }]"
                :disabled="checkedReportKeys.length === 0"
                :tooltip-options="{ message: i18n.createBackup }"
                @click="onClickCopyButton"
                class="border-none"
                normal
            />
            <btn
                :items="[{ iconType: iconTypes.moveReport }]"
                :disabled="checkedReportKeys.length === 0"
                :tooltip-options="{ message: i18n.move }"
                :pressed="showReportMovePopup"
                @click="() => (showReportMovePopup = true)"
                class="border-none"
                normal
            />
            <btn
                :items="[{ iconType: iconTypes.removeReport }]"
                :disabled="checkedReportKeys.length === 0"
                :tooltip-options="{ message: i18n.delete }"
                @click="deleteReportList"
                class="border-none"
                normal
            />

            <directory-window
                v-if="showReportMovePopup"
                :title="i18n.move"
                @cancel="onCloseReportMovePopup"
                @apply="onApplyReportMovePopup"
                @select="onSelectDirectory"
            ></directory-window>
        </div>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import AlertWindow from '@vuejs/component/window/AlertWindow';
import Btn from '@vuejs/component/button/Btn';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { getByteLength } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import DirectoryWindow from './DirectoryWindow';
import { mapState, mapActions, mapMutations } from '../vuex';

export default {
    inject: ['i18n', 'isAdmin'],
    components: {
        AlertWindow,
        Btn,
        Dropdown,
        DirectoryWindow,
    },
    computed: {
        ...mapState({
            viewAll: state => state.viewAll,
            directoryName: state => state.directoryName,
            directoryKey: state => state.directoryKey,
            checkedReportKeys: state => state.checkedReportKeys,
            reportList: state => state.reportList,
        }),
        subject() {
            return this.directoryKey === '' || this.directoryKey === '*'
                ? this.i18n.reportList
                : this.directoryName;
        },
    },
    watch: {
        checkedReportKeys(newVal) {
            // 보고서 이동 팝업이 열려있는 경우, 모든 체크 해제에 대한 예외처리
            if (newVal.length === 0 && this.showReportMovePopup)
                this.showReportMovePopup = false;
        },
    },
    data() {
        return {
            iconTypes: {
                copyReport: ICON_TYPE.copy,
                moveReport: ICON_TYPE.moveFiles,
                removeReport: ICON_TYPE.trashcan,
            },
            showReportMovePopup: false,
            selectedDirectoryKey: null,
            viewMyReports: false,
            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations(['updateViewAll']),
        ...mapActions([
            'loadReportList',
            'copyReportList',
            'deleteReportList',
            'moveReportList',
        ]),
        onClickCopyButton() {
            let isOK = true;

            const checkedList = this.reportList.filter(report =>
                this.checkedReportKeys.includes(report.key)
            );

            for (let i = 0; i < checkedList.length; i++) {
                const title = checkedList[i].key.split('@')[0];

                if (title.trim() === '') {
                    this.alertMessage = this.i18n.M0012;
                    isOK = false;
                    break;
                }

                if (getByteLength(title) > 40) {
                    this.alertMessage = this.i18n.M0508;
                    isOK = false;
                    break;
                }
            }

            if (isOK) this.copyReportList();
        },
        onCloseReportMovePopup() {
            this.showReportMovePopup = false;
            this.selectedDirectoryKey = null;
        },
        onApplyReportMovePopup() {
            if (this.selectedDirectoryKey !== null)
                this.moveReportList(this.selectedDirectoryKey);
            this.onCloseReportMovePopup();
        },
        onSelectDirectory({ key }) {
            this.selectedDirectoryKey = key;
        },
        onClickViewAllReports({ value }) {
            this.updateViewAll(value === 1);
            this.loadReportList();
        },
    },
};
</script>

<style lang="scss" src="./TopMenu.scss" scoped></style>
