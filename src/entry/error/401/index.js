import '@layout/base.js';
import Vue from 'vue';
import { ariesuser } from '@common/base';
import HttpErrorPage from '@entry/error/HttpErrorPage';

new Vue({
    el: '.layout-contents',
    provide: {
        theme: ariesuser.theme,
    },
    components: {
        HttpErrorPage,
    },
});
