<template>
    <div class="jarcheck-wrapper">
        <top-bar @change="onChangeInstance" />

        <div class="main-contents">
            <navigation-bar @search="onSearch">
                <navigation-item>
                    <input-field :value="searchClass"
                                 :placeholder="i18n.className"
                                 :width="280"
                                 small
                                 ref="search"
                                 @blur="onSearch"
                                 @input="updateSearchClass"
                                 style="margin-right: 8px;" />
                    <btn ref="tree-search-btn"
                         :items="[{ text: i18n.treeSearch }]"
                         @click="openMethodTreeWindow" />
                </navigation-item>
                <navigation-item>
                    <btn :items="[{ text: i18n.reset }]"
                         @click="onClickReset" />
                </navigation-item>
            </navigation-bar>
            <jarcheck-table :list="tableData" :height="tableHeight" />
        </div>

        <method-tree-window
            v-if="showMethodWindow"
            :allow-method="false"
            :open-x="methodWindowPosition.x"
            :open-y="methodWindowPosition.y"
            @add="onAddTreeItem"
            @close="showMethodWindow = false"
        />
        <alert-window
            :message="alertMessage"
            @cancel="
                () => {
                    alertMessage = '';
                }
            "
            v-if="alertMessage !== ''"
        />
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import InputField from "@vuejs/component/Input/InputField";
import Btn from '@vuejs/component/button/Btn';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import JarcheckTable from '@entry/analysis/jarcheck/JarcheckTable';
import MethodTreeWindow from '@entry/analysis/methodStacktrace/container/MethodTreeWindow';
import {
    mapState,
    mapMethodTreeMutations,
    mapMutations,
    mapActions,
    mapMethodTreeActions,
} from './vuex';
import AlertWindow from '@vuejs/component/window/AlertWindow';

const DEBOUNCE_DELAY = 300;
const TOP_PADDING = 242;

export default {
    name: 'App',
    components: {
        TopBar,
        NavigationBar,
        NavigationItem,
        InputField,
        Btn,
        JarcheckTable,
        MethodTreeWindow,
        AlertWindow,
    },
    inject: {
        i18n: {
            default: () => ({
                treeSearch: 'treeSearch',
                reset: 'reset',
                className: 'className',
                M0021: 'M0021',
            }),
        },
    },
    computed: {
        ...mapState({
            searchClass: state => state.searchClass,
            tableData: state => state.tableData,
        }),
        onResizeDebounced() {
            return _.debounce(this.onResize, DEBOUNCE_DELAY);
        },
    },
    data() {
        return {
            showMethodWindow: false,
            methodWindowPosition: {
                x: 0,
                y: 0,
            },
            tableHeight: window.innerHeight - TOP_PADDING,
            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations([
            'updateDomain',
            'updateSearchClass',
            'resetTableData',
        ]),
        ...mapMethodTreeMutations(['updateTargetData']),
        ...mapActions(['loadJarcheckData']),
        ...mapMethodTreeActions(['loadMethodTreeNodes']),
        onChangeInstance({ domainId, instanceOid }) {
            this.updateDomain({ sid: domainId, oid: instanceOid });
            this.updateTargetData({ domainId, instanceOid });
        },
        async onSearch() {
            if (this.searchClass === '') {
                this.alertMessage = this.i18n.M0021;
                return;
            }
            await this.loadJarcheckData();
        },
        async openMethodTreeWindow() {
            await this.loadMethodTreeNodes();
            if (!this.showMethodWindow) this.showMethodWindow = true;
        },
        onAddTreeItem(key) {
            this.updateSearchClass(key);
            this.onSearch();
        },
        onClickReset() {
            this.updateSearchClass();
            this.resetTableData();
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
        const { left, bottom } = this.$refs[
            'tree-search-btn'
        ].$el.getBoundingClientRect();
        this.methodWindowPosition = {
            x: left,
            y: bottom + 6,
        };
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
    },
};
</script>

<style lang="scss" scoped>
.jarcheck-wrapper {
    .topbar {
        margin: 0;
    }
    .main-contents {
        padding: 0px 24px;

        .aries-ui-navigation-bar {
            margin: 24px 0 16px;
        }
    }
}
</style>
