import axios from '@library/axios';
import Vue from 'vue';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import QbTitle from './component/qbTitle';
import QbContents from './component/qbContents';
import store from '@vuejs/vuex/store';
import { state } from './store/state';
import { mutations } from './store/mutations';
import { i18n } from '@common/utility';
import './index.scss';
import { STORE_NAMESPACE, mapState, mapMutations } from './constant';
import { addCompletionItems } from './autocomplete';

const storageKey1 = 'queryBuilderTabs';
const storageKey2 = 'queryBuilderTableSchema';
const storageKey3 = 'queryBuilderCurrentTab';
const storageKey4 = 'queryBuilderLimitCount';
const storageKey5 = 'queryBuilderLimitTimeout';
const completionCache = new Set();

store.registerModule(STORE_NAMESPACE, {
    namespaced: true,
    state,
    mutations,
});

new Vue({
    el: '#app',
    store,
    components: {
        AlertWindow,
        QbTitle,
        QbContents,
    },
    provide: {
        i18n: {
            queryBuilder: i18n.get('ui.title.queryBuilder'),
            execute: i18n.get('ui.label.execute'),
            reset: i18n.get('ui.button.reset'),
            tableSchema: i18n.get('ui.label.tableSchema'),
            maxRows: i18n.get('ui.label.maxRows'),
            timeout: i18n.get('ui.label.timeout'),
            sec: i18n.get('ui.label.unit.sec'),
            console: 'Console',
            table: 'Table',
            json: 'JSON',
            data: 'DATA',
            public: 'PUBLIC',
            tables: 'TABLES',
        },
    },
    computed: {
        ...mapState({
            tabs: state => state.tabs || {},
            schemas: state => state.schemas || [],
        }),
        code() {
            return this.tabs[this.activeSqlTab] || '';
        },
        completions() {
            const schema = this.schemas.filter(
                item => item.name == this.activeSqlTab
            );
            return schema.length == 1 ? schema[0].columns : [];
        },
    },
    data() {
        return {
            storedCode: '',
            activeSqlTab: '',
            activeOutput: 'table',
            activeSchema: true,
            disableSchema: false,
            isRunScript: false,
            alertMessage: '',
            limitCount: 100,
            limitTimeout: 10,
        };
    },
    methods: {
        ...mapMutations({
            onUpdateSchemas: 'updateSchemas',
            onUpdateData: 'updateData',
            onAddMessage: 'addMessage',
            onUpdateTabs: 'updateTabs',
            onDeleteTab: 'deleteTab',
        }),
        onResetScript() {
            const jsonStr = JSON.stringify({
                ...this.tabs,
                [this.activeSqlTab]: ' ',
            });
            this.onUpdateTabs(jsonStr);
            this.storedCode = ' ';
            localStorage.setItem(storageKey1, jsonStr);
        },
        onRunScript() {
            if (this.code !== '') {
                const params = new URLSearchParams();

                params.append('query', this.code);
                params.append('rowLimit', this.limitCount);
                params.append('timeoutInSecond', this.limitTimeout);

                this.isRunScript = true;

                axios
                    .post('/queryBuilder/read-v2', params)
                    .then(res => {
                        if (res.data.error || res.data.rows.length === 0) {
                            this.activeOutput = 'console';
                        } else {
                            this.onUpdateData(res.data);
                        }

                        this.onAddMessage(res.data.message);
                        this.isRunScript = false;
                    })
                    .catch(() => {
                        this.isRunScript = false;
                    });
            }
        },
        onAddSqlTab(tab = '', code = '') {
            if (this.checkTabLimitSize(tab)) {
                this.alertMessage = i18n.get('M0613');
                return;
            }

            if (tab == '') {
                this.activeSqlTab = `Tab ${this.getNextTabIndex()}`;
            } else {
                this.activeSqlTab = `${tab}`;
                this.syncEditorCompletions();
            }

            const newCode = this.tabs[this.activeSqlTab] || code;
            this.storedCode = newCode;
            this.onUpdateEditorCode(newCode, this.activeSqlTab);
            localStorage.setItem(storageKey3, this.activeSqlTab);
        },
        onDeleteSqlTab(tab) {
            this.onDeleteTab(tab);
            localStorage.setItem(storageKey1, JSON.stringify(this.tabs));
        },
        onChangeSqlTab(tab) {
            this.activeSqlTab = tab;
            this.storedCode = this.tabs[tab];
            this.syncEditorCompletions();
            localStorage.setItem(storageKey3, this.activeSqlTab);
        },
        onChangeOutput(output) {
            this.activeOutput = output;
        },
        onReadyEditor() {
            this.storedCode = this.code;
        },
        onUpdateEditorCode(code, tab) {
            const newTabs = JSON.parse(JSON.stringify(this.tabs));
            newTabs[!tab ? this.activeSqlTab : tab] = code;

            const jsonStr = JSON.stringify(newTabs);
            this.onUpdateTabs(jsonStr);
            localStorage.setItem(storageKey1, jsonStr);
        },
        onToggleSchema() {
            this.activeSchema = !this.activeSchema;
            localStorage.setItem(storageKey2, this.activeSchema);
        },
        onChangeLimitCount(count) {
            this.limitCount = count;
            localStorage.setItem(storageKey4, this.limitCount);
        },
        onChangeLimitTimeout(timeout) {
            this.limitTimeout = timeout;
            localStorage.setItem(storageKey5, this.limitTimeout);
        },
        updateSchemas(callback) {
            axios
                .get('/queryBuilder/schema')
                .then(res => {
                    this.onUpdateSchemas(res.data);
                    this.syncEditorCompletions();
                    if (typeof callback === 'function')
                        callback.call(this, res.data);
                })
                .catch(() => {
                    this.activeSchema = false;
                    this.disableSchema = true;
                });
        },
        syncEditorCompletions() {
            const completions = this.completions
                .filter(col => !completionCache.has(col.name))
                .map(col => {
                    completionCache.add(col.name);
                    return [col.name, col.type];
                });

            if (completions.length > 0)
                addCompletionItems(
                    /(select \w.*)|(where \w.*)|(and \w.*)|(or \w.*)|(by \w.*)/i,
                    completions
                );
        },
        checkTabLimitSize(tab) {
            const tabKeys = Object.keys(this.tabs).reverse();

            // 탭을 추가할 때만 확인하기
            if (!tabKeys.includes(tab)) {
                const newTab = tab === '' ? 'Tab' : tab;
                const tabStr = tabKeys.reduce((cur, acc) => cur + acc, newTab);

                if (tabStr.length * 14 > window.innerWidth * 0.8) {
                    return true;
                }
            }

            return false;
        },
        getNextTabIndex() {
            const tabKeys = Object.keys(this.tabs).reverse();
            let tabIndex = tabKeys.length;

            for (let i = 0; i < tabKeys.length; i++) {
                const tokens = tabKeys[i].split(' ');
                if (tokens[1]) {
                    tabIndex = parseInt(tokens[1]) + 1;
                    break;
                }
            }

            return tabIndex;
        },
    },
    beforeMount() {
        this.onUpdateTabs(localStorage.getItem(storageKey1));

        const schema = localStorage.getItem(storageKey2);
        const tab = localStorage.getItem(storageKey3);
        const limitCount = localStorage.getItem(storageKey4);
        const limitTimeout = localStorage.getItem(storageKey5);

        this.activeSqlTab = tab === null ? Object.keys(this.tabs)[0] : tab;
        this.activeSchema = schema === null ? true : schema === 'true';
        this.limitCount = limitCount === null ? 1000 : parseInt(limitCount);
        this.limitTimeout = limitTimeout === null ? 10 : parseInt(limitTimeout);

        // 테이블 스키마 업데이트하기
        this.updateSchemas(data => {
            addCompletionItems(
                /(from \w.*)|(join \w.*)/i,
                data.map(item => [item.name, 'Table'])
            );
        });
    },
});
