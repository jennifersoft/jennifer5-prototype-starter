// import '@entry/dashboard/base.js';
import './index.scss';
import VueUserDefineEditTemplate from '@entry/userdefine/dashboardEdit/component/userDefineEditTemplate';
import { store } from '@entry/userdefine/dashboardEdit/vue';
import Vue from 'vue';
import { ariesuser, server } from '@common/base';
import '@entry/dashboard/layout.js';

// import {
//     cancelAniFrame,
//     globalRequestAniFrameStatus,
//     requestAniFrame,
// } from '@module/common/RequestAniFrame';

const app = new Vue({
    el: '.dashboardEdit',
    store,
    provide: {
        theme: ariesuser.theme,
        groupId: ariesuser.groupId,
        platform: server.platform,
        i18nMessage: {
            charttype: {
                area: i18n.get('ui.label.charttype.area'),
                column: i18n.get('ui.label.charttype.column.24hour.per.hour'),
                equalizer: i18n.get('ui.label.charttype.equalizer'),
                event: i18n.get('ui.label.charttype.event'),

                lineBase: i18n.get('ui.label.charttype.line.base'),
                lineRuntime: i18n.get('ui.label.charttype.line.runtime'),
                line24Hour: i18n.get('ui.label.charttype.line.24hour'),
                line24HourPerHour: i18n.get(
                    'ui.label.charttype.line.24hour.per.hour'
                ),

                listActiveService: i18n.get(
                    'ui.label.charttype.list.activeservice'
                ),

                speedBar: i18n.get('ui.label.charttype.speedbar'),
                speedMeter: i18n.get('ui.label.charttype.speedmeter'),
                scoreboard: i18n.get('ui.label.charttype.scoreboard'),
                xview: i18n.get('ui.label.charttype.xview'),
            },
        },
    },
    components: {
        userDefineEditTemplate: VueUserDefineEditTemplate,
    },
});

// window.requestAniFrame = requestAniFrame;
// window.cancelAniFrame = cancelAniFrame;
// window.globalRequestAniFrameStatus = globalRequestAniFrameStatus;
