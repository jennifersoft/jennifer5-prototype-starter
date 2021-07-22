<template>
    <div class="search-class-wrapper">
        <top-bar @change="onChangeInstance" />

        <div class="main-contents">
            <navigation-bar @search="loadSearchClassData" :loading="loading">
                <navigation-item>
                    <input-field
                        small
                        :value="searchKeyword"
                        :width="380"
                        :placeholder="i18n.searchDirOrJarFile"
                        @input="updateSearchKeyword"
                        @keyup.native.enter="loadSearchClassData"
                        style="margin-right: 8px;"
                    />
                    <dropdown
                        :items="searchTypes"
                        :width="216"
                        no-scroll
                        @onchange="onChangeSearchType"
                    />
                </navigation-item>
                <navigation-item :label="i18n.maxDisplayCount">
                    <dropdown
                        :items="displayLimits"
                        :width="80"
                        no-scroll
                        @onchange="onChangeSearchLimit"
                    />
                </navigation-item>
            </navigation-bar>
            <search-class-table :list="tableData" :height="tableHeight" />
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import InputField from '@vuejs/component/Input/InputField';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';

import { mapState, mapMutations, mapActions } from './vuex';
import SearchClassTable from '@entry/analysis/searchclass/SearchClassTable';

const DEBOUNCE_DELAY = 300;
const TOP_PADDING = 240;

export default {
    name: 'App',
    components: {
        SearchClassTable,
        TopBar,
        NavigationBar,
        NavigationItem,
        InputField,
        Dropdown,
    },
    inject: {
        i18n: {
            default: () => ({
                searchAllClass: 'searchAllClass',
                searchUseedClass: 'searchUsedClass',
                searchUnusedClass: 'searchUnusedClass',
                maxDisplayCount: 'maxDisplayCount',
                searchDirOrJarFile: 'searchDirOrJarFile',
            }),
        },
    },
    computed: {
        ...mapState({
            tableData: state => state.tableData,
            searchKeyword: state => state.searchParams.keyword,
            loading: state => state.loading,
        }),
        searchTypes() {
            return [
                { text: this.i18n.searchAllClass, value: 3 },
                { text: this.i18n.searchUseedClass, value: 2 },
                { text: this.i18n.searchUnusedClass, value: 1 },
            ];
        },
        displayLimits() {
            return [
                { text: 100, value: 100 },
                { text: 90, value: 90 },
                { text: 80, value: 80 },
                { text: 70, value: 70 },
                { text: 60, value: 60 },
                { text: 50, value: 50 },
            ];
        },
        onResizeDebounced() {
            return _.debounce(this.onResize, DEBOUNCE_DELAY);
        },
    },
    data() {
        return {
            tableHeight: window.innerHeight - TOP_PADDING,
        };
    },
    methods: {
        ...mapMutations([
            'updateDomain',
            'updateSearchKeyword',
            'updateSearchType',
            'updateSearchLimit',
            'updateTableData',
        ]),
        ...mapActions(['loadSearchClassData']),
        onChangeInstance({ domainId, instanceOid }) {
            this.updateDomain({ sid: domainId, oid: instanceOid });
            this.updateSearchKeyword();
            this.updateTableData();
        },
        onChangeSearchType({ value }) {
            this.updateSearchType(value);
        },
        onChangeSearchLimit({ value }) {
            this.updateSearchLimit(value);
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
    },
};
</script>

<style lang="scss" scoped>
.search-class-wrapper {
    .topbar {
        margin: 0 0 8px 0;
    }
    .aries-ui-navigation-bar {
        margin-bottom: 16px;
    }
    .main-contents {
        padding: 16px 24px 0;
    }
}
</style>
