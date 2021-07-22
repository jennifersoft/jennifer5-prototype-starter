import vuestore from '@vuejs/vuex/store';
import dashboard from '@vuejs/vuex/dashboard';
import dashboardMenus from '@vuejs/vuex/dashboardMenus';

vuestore.registerModule('dashboard', dashboard);
vuestore.registerModule('dashboardMenus', dashboardMenus);

export const store = vuestore;
