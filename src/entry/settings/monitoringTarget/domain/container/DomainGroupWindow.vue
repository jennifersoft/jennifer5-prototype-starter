<template>
    <window
        class="domain-group-window"
        :messages="{ apply: i18n.confirm, cancel: i18n.cancel }"
        :open-w="rootWindow.width"
        :open-h="rootWindow.height"
        :open-x="rootWindow.x"
        :open-y="rootWindow.y"
        hide-footer
        @cancel="() => $emit('cancel')"
    >
        <template #subject>{{ i18n.domainGroupManagement }}</template>
        <div class="main">
            <div class="top">
                <div class="left"></div>
                <div class="right">
                    <btn
                        class="border-none"
                        normal
                        :items="[{ iconType: iconTypes.move }]"
                        :tooltip-options="{ message: i18n.move }"
                        :disabled="!canBeMovedNodes"
                        :pressed="treeMenu.active"
                        @click="onClickTreeNodeMoveBtn"
                    ></btn>
                    <btn
                        class="border-none"
                        normal
                        :items="[{ iconType: iconTypes.except }]"
                        :tooltip-options="{ message: i18n.except }"
                        :disabled="selectedNodes.length === 0"
                        @click="onClickTreeNodeDeleteBtn"
                    ></btn>
                    <btn
                        class="border-none"
                        normal
                        :items="[{ iconType: iconTypes.add }]"
                        :tooltip-options="{ message: i18n.newDomainGroup }"
                        :pressed="addWindow.active && addWindow.isNew"
                        @click="onClickTreeNodeAddBtn"
                        v-if="activeTab === 'domainGroup'"
                    ></btn>
                    <btn
                        class="border-none"
                        normal
                        :items="[{ text: i18n.changeName }]"
                        :pressed="addWindow.active && !addWindow.isNew"
                        :disabled="selectedNodes.length === 0"
                        @click="onClickTreeNodeModifyBtn"
                        v-if="activeTab === 'domainGroup'"
                    ></btn>
                </div>
            </div>
            <tab
                normal
                :tabs="tabs"
                :active-tab="activeTab"
                @change="onChangeTab"
            ></tab>
            <div class="bottom" :key="selectedNodesCount">
                <tree-selector
                    :tree="domainGroupList"
                    :multi-select="false"
                    :width="530"
                    :height="430"
                    @change="onChangeTreeNodes"
                    v-if="activeTab === 'domainGroup'"
                ></tree-selector>
                <group-list
                    :items="domainListInGroup"
                    :height="430"
                    @change="onChangeTreeNodes"
                    v-else
                ></group-list>
            </div>
        </div>

        <window
            :draggable="false"
            :messages="{
                apply: addWindow.isNew ? i18n.add : i18n.modify,
                cancel: i18n.cancel,
            }"
            :open-w="375"
            :open-h="178"
            :open-x="100"
            :open-y="240"
            @cancel="() => (addWindow.active = false)"
            @apply="onClickNewDomainGroupBtn"
            v-if="addWindow.active"
        >
            <template #subject>{{
                addWindow.isNew ? i18n.newDomainGroup : i18n.changeName
            }}</template>
            <input-field
                v-model="addWindow.value"
                :placeholder="addWindow.placeholder"
                :invalid="validNewDomainGroupName"
            ></input-field>
        </window>

        <tree-menu
            :nodes="treeMenu.nodes"
            @click="onClickTreeNodeInTreeMenu"
            v-if="treeMenu.active"
        ></tree-menu>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import Btn from '@vuejs/component/button/Btn';
import Tab from '@vuejs/component/tab/Tab';
import InputField from '@vuejs/component/Input/InputField';
import TreeSelector from '@vuejs/component/TreeSelector/TreeSelector';
import TreeMenu from '../component/TreeMenu';
import GroupList from '../component/GroupList';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { validCheckName } from '@common/utility';
import { mapState, mapActions } from '../vuex';
import {
    reloadTreeNodes,
    initializeTreeNodes,
    createDomainListInGroup,
    childrenDepth,
    parentDepth,
} from '../../base/utility';

