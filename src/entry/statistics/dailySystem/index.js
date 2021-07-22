import Vue from 'vue';
import VueDailyTemplate from '@entry/statistics/common/component/template/DailyTemplate';
import { store } from '@entry/statistics/common/vue';
import { ariesuser } from '@common/base';
import { PAGE_TYPE } from '@entry/statistics/common/common';
import { OTypeDef } from '@common/definition';
import '@entry/statistics/styles/common.scss';
import '@layout/base';

new Vue({
    el: '#app',
    store,
    provide: {
        theme: ariesuser.theme,
        pageType: PAGE_TYPE.DAILY,
        otype: OTypeDef.SYSTEM,
    },
    components: {
        dailyTemplate: VueDailyTemplate,
    },
});
