import Vue from 'vue';
import { ariesuser, server } from '@common/base';
import store from './vuex';
import i18n from './i18n';
import App from './App';
import './index.scss';

window.vm = new Vue({
    el: '#app',
    store,
    provide: {
        theme: ariesuser.theme,
        platform: server.platform,
        i18n: i18n,
    },
    components: {
        App,
    },
    filters: {
        stringToNumber(val) {
            if (val === '') return -1;
            return parseInt(val);
        },
        stringToBoolean(val) {
            if (val === '') return false;
            return val === 'true';
        },
        stringToJson(val) {
            if (val === '') return '[]';
            return val;
        },
        stringToArray(val) {
            if (val === '') return [];
            return val.split(',').map(val2 => {
                // 액티브서비스 차트에서 넘어올 때는 값이 조합형 문자열 (/1000/1/10000)
                // Business 차트에서 넘어올 때는 값이 숫자 문자열 (10000)
                const oid = parseInt(val2);
                return isNaN(oid) ? val2 : oid;
            });
        },
    },
});
