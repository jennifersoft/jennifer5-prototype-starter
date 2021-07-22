import '@entry/dashboard/layout';
import '@entry/dashboard/realtimeAdmin/index.scss';
import storeInDashboard from '@entry/dashboard/storeInDashboard';
import Vue from 'vue';
import RealtimeEvent from '@entry/realtime/event/RealtimeEvent';
import $ from '@library/jquery';
import { i18n } from '@common/utility';

const i18nMessage = {
    txAnalysis: i18n.get('ui.label.eventAnalysis'),
    licenseExpired: i18n.get('ui.en.license'),
    stopped: i18n.get('ui.en.stopped'),
    close: i18n.get('ui.label.close'),
    eventList: i18n.get('ui.title.eventList'),
    showEventList: i18n.get('ui.label.eventList.show'),
    instanceStatus: i18n.get('ui.label.instance.status'),
};

document.addEventListener('DOMContentLoaded', () => {
    const isDomainGroupUsage =
        $('input[name=isDomainGroupUsage]').val() === 'true';
    const menuName = $('input[name=menuName]').val();

    new Vue({
        el: '#vue_app',
        store: storeInDashboard,
        components: {
            RealtimeEvent,
        },

        provide: {
            isDomainGroupUsage: isDomainGroupUsage,
            menuName: menuName,

            hideDomainGroupTree: false,
            i18n: i18nMessage,
        },
    });
});
