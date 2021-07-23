<template>
    <div class="domain-tree-layer">
        <div class="title">
            <span>{{ i18nMessages.domainGroup }}</span>
            <btn
                class="border-none"
                style="margin: -10px -8px 0 0;"
                :items="[{ iconType: iconTypes.close }]"
                @click="$emit('active-tree')"
            />
        </div>
        <div class="main">
            <search
                v-model="searchText"
                class="domain-search-input"
                :placeholder="i18nMessages.domainOrGroup"
                :width="224"
                small
            />
            <tree
                :tree="domainTreeData"
                :noUnselect="true"
                :selectable="true"
                @rowSelected="onSelectDomainTree"
                @treeChange="onChangeDomainTree"
            />
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Tree from '@vuejs/component/resource/tree/DomainGroupTree';
import Btn from '@vuejs/component/button/Btn';
import Search from '@vuejs/component/input/Search';
import i18nMessages from '../i18n';
import { hasChildren } from '@vuejs/component/resource/tree/treeAction';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

const { mapState, mapMutations } = createNamespacedHelpers('domain');

export default {
    name: 'DomainGroupLayer',
    components: {
        Tree,
        Btn,
        Search,
    },
    computed: {
        ...mapState(['domainList', 'selectedOne', 'multiDomainFlag']),
        domainTreeData() {
            if (!this.domainList) {
                return [];
            }
            return this.domainList
                .map((d, i) => {
                    let noInteraction =
                        (this.multiDomainFlag === false && d.data.sid === -1) ||
                        d.noInteraction;
                    return {
                        ...d,
                        data: {
                            ...d.data,
                            treeIndex: d.treeIndex,
                        },
                        rowId: `row-key-${i}`,
                        indent: d.treeIndex.split('.').length - 1,
                        resourceType:
                            d.data.sid === -1 ? 'domain-group' : 'domain',
                        label: d.label,
                        treeIndex: d.treeIndex,
                        fold: hasChildren(d.treeIndex, this.domainList)
                            ? // JJC-3415, Domain 그룹이 open/fold 상태 유지를 위한 코드
                              this.foldCache[d.treeIndex] || 'open'
                            : 'no-fold',
                        selected: d.treeIndex === this.selectedOne.treeIndex,
                        noInteraction,
                    };
                })
                .filter((d, _, arr) => {
                    if (this.searchText.length === 0) return true;

                    return d.resourceType === 'domain'
                        ? this.filterIgnoringCase(d.label, this.searchText)
                        : arr
                              .filter(e =>
                                  e.data.index.startsWith(d.data.index)
                              ) // filter children
                              .some(e =>
                                  this.filterIgnoringCase(
                                      e.label,
                                      this.searchText
                                  )
                              );
                });
        },
    },
    data() {
        return {
            foldCache: {},
            searchText: '',
            i18nMessages,
        };
    },
    methods: {
        ...mapMutations(['selectDomain']),
        onSelectDomainTree(element) {
            this.selectDomain(element.treeIndex);
        },
        onChangeDomainTree(tree) {
            tree.forEach(node => {
                this.$set(this.foldCache, node.treeIndex, node.fold);
            });
        },
        filterIgnoringCase(text, keyword) {
            return text.toLowerCase().includes(keyword.toLowerCase());
        },
    },
    created() {
        this.iconTypes = {
            close: ICON_TYPE.close,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        domain-group-tree-bg-color: #ffffff,
        common-header-font-color: #212121,
    ),
    dark: (
        domain-group-tree-bg-color: #292929,
        common-header-font-color: #e8e8e8,
    ),
);

.domain-tree-layer {
    @include themify($themes) {
        z-index: 2000;
        width: 256px;
        height: calc(100vh - 65px);
        box-sizing: border-box;
        padding: 18px 16px;
        left: 0;
        top: 65px;
        flex-direction: column;
        color: themed('common-header-font-color');
        background-color: themed('domain-group-tree-bg-color');
        box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.08),
            0 2px 10px 0 rgba(0, 0, 0, 0.09), 0 0 2px 0 rgba(0, 0, 0, 0.2);

        > .title {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            line-height: 1.5;
        }

        > .main {
            margin-top: 24px;
            border-top: none;

            > .domain-search-input {
                margin-bottom: 16px;
            }

            > .row-label {
                max-width: 130px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
}
</style>
