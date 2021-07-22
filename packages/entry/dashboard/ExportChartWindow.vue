<template>
    <window
        class="export-chart-window"
        @cancel="cancel"
        @apply="apply"
        :class="{ hide: hideWindow }"
        :messages="messages"
        :open-w="630"
        :open-h="460"
        :open-x="'calc(50% - 315px)'"
        :open-y="'calc(50% - 230px)'"
    >
        <template v-slot:subject>
            {{ i18n.title }}
        </template>
        <div class="label-content">
            <div v-if="chartName !== undefined">
                {{ i18n.chartName }} : {{ chartName }}
            </div>
            <div>{{ i18n.pageName }} : {{ pageName }}</div>
            <div>{{ i18n.captureTime }} : {{ nowTimeString }}</div>
            <div>{{ i18n.selectedDomain }} : {{ domainStrings }}</div>
        </div>

        <div class="img">
            <img :src="imgDataURL" alt="capture image" />
        </div>
    </window>
</template>
<script>
import Window from '@vuejs/component/window/Window';
import { i18n } from '@common/utility';
import { getDayjs, serverDateFormat, vuebus } from '@common/base';
import { keywordInVuebus } from '@common/ObserverKeyword';
import { Exporter } from '@common/legacy/Exporter';
import messages from '@vuejs/component/messages';

export default {
    name: 'ExportChartWindow',
    components: { Window },
    data() {
        return {
            messages: {
                ...messages,
                apply: i18n.get('ui.label.board.talk.register'),
            },
            hideWindow: true,
            i18n: {
                title: i18n.get('ui.label.export.canvas'),
                chartName: i18n.get('ui.label.export.chartName'),
                pageName: i18n.get('ui.label.export.pageName'),
                captureTime: i18n.get('ui.label.export.captureTime'),
                selectedDomain: i18n.get('ui.label.export.selectedDomain'),
            },
            width: 0,
            height: 0,
            chartName: '',
            pageName: '',
            domainStrings: '',
            nowTimeString: '',
            imgDataURL: '',
            addContent: '',
        };
    },
    methods: {
        cancel() {
            this.hideWindow = true;
        },

        apply() {
            const chartDesc = [
                '<div>' +
                    i18n.get('ui.label.export.chartName') +
                    ' : ' +
                    this.chartName +
                    '</div>',
            ];
            const etcDesc = [
                '<div>' +
                    i18n.get('ui.label.export.pageName') +
                    ' : ' +
                    this.pageName +
                    '</div>',
                '<div>' +
                    i18n.get('ui.label.export.captureTime') +
                    ' : ' +
                    this.nowTimeString +
                    '</div>',
                '<div>' +
                    i18n.get('ui.label.export.selectedDomain') +
                    ' : ' +
                    this.domainStrings +
                    '</div>',
            ];

            const description =
                this.chartName === undefined
                    ? etcDesc
                    : chartDesc.concat(etcDesc);
            const titleArray = this.chartName
                ? [this.pageName, this.chartName]
                : [this.pageName];
            const title = `[${titleArray.join('/')}]`;

            Exporter.canvas(
                this.imgDataURL,
                {
                    title: title,
                    fileName: 'chart.png',
                    description: description.join(''),
                    width: this.width,
                    height: this.height,
                },
                article => {
                    vuebus.$emit(
                        keywordInVuebus.MOVE_TO_TALK_WHEN_EXPORT_CHART,
                        article.key
                    );
                    this.hideWindow = true;
                }
            );
        },
    },
    computed: {},
    created() {
        vuebus.$on(keywordInVuebus.EXPORT_CHART_DASHBOARD, data => {
            this.width = data.width;
            this.height = data.height;
            this.chartName = data.chartName;
            this.pageName = data.pageName;
            this.domainStrings = data.domainStrings;
            this.imgDataURL = data.imgDataURL;
            this.hideWindow = false;
            this.nowTimeString = getDayjs().format(
                serverDateFormat.longWithSec
            );
        });
    },
};
</script>
<style lang="scss" scoped>
.export-chart-window {
    &.hide {
        display: none;
    }

    .label-content {
        height: 140px;

        > div {
            width: 590px;
            overflow: hidden;
            height: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .img {
        width: 580px;
        height: 144px;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}
</style>
