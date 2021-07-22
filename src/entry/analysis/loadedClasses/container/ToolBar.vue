<template>
    <div class="tool-bar">
        <navigation-bar :loading="useLoading" @search="onSearchWithKeyword">
            <navigation-item>
                <dropdown
                    :width="180"
                    :items="searchTypes"
                    :selected-value="type"
                    @onchange="onChangeSearchType"
                ></dropdown>
            </navigation-item>
            <navigation-item>
                <search
                    v-model="keyword"
                    small
                    cancelable
                    :width="300"
                    :placeholder="i18n.className"
                    @search="onSearchWithKeyword"
                    @clear="onSearchWithKeyword"
                />
                <btn
                    class="search-icon"
                    :items="[
                        {
                            iconType: searchIcon,
                        },
                    ]"
                    :tooltipOptions="{
                        message: i18n.searchTooltip,
                    }"
                />
                <btn
                    :items="[{ text: i18n.treeSearch }]"
                    @click.native="onShowMethodTreeWindow"
                />
            </navigation-item>
            <navigation-item>
                <format-number-input
                    v-model="limit"
                    small
                    :step="100"
                    :max="60000"
                    :label="i18n.maxSearchCount"
                />
            </navigation-item>
        </navigation-bar>
        <window
            class="methodtree-window"
            :draggable="false"
            :messages="i18n"
            @cancel="onHideMethodTreeWindow"
            @apply="onApplyMethodTreeWindow"
            v-if="showMethodTreeWindow"
        >
            <template #subject>{{ i18n.selectClass }}</template>
            <method-tree
                :width="560"
                :height="270"
                :allow-method="false"
                :enable-search-list-type="true"
                @select="onSelectMethodTreeNode"
            ></method-tree>
        </window>
        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Btn from '@vuejs/component/button/Btn';
import Search from '@vuejs/component/Input/Search';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import MethodTree from './MethodTree';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import {
    LoadedClassListSearchTypeDef,
    LoadedClassTreeNodeTypeDef,
} from '@common/definition';
import { mapState, mapMutations, mapActions } from '../store/loadedClasses';

export default {
    inject: ['i18n'],
    components: {
        Window,
        AlertWindow,
        Dropdown,
        Btn,
        Search,
        FormatNumberInput,
        NavigationBar,
        NavigationItem,
        MethodTree,
    },
    data() {
        return {
            searchTypes: [
                {
                    text: this.i18n.class,
                    value:
                        LoadedClassListSearchTypeDef.CLASS_NAME_CONTAINS_KEYWORD,
                },
                {
                    text: this.i18n.superClass,
                    value:
                        LoadedClassListSearchTypeDef.SUPER_CLASS_MATCH_KEYWORD,
                },
                {
                    text: this.i18n.interface,
                    value: LoadedClassListSearchTypeDef.INTERFACE_MATCH_KEYWORD,
                },
            ],
            searchIcon: ICON_TYPE.help,

            type: LoadedClassListSearchTypeDef.CLASS_NAME_CONTAINS_KEYWORD,
            keyword: '',
            limit: 1000,

            showMethodTreeWindow: false,
            selectedMethodTreeNode: null,

            alertMessage: '',
        };
    },
    computed: {
        ...mapState({
            useLoading: state => state.useLoading,
            domainId: state => state.domainId,
            instanceOid: state => state.instanceOid,
            className: state => state.className,
            searchType: state => state.searchType,
        }),
    },
    watch: {
        domainId(newVal, oldVal) {
            if (newVal !== oldVal) this.onSearchWithKeyword();
        },
        instanceOid(newVal, oldVal) {
            if (newVal !== oldVal) this.onSearchWithKeyword();
        },
        className(newVal, oldVal) {
            if (newVal !== oldVal) this.keyword = newVal;
        },
        searchType(newVal, oldVal) {
            if (newVal !== oldVal) this.type = newVal;
        },
    },
    methods: {
        ...mapMutations(['updateSearchCondition']),
        ...mapActions(['loadClassListInAgent']),
        onSearchWithKeyword() {
            this.updateSearchCondition({
                type: this.type,
                keyword: this.keyword,
                limit: this.limit,
            });
            this.loadClassListInAgent();
        },
        onChangeSearchType({ value }) {
            this.updateSearchCondition({
                type: value,
                keyword: this.keyword,
                limit: this.limit,
            });
        },
        onShowMethodTreeWindow() {
            this.showMethodTreeWindow = true;
        },
        onHideMethodTreeWindow() {
            this.showMethodTreeWindow = false;
            this.selectedMethodTreeNode = null;
        },
        onApplyMethodTreeWindow() {
            const node = this.selectedMethodTreeNode;

            if (
                node !== null &&
                node.nodeType === LoadedClassTreeNodeTypeDef.CLASS
            ) {
                this.keyword = node.key;
                this.onSearchWithKeyword();
                this.onHideMethodTreeWindow();
            } else {
                this.alertMessage = this.i18n.M0635;
            }
        },
        onSelectMethodTreeNode(node) {
            this.selectedMethodTreeNode = node;
        },
    },
    mounted() {
        this.onSearchWithKeyword();
    },
};
</script>

<style lang="scss" scoped>
.tool-bar {
    margin-bottom: 10px;

    .methodtree-window {
        width: 600px;
        height: 400px;
        top: 158px;
        left: 100px;
    }

    ::v-deep .search-input-wrapper {
        &.blurred {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }
        > .input-field-wrapper {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }
    }

    ::v-deep .aries-ui-btn.search-icon {
        margin-right: 8px;
        > .item {
            border-left-width: 0px;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
        }
    }

    ::v-deep .aries-ui-format-number-input {
        .input-field-inline {
            width: 90px;
        }
    }

    ::v-deep .aries-ui-dropdown {
        .row-list {
            max-height: 140px;
        }
    }
}
</style>
