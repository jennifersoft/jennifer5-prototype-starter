<template>
    <div class="business-tree-layer" v-show="activeBusinessTree">
        <div class="title">
            {{ i18n.business }}
            <span style="float:right">
                <btn
                    class="border-none"
                    :items="[{ iconType: iconTypes.close }]"
                    @click="onActiveBusinessTree"
                ></btn>
            </span>
        </div>
        <div class="main">
            <Tree :tree="businessTreeData" @treeChange="treeChange" />
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Tree from '@vuejs/component/Resource/Tree/DomainGroupTree';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { ElementManager } from '@common/legacy/ElementManager';
import { BusinessManager } from '@common/legacy/BusinessManager';
import { Observer } from '@common/legacy/Observer';
import { DataKeywordInObserver } from '@common/ObserverKeyword';
import { normalizeFold } from '@vuejs/component/Resource/Tree/treeAction';

export default {
    name: 'BusinessTreeLayer',
    inject: {
        i18n,
    },
    props: {
        activeBusinessTree: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Btn,
        Tree,
    },
    data() {
        return {
            iconTypes: {
                help: ICON_TYPE.help,
                close: ICON_TYPE.close,
                hierarchy: ICON_TYPE.hierarchy,
            },

            businessTreeData: [],
        };
    },
    computed: {
        // businessTreeData() {
        //     return [];
        // },
    },
    methods: {
        onActiveBusinessTree() {
            this.$emit('update:activeBusinessTree', !this.activeBusinessTree);
        },
        normalize(array, resourceType) {
            /**
             * oid가 -1: domain, 그외: business
             *
             */
            const m = array.map((a, i) => {
                return {
                    rowId: `row-key-${i}`,
                    indent: a.treeIndex.split('.').length - 1,
                    label: a.shortName,
                    resourceType: a.oid === -1 ? 'domain' : resourceType,
                    check: a.selected ? 'on' : 'off',
                    disabled: !a.existData,
                    showWarningIcon: false,
                    treeIndex: a.treeIndex,
                    data: a,
                };
            });

            return normalizeFold(m);
        },
        configureBusinessData() {
            const BUSINESS_VIEW_COUNT = 30;
            const sids = ElementManager.getSelectedDomainSidList();

            if (sids.length > 0) {
                // 비지니스 목록 로드 합세
                BusinessManager.load(sids, () => /*done*/ {
                    // 목록에 따른 선택 요소들을 가지고 온다.
                    BusinessManager.loadCheckedOids(sids, () => {
                        var selectedCount = BusinessManager.selectedBusinessCount();

                        if (selectedCount > BUSINESS_VIEW_COUNT) {
                            BusinessManager.initSelect(BUSINESS_VIEW_COUNT);
                        }

                        //비즈니스 데이터 생성.
                        // loadBusinessTree();

                        this.businessTreeData = this.normalize(
                            BusinessManager.list(),
                            'business'
                        );
                    });
                });
            }
        },
        treeChange(treeData) {
            const checkedIds = treeData
                .filter(
                    data => data.check === 'on' && data.data.bizId !== undefined
                )
                .map(el => el.data.id);

            BusinessManager.selectIds(checkedIds);
        },
    },
    mounted() {
        this.configureBusinessData();

        Observer.on(DataKeywordInObserver.DOMAIN_BAR_CHANGE, () => {
            this.configureBusinessData();
        });
    },
};
</script>
<style lang="scss" scoped>
.business-tree-layer {
    position: absolute;
    z-index: 1000;
    width: 300px;
    height: calc(100% - 67px);
    left: 0;
    top: 67px;
    flex-direction: column;
    @import '~@layout/container/header/themes.scss';
    @include themify($themes) {
        color: themed('common-header-font-color');
        background-color: themed('layer-tree-bg-color');
        box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.08),
            0 2px 10px 0 rgba(0, 0, 0, 0.09), 0 0 2px 0 rgba(0, 0, 0, 0.2);

        > .title {
            box-sizing: border-box;
            padding: 8px 10px;
            height: 34px;
            font-size: 13px;
            line-height: 20px;
            > span {
                float: right;
            }
        }

        > .main {
            border-top: none;
            padding: 8px 10px;
            box-sizing: border-box;
            > .row-label {
                max-width: 130px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            ::v-deep .row {
                max-width: 280px;
            }
        }
    }
}
</style>
