<template>
    <div class="method-tree">
        <div
            class="header-for-search-class"
            v-if="!allowMethod && enableSearchListType"
        >
            <option-group
                type="radio"
                :options="classSearchTypes"
                :active="[classSearchType]"
                @change="onChangeClassSearchType"
                inline
            />
            <div
                class="search-field-group"
                v-if="this.classSearchType === 'keyword'"
            >
                <search
                    v-model="keywordForClassName"
                    :width="180"
                    :placeholder="i18n.className"
                    @search="onSearchClassByKeyword"
                    small
                />
                <format-number-input
                    v-model="searchLimit"
                    :disabled="!showClassByList"
                    :max="6000"
                    :min="0"
                    :step="100"
                    :label="i18n.M0059"
                    small
                />
            </div>
        </div>
        <tree-selector
            v-show="!showClassByList"
            :width="width"
            :height="heightComputed"
            :tree="methodTree"
            @change="onClickNode"
        />
        <list-selector
            v-show="showClassByList"
            :style="{ height: heightComputed + 'px' }"
            :list="classListLabeled"
            no-search
            hide-header
            @list-select="onClickListItem"
        />
    </div>
</template>

<script>
import TreeSelector from '@vuejs/component/TreeSelector/TreeSelector';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import OptionGroup from '@vuejs/component/Toggle/OptionGroup';
import Search from '@vuejs/component/Input/Search';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import { LoadedClassTreeNodeTypeDef } from '@common/definition';
import { mapState, mapActions } from '../store/methodTree';

export default {
    components: {
        OptionGroup,
        Search,
        FormatNumberInput,
        TreeSelector,
        ListSelector,
    },
    inject: {
        i18n: {
            default: {
                treeSearch: 'treeSearch',
                keywordSearch: 'keywordSearch',
                className: 'className',
                M0059: 'searchLimit',
            },
        },
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        allowMethod: {
            type: Boolean,
            required: false,
            default: false,
        },
        enableSearchListType: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState({
            methodTree: state => state.methodTree,
            classList: state => state.classList,
        }),
        heightComputed() {
            let propsHeight = this.height;
            if (this.allowMethod) return propsHeight;
            const optionHeight = 30;
            const margin = 6;
            const fieldHeight = 32;
            if (this.enableSearchListType) {
                propsHeight -= optionHeight;
                propsHeight -= margin;
                if (this.classSearchType === 'keyword')
                    propsHeight -= fieldHeight;
            }
            return propsHeight;
        },
        showClassByList() {
            return !this.allowMethod && this.classSearchType === 'keyword';
        },
        classListLabeled() {
            return this.classList.map(e => ({
                label: e.name,
            }));
        },
    },
    data() {
        return {
            classSearchType: 'tree',
            classSearchTypes: [
                { value: 'tree', label: this.i18n.treeSearch },
                { value: 'keyword', label: this.i18n.keywordSearch },
            ],
            keywordForClassName: '',
            searchLimit: 1000,
        };
    },
    methods: {
        ...mapActions(['addMethodTreeNodes', 'searchClassList']),
        searchParentKeys(key, data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    const parent = data[i].parent;
                    if (parent !== null) {
                        this.searchParentKeys(parent, data, parent.split('.'));
                    }
                    break;
                }
            }
        },
        onClickNode(nodes) {
            const node = nodes[0];

            if (node.hasChild) {
                // 패키지 또는 클래스일 때, allowMethod prop가 true일 때, 자식 노드를 가져온다.
                if (
                    node.nodeType === LoadedClassTreeNodeTypeDef.PACKAGE ||
                    (node.nodeType === LoadedClassTreeNodeTypeDef.CLASS &&
                        this.allowMethod)
                ) {
                    const key = node.key;
                    this.searchParentKeys(key, this.methodTree);
                    this.addMethodTreeNodes(key);
                }
            }

            this.$emit('select', {
                ...node,
                classSearchType: this.classSearchType,
            });
        },
        onClickListItem(row) {
            this.$emit('select', {
                icon: 'class',
                key: row.label,
                label: row.label, // onClickNode 함수 실행시 넘기는 값은 클래스명만 노출됨
                nodeType: LoadedClassTreeNodeTypeDef.CLASS,
                classSearchType: this.classSearchType,
            });
        },
        onChangeClassSearchType([key]) {
            this.classSearchType = key;
        },
        onSearchClassByKeyword() {
            this.searchClassList({
                keyword: this.keywordForClassName,
                limit: this.searchLimit,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #dadada,
    ),
    dark: (
        border-color: #4e4e4e,
    ),
);
.method-tree {
    > .header-for-search-class {
        margin-bottom: 6px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        > .search-field-group {
            float: right;
            display: inline-flex;
            align-items: center;
            > :first-child {
                margin-right: 6px;
            }
        }
    }
    > .tree-selector {
        @include themify($themes) {
            border-radius: 3px;
            border: 1px solid themed('border-color');
        }
    }
}
</style>
