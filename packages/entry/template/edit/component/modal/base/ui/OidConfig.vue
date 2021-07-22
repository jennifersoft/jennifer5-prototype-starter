<template>
    <div class="oid-config" :style="rootSize">
        <resource-selector
            @row-selected="onSelectResourceNode"
            @row-unselected="onUnselectResourceNode"
            @tab-change="onChangeResourceTab"
            @resource-change="onChangeResourceNode"
            :tab="activeResourceTab"
            :no-border="false"
            :selectable="checkManualDomain"
            :checkable="checkManualDomain"
            :no-all-check="true"
            :resources="newResourceList"
        ></resource-selector>
        <div class="prevent-layer" v-if="!checkManualDomain"></div>
    </div>
</template>
<script>
import ResourceSelector from '@vuejs/component/Resource/ResourceSelector/ResourceSelector';

const resourcesIndex = { domain: 0, instance: 1, business: 2 };

export default {
    components: {
        ResourceSelector,
    },
    props: {
        width: {
            type: Number,
            required: false,
            default: 250,
        },
        height: {
            type: Number,
            required: false,
            default: 235,
        },
        resourceTab: {
            type: String,
            required: false,
            default: 'domain',
        },
        resourceList: {
            type: Array,
            required: true,
        },
        resourceMultiSelect: {
            type: Boolean,
            required: false,
            default: false,
        },
        allowResourceTabs: {
            type: Array,
            required: false,
            default: () => ['domain', 'instance', 'business'],
        },
        checkManualDomain: {
            type: Boolean,
            required: false,
            default: false,
        },
        activeGroupData: {
            type: String,
            required: false,
            default: '',
        },
    },
    computed: {
        rootSize() {
            return {
                width: `${this.width}px`,
                height: `${this.height}px`,
            };
        },
        newResourceList() {
            const groupData = this.activeGroupData
                ? JSON.parse(this.activeGroupData)
                : {};

            // Domain과 Business를 사용하지 않는 설정 화면이 있음 (Disk, ...)
            return this.resourceList
                .filter(resource => {
                    return this.allowResourceTabs.includes(
                        resource.resourceType
                    );
                })
                .map(resource => {
                    return {
                        resourceType: resource.resourceType,
                        tree: resource.tree.map(node => {
                            // domain 탭일 경우, oid가 0으로 저장되는데, 실제 데이터는 -1이므로 보정해줘야 한다.
                            const isActive =
                                groupData &&
                                groupData[node.data.sid] &&
                                groupData[node.data.sid].includes(
                                    node.data.oid === -1 ? 0 : node.data.oid
                                );

                            if (this.resourceMultiSelect) {
                                delete node.selected;
                                if (this.checkManualDomain)
                                    node.check = isActive ? 'on' : 'off';
                                else node.check = 'on';
                            } else {
                                delete node.check;
                                node.selected = isActive;
                            }

                            return node;
                        }),
                    };
                });
        },
    },
    watch: {
        // 대상설정 컴포넌트의 선택 탭은 데이터로 일임하기 때문에 props가 변경되도 반응하지 않음.
        // 그렇기 때문에 watch를 설정해서 변경해줘야 함.
        // ID가 동일한 컴포넌트를 열었을 경우, 반응하지 않기 때문에 추가했음.
        resourceTab(newVal, oldVal) {
            if (newVal == oldVal) return;
            this.activeResourceTab = newVal;
        },
    },
    data() {
        return {
            activeResourceTab: this.resourceTab,
        };
    },
    methods: {
        onSelectResourceNode(node) {
            if (this.checkManualDomain) {
                const tab = this.activeResourceTab;
                const groupData = {};
                groupData[node.sid] = [tab === 'domain' ? 0 : node.oid];

                this.$emit('change-resource', JSON.stringify(groupData), node);
            }
        },
        onUnselectResourceNode() {
            this.$emit('change-resource', '', null);
        },
        onChangeResourceTab(tab) {
            if (this.allowResourceTabs.includes(tab)) {
                this.activeResourceTab = tab;
                this.$emit('change-tab', tab);
            }
        },
        onChangeResourceNode({ tree }) {
            if (this.checkManualDomain) {
                this.$emit('change-resource', this.getGroupData(tree), tree);
            }
        },
        getGroupData(newTree) {
            const tab = this.activeResourceTab;
            const tree = !newTree
                ? this.newResourceList[resourcesIndex[tab]].tree
                : newTree;
            const grouped = {};

            const checked = tree.filter(t => {
                if (tab === 'domain') {
                    return t.check === 'on';
                }
                return t.data.oid !== -1 && t.check === 'on';
            });

            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);
            sids.forEach(s => {
                grouped[s] = [];
            });

            checked.forEach(c => {
                grouped[c.data.sid] = [];
            });
            checked.forEach(c => {
                let id = c.data.oid;
                if (tab === 'domain') {
                    id = 0;
                }
                if (grouped.hasOwnProperty(c.data.sid)) {
                    grouped[c.data.sid].push(id);
                } else {
                    grouped[c.data.sid] = [id];
                }
            });

            return JSON.stringify(grouped);
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../../../../themes';
.oid-config {
    @include themify($themes) {
        position: relative;
        display: inline-block;

        > .prevent-layer {
            position: absolute;
            display: inline-block;
            width: 100%;
            height: calc(100% - 35px);
            z-index: 1;
            top: 35px;
            left: 0px;
            opacity: 0.05;
            background-color: themed(
                'oid-config-prevent-layer-background-color'
            );
        }
    }
}
</style>