export default {
    components: {
        Window,
        Btn,
        Tab,
        InputField,
        TreeSelector,
        TreeMenu,
        GroupList,
    },
    inject: ['i18n'],
    data() {
        const width = 570;
        const height = 630;

        return {
            rootWindow: {
                width,
                height,
                x: window.innerWidth / 2 - width / 2,
                y: window.innerHeight / 2 - height / 2,
            },
            addWindow: {
                active: false,
                value: '',
                placeholder: this.i18n.M0075,
                isNew: true,
            },
            treeMenu: {
                active: false,
                nodes: [],
            },
            iconTypes: {
                add: ICON_TYPE.add,
                except: ICON_TYPE.remove,
                move: ICON_TYPE.moveFiles,
            },
            tabs: [
                {
                    key: 'domainGroup',
                    value: this.i18n.domainGroup,
                },
                {
                    key: 'domain',
                    value: this.i18n.domain,
                },
            ],
            activeTab: 'domainGroup',

            selectedNodes: [],
            selectedNodesCount: 1,
        };
    },
    computed: {
        ...mapState({
            useDomainGroup: state => state.useDomainGroup,
            domainGroupTree: state => state.domainGroupTree,
            domainList: state => state.domainList,
        }),
        validNewDomainGroupName() {
            const name = this.addWindow.value;
            return name.length > 20 || validCheckName(name);
        },
        domainGroupTreeNodes() {
            return initializeTreeNodes(this.domainGroupTree);
        },
        domainGroupList() {
            return this.domainGroupTreeNodes
                .filter(node => node.sid === -1)
                .map(node =>
                    this.createTreeSelectorItem(
                        node.sid,
                        node.label,
                        node.key,
                        node.parent,
                        node.sid === -1 ? 'domainGroup' : 'domain'
                    )
                );
        },
        domainListInGroup() {
            return createDomainListInGroup(
                this.useDomainGroup,
                this.domainGroupTree,
                this.domainList
            );
        },
        // 선택한 노드가 이동 가능한 상태인지 확인
        canBeMovedNodes() {
            if (this.activeTab === 'domainGroup') {
                if (this.selectedNodes.length === 1)
                    return this.getSelectedNodeDepths().children === 0;
                return false;
            } else {
                return this.selectedNodes.length > 0;
            }
        },
    },
    methods: {
        ...mapActions(['saveDomainGroupTree']),
        onChangeTab(tab) {
            this.resetSelectedNodes();
            this.activeTab = tab;
        },
        onChangeTreeNodes(nodes) {
            if (this.activeTab === 'domainGroup') {
                this.selectedNodes = nodes;
            } else {
                this.selectedNodes = nodes.map(node => {
                    return {
                        sid: node.sid,
                        label: node.shortName,
                        parent: node.parentIndex,
                    };
                });
            }
            this.treeMenu.active = false;
        },

        // 상단 툴바 버튼들
        onClickTreeNodeAddBtn() {
            this.addWindow = {
                ...this.addWindow,
                active: true,
                value: '',
                isNew: true,
            };
            this.treeMenu.active = false;
        },
        onClickTreeNodeModifyBtn() {
            this.addWindow = {
                ...this.addWindow,
                active: true,
                value: this.selectedNodes[0].label,
                isNew: false,
            };
            this.treeMenu.active = false;
        },
        async onClickTreeNodeDeleteBtn() {
            const nodes = [...this.domainGroupTreeNodes];

            if (this.activeTab === 'domainGroup') {
                const key = this.selectedNodes[0].key;

                nodes.splice(
                    nodes.findIndex(item => item.key === key),
                    1
                );
            } else {
                this.selectedNodes.forEach(node => {
                    nodes.splice(
                        nodes.findIndex(item => item.sid === node.sid),
                        1
                    );
                });
            }

            // 부모 노드가 삭제되면 index가 null로 나옴
            const removedNodes = reloadTreeNodes(nodes).filter(
                node => node.index !== null
            );

            this.resetSelectedNodes();
            await this.saveDomainGroupTree(removedNodes);
        },
        onClickTreeNodeMoveBtn() {
            const nodes = reloadTreeNodes(
                this.domainGroupTreeNodes.filter(node => node.sid === -1)
            );

            if (this.activeTab === 'domainGroup') {
                this.treeMenu.nodes = nodes.filter(node => {
                    const targetNode = this.selectedNodes[0];
                    // 부모 노드가 없고, 자신 및 자신의 부모가 동일하지 않을때
                    return (
                        parentDepth(node) === 0 &&
                        targetNode.key !== node.key &&
                        targetNode.parent !== node.key
                    );
                });
            } else this.treeMenu.nodes = nodes;

            this.treeMenu.active = !this.treeMenu.active;
        },

        // 도메인 그룹 윈도우 -> 추가 버튼
        async onClickNewDomainGroupBtn() {
            const name = this.addWindow.value;
            let placeholder = '';

            if (name.trim() === '') placeholder = this.i18n.M0075;
            else if (name.length > 20) placeholder = this.i18n.M0077;
            else if (validCheckName(name)) placeholder = this.i18n.M0148;

            if (placeholder === '') {
                const nodes = reloadTreeNodes(this.domainGroupTreeNodes);

                if (this.addWindow.isNew) {
                    const lastIndex = nodes.filter(node => node.parent === null)
                        .length;

                    nodes.push({
                        index: `${lastIndex}`,
                        sid: -1,
                        label: name,
                    });
                } else {
                    const targetNode = this.selectedNodes[0];
                    nodes[
                        nodes.findIndex(node => node.key === targetNode.key)
                    ].label = name;
                }

                this.resetSelectedNodes();
                await this.saveDomainGroupTree(nodes);
            }

            this.addWindow = {
                ...this.addWindow,
                value: '',
                active: placeholder !== '',
                placeholder: placeholder === '' ? this.i18n.M0075 : placeholder,
            };
        },

        //  트리 메뉴 -> 도메인 그룹 선택
        async onClickTreeNodeInTreeMenu(parentNode) {
            const nodes = [...this.domainGroupTreeNodes];

            if (this.activeTab === 'domainGroup') {
                const node = this.selectedNodes[0];
                nodes[nodes.findIndex(item => item.key === node.key)].parent =
                    parentNode.key;
            } else {
                this.selectedNodes.forEach(node => {
                    if (node.parent === null) {
                        nodes.push({
                            ...node,
                            key: `${node.sid}`,
                            parent: parentNode.key,
                        });
                    } else {
                        nodes[
                            nodes.findIndex(item => item.sid === node.sid)
                        ].parent = parentNode.key;
                    }
                });
            }

            this.resetSelectedNodes();
            await this.saveDomainGroupTree(reloadTreeNodes(nodes));
        },

        createTreeSelectorItem(sid, label, key, parent, icon) {
            return {
                key: key,
                label: label,
                fold: false,
                check: false,
                disable: false,
                icon: icon,
                parent: parent,
                sid,
            };
        },

        resetSelectedNodes() {
            // 선택된 노드 모두 삭제하기
            this.selectedNodes = [];
            this.selectedNodesCount += 1;

            // 도메인그룹 선택 메뉴 닫기
            this.treeMenu.active = false;
        },

        getSelectedNodeDepths() {
            const newNodes = reloadTreeNodes(
                this.domainGroupTreeNodes.filter(node => node.sid === -1)
            );

            const targetNode =
                newNodes[
                    newNodes.findIndex(
                        node => node.key === this.selectedNodes[0].key
                    )
                ];

            return {
                children: childrenDepth(targetNode),
                parent: parentDepth(targetNode),
            };
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.domain-group-window {
    @include themify($themes) {
        .main {
            > .top {
                display: flex;
                margin-bottom: 16px;
                > * {
                    display: inline-flex;
                    &.left {
                        flex: 1;
                    }
                    &.right {
                        flex: 1;
                        flex-direction: row-reverse;
                    }
                }
            }

            > .bottom {
                margin-top: 16px;
            }
        }
    }
}
</style>
