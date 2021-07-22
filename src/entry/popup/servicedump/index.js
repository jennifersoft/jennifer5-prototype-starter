import Vue from 'vue';
import App from './App';
import store from './vuex';

window.vm = new Vue({
    store,
    el: '#app',
    components: {
        App,
    },
});
