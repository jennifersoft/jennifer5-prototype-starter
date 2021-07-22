import Vue from 'vue';
import { ariesuser, server } from '@common/base';
import i18n from './i18n';
import App from './App';
import store, { mapMutations } from './vuex';
import './index.scss';

window.vm = new Vue({
    el: '#app',
    store,
    provide: {
        theme: ariesuser.theme,
        editorTheme: ariesuser.theme == 'classic' ? 'vs' : 'vs-dark',
        platform: server.platform,
        i18n: i18n,
    },
    components: {
        App,
    },
    methods: {
        ...mapMutations(['loadSQL']),
    },
    mounted() {
        this.loadSQL(this.$refs.textarea.value);
    },
});
