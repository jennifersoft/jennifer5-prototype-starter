<template>
    <div class="domain-tree-n-event-status">
        <div class="title">
            <span>{{ i18nMessages.domainGroup }}</span>
            <btn
                class="border-none"
                normal
                :items="[
                    {
                        iconType: closeIcon,
                    },
                ]"
                :tooltipOptions="{
                    position: 'top-right',
                    message: i18n.close,
                }"
                @click="onClickCloseBtn"
            />
        </div>
        <div class="main">
            <search
                v-model="searchText"
                class="domain-search-input"
                :placeholder="i18nMessages.domainOrGroup"
                :width="328"
                normal
            />
            <tree
                :tree="domainTreeData"
                :noUnselect="true"
                :selectable="true"
                :large="true"
                @rowSelected="onSelectDomainTree"
                @treeChange="onChangeDomainTree"
            />
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Tree from '@vuejs/component/Resource/Tree/DomainGroupTree';
import Btn from '@vuejs/component/button/Btn';
import Search from '@vuejs/component/Input/Search';
import i18nMessages from '@layout/i18n';
import {
    getAllChildren,
    hasChildren,
} from '@vuejs/component/Resource/Tree/treeAction';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

const { mapState, mapMutations } = createNamespacedHelpers('domain');

export default {
    inject: {
        i18n,
        theme: {
            default: 'classic',
        },
    },
    components: {
        Tree,
        Btn,
        Search,
    },
    props: {
        eventCountData: {
            type: Object,
            required: true,
        },
        //multiDomain에서 호출
        paramSid: {
            type: Number,
            required: false,
        },
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

                    const searchSidList =
                        d.data.sid === -1
                            ? getAllChildren(d.treeIndex, this.domainList)
                                  .filter(domain => domain.data.sid !== -1)
                                  .map(domain => domain.data.sid)
                            : [d.data.sid];

                    let eventStatus = 'default';

                    const countData = searchSidList
                        .map(sid =>
                            this.eventCountData[sid]
                                ? Object.values(this.eventCountData[sid])
                                : []
                        )
                        .flat()
                        .reduce(
                            (acc, eventCountData) => {
                                acc.normal += eventCountData.normal;
                                acc.warning += eventCountData.warning;
                                acc.fatal += eventCountData.fatal;
                                return acc;
                            },
                            { normal: 0, warning: 0, fatal: 0 }
                        );

                    eventStatus =
                        countData.fatal > 0
                            ? 'fatal'
                            : countData.warning > 0
                            ? 'warning'
                            : countData.normal > 0
                            ? 'normal'
                            : 'default';

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
                        status: eventStatus,
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
                        ? d.label.includes(this.searchText)
                        : arr
                              .filter(e =>
                                  e.data.index.startsWith(d.data.index)
                              ) // filter children
                              .some(e => e.label.includes(this.searchText));
                });
        },
        selectedDomainOrGroupName() {
            return this.domainTreeData.filter(item => item.selected)[0]?.label;
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
        onClickCloseBtn() {
            this.$emit('selected:showDomainTree', false);
        },
    },
    watch: {
        selectedDomainOrGroupName() {
            this.$emit('selected:tree:name', this.selectedDomainOrGroupName);
        },
    },
    mounted() {
        this.$emit('selected:tree:name', this.selectedDomainOrGroupName);
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
@import 'common.scss';

.domain-tree-n-event-status {
    @include themify($themes) {
        width: 360px;
        height: calc(100vh - 65px);
        box-sizing: border-box;
        padding: 18px 16px;

        flex-direction: column;
        color: themed('common-header-font-color');
        background-color: themed('domain-group-tree-bg-color');

        > .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: themed('section-text-color');
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
