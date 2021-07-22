import Vue from 'vue';
import { ariesuser } from '@common/base';
import App from './App';
import './index.scss';
import store from './vuex.custom';
import i18n from './i18n';
import { escapedStringToJson } from './utility';

window.vm = new Vue({
    store,
    el: '#app',
    provide: {
        theme: ariesuser.theme,
        i18n: i18n,
    },
    components: {
        App,
    },
    filters: {
        stringToJson: jsonStr => {
            return escapedStringToJson(jsonStr);
        },
        stringToJsonForTransactionIds: jsonStr => {
            const jsonObj = escapedStringToJson(jsonStr);
            for (const key in jsonObj) {
                if (jsonObj[key] && jsonObj[key].length === 0)
                    delete jsonObj[key];
            }
            return jsonObj;
        },
    },
});
