import Vue from 'vue';
import store, { mapState, mapMutations, mapActions } from './vuex';
import '../base.scss';

const vm = document.getElementById('vue-mount');

new Vue({
    el: vm,
    store,
    computed: {
        ...mapState({
            params: state => state.params,
            codes: state => state.codes,
        }),
    },
    methods: {
        ...mapMutations(['updateParams']),
        ...mapActions(['loadCodes']),
    },
    beforeMount() {
        this.updateParams({ ...vm.dataset });
    },
    mounted() {
        this.loadCodes(this.params);
    },
});
