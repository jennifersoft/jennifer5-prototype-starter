import Vue from 'vue';
import { ariesuser, server } from '@common/base';
import storeInDashboard from '@entry/dashboard/storeInDashboard';
import i18nMessages from './i18n';
import '@entry/dashboard/layout';

import App from './App.vue';

new Vue({
    el: '#vue_app',
    store: storeInDashboard,
    components: {
        App,
    },
    provide: {
        isDomainGroupUsage: true,
        showRightMenusInHeader: true,
        hideDomainGroupTree: false,
        theme: ariesuser.theme,
        groupId: ariesuser.groupId,
        platform: server.platform,
        i18n: i18nMessages,
        menuName: i18nMessages.xview,
    },
});
