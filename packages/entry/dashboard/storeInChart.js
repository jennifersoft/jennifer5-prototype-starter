import vuestore from '@vuejs/vuex/store';
import dashboard from '@vuejs/vuex/dashboard';

vuestore.registerModule('dashboard', dashboard);

export default vuestore;
