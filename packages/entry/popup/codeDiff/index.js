import Vue from 'vue';
import { ariesuser } from '@common/base';
import CodeDiff from './CodeDiff';
import i18n from './i18n';
import './index.scss';

new Vue({
    el: '#app',
    provide: {
        theme: ariesuser.theme,
        i18n: i18n,
    },
    components: {
        CodeDiff,
    },
});
