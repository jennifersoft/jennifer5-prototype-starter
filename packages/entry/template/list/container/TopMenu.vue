<template>
    <div class="top-menu">
        <div class="title">{{ i18n.template }}</div>
        <div class="tools">
            <btn
                :items="[{ iconType: iconTypes.add }]"
                :tooltip-options="{ message: i18n.newTemplate }"
                @click="onClickNewTemplate"
                class="border-none"
                normal
            />
            <btn
                :items="[{ iconType: iconTypes.clock }]"
                :tooltip-options="{ message: i18n.autoBuildTime }"
                :pressed="showBuildTimeWindow"
                @click="onShowBuildTimeWindow"
                class="border-none"
                normal
            />
            <btn
                :items="[{ iconType: iconTypes.color }]"
                :tooltip-options="{ message: i18n.templateChartSetting }"
                @click="onOpenTemplateChartSettingPopup"
                class="border-none"
                normal
            />

            <div class="separator"></div>

            <btn
                :items="[{ iconType: iconTypes.copyTemplate }]"
                :disabled="checkedTemplateKeys.length === 0"
                :tooltip-options="{ message: i18n.createBackup }"
                @click="onClickCopyButton"
                class="border-none"
                normal
            />
            <btn
                :items="[{ iconType: iconTypes.removeTemplate }]"
                :disabled="checkedTemplateKeys.length === 0"
                :tooltip-options="{ message: i18n.delete }"
                @click="deleteTemplateList"
                class="border-none"
                normal
            />

            <build-time-window
                v-if="showBuildTimeWindow"
                :hour="autoBuildHour"
                :minute="autoBuildMinute"
                @apply="onApplyBuildTimeWindow"
                @cancel="onHideBuildTimeWindow"
            ></build-time-window>
        </div>
    </div>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Window from '@vuejs/component/window/Window';
import ListSelector from '@vuejs/component/ListSelector/ListSelector.vue';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { getByteLength } from '@common/utility';
import BuildTimeWindow from '../component/BuildTimeWindow';
import { mapState, mapActions } from '../vuex';

export default {
    inject: ['i18n'],
    props: {
        directoryKey: {
            type: String,
            required: false,
            default: '',
        },
    },
    components: {
        Dropdown,
        Checkbox,
        Window,
        ListSelector,
        Btn,
        BuildTimeWindow,
    },
    computed: {
        ...mapState({
            checkedTemplateKeys: state => state.checkedTemplateKeys,
            templateList: state => state.templateList,
            autoBuildHour: state => state.autoBuildHour,
            autoBuildMinute: state => state.autoBuildMinute,
        }),
    },
    data() {
        return {
            iconTypes: {
                add: ICON_TYPE.add,
                clock: ICON_TYPE.time,
                more: ICON_TYPE.moreHorizon,
                copyTemplate: ICON_TYPE.copy,
                removeTemplate: ICON_TYPE.trashcan,
                color: ICON_TYPE.palette,
            },
            showBuildTimeWindow: false,
        };
    },
    methods: {
        ...mapActions([
            'loadTemplateList',
            'copyTemplateList',
            'deleteTemplateList',
            'loadTemplateBuildTime',
            'saveTemplateBuildTime',
            'saveTemplateChartSetting',
        ]),
        onClickNewTemplate() {
            location.href = `/report/template/edit?directoryKey=${this.directoryKey}&key=`;
        },
        onClickCopyButton() {
            let isOK = true;

            const checkedList = this.templateList.filter(report =>
                this.checkedTemplateKeys.includes(report.key)
            );

            for (let i = 0; i < checkedList.length; i++) {
                const title = checkedList[i].title;

                if (title.trim() === '') {
                    this.$emit('alert', this.i18n.M0012);
                    isOK = false;
                    break;
                }

                if (getByteLength(title) > 40) {
                    this.$emit('alert', this.i18n.M0508);
                    isOK = false;
                    break;
                }
            }

            if (isOK) this.copyTemplateList();
        },
        async onShowBuildTimeWindow() {
            await this.loadTemplateBuildTime();
            this.showBuildTimeWindow = true;
        },
        onHideBuildTimeWindow() {
            this.showBuildTimeWindow = false;
        },
        onApplyBuildTimeWindow(payload) {
            this.saveTemplateBuildTime(payload);
            this.onHideBuildTimeWindow();
        },
        onOpenTemplateChartSettingPopup() {
            const popup = window.open(
                '/popup/themeTool',
                'themeTool',
                'width=1280,height=800'
            );

            const form = document.getElementById('chartStyleForm');
            form.method = 'POST';
            form.action = '/popup/themeTool';
            form.target = 'themeTool';
            form.submit();

            // 차트 테마 팝업에서 저장 버튼을 클릭했을 때!
            popup.window.addEventListener('message', e => {
                if (e.data.type == 'themeTool') {
                    this.saveTemplateChartSetting(e.data.themes).then(() => {
                        document.location = '/report/template/list';
                    });
                }
            });
        },
    },
};
</script>

<style
    lang="scss"
    src="@entry/document/list/container/TopMenu.scss"
    scoped
></style>
