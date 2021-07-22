import Vue from 'vue';
import VuePeriodTemplate from '@entry/statistics/common/component/template/PeriodTemplate';
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
        pageType: PAGE_TYPE.PERIOD,
        otype: OTypeDef.BUSINESS,
    },
    components: {
        periodTemplate: VuePeriodTemplate,
    },
});
