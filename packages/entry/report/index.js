import Vue from 'vue';
import App from './App';
import './index.scss';

window.vm = new Vue({
    el: '#app',
    components: {
        App,
    },
});
