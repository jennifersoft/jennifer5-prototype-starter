import Vue from 'vue';
import App from './App';
import i18n from '../i18n';

new Vue({
    el: '#app',
    provide: {
        i18n,
    },
    components: {
        App,
    },
});
