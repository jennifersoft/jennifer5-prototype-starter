<template>
    <div class="group-list" :style="{ 'max-height': `${height}px` }">
        <div
            class="group"
            v-for="(group, index) in groupedItems"
            v-if="group.children.length > 0 || group.domainList.length > 0"
        >
            <div class="top">
                {{ group.name }}
                <div class="icon">
                    <btn
                        class="border-none"
                        normal
                        :items="[
                            {
                                iconType: foldStatus[index]
                                    ? iconTypes.fold
                                    : iconTypes.open,
                            },
                        ]"
                        @click="onClickToggleIcon(index)"
                    ></btn>
                </div>
            </div>
            <div class="bottom" v-if="!foldStatus[index]">
                <div class="root">
                    <domain-list-in-group
                        :items="group.domainList"
                        @change="onCheckDomain"
                    ></domain-list-in-group>
                </div>
                <div class="children" v-if="group.children.length > 0">
                    <div
                        class="child-group"
                        v-for="childGroup in group.children"
                        v-if="childGroup.domainList.length > 0"
                    >
                        <div class="title">{{ childGroup.name }}</div>
                        <domain-list-in-group
                            :items="childGroup.domainList"
                            @change="onCheckDomain"
                        ></domain-list-in-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import DomainListInGroup from './DomainListInGroup';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        DomainListInGroup,
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    computed: {
        groupedItems() {
            const rootMap = {};
            const rootList = this.items
                .filter(item => item.parent === null)
                .map(item => {
                    const node = this.createGroupItem(
                        item.simpleName,
                        item.domainList
                    );
                    rootMap[item.key] = node;
                    return node;
                });

            this.items.forEach(item => {
                if (item.isUnknown) {
                    rootList.push(
                        this.createGroupItem(
                            this.i18n.unknownGroup,
                            item.domainList
                        )
                    );
                } else {
                    if (item.parent !== null) {
                        rootMap[item.parent].children.push(
                            this.createGroupItem(
                                item.simpleName,
                                item.domainList
                            )
                        );
                    }
                }
            });

            return rootList;
        },
    },
    data() {
        return {
            domainMap: new Map(),
            foldStatus: [],
            iconTypes: {
                open: ICON_TYPE.arrowUp,
                fold: ICON_TYPE.arrowDown,
            },
        };
    },
    watch: {
        items() {
            this.domainMap = new Map();
            this.initializeFoldStatus();
        },
    },
    methods: {
        onClickToggleIcon(index) {
            this.$set(this.foldStatus, index, !this.foldStatus[index]);
        },
        onCheckDomain(domain, event) {
            const checkedDomains = [];

            this.domainMap.set(domain.sid, {
                checked: event.target.checked,
                domain: domain,
            });

            this.domainMap.forEach(item => {
                if (item.checked) checkedDomains.push(item.domain);
            });

            this.$emit('change', checkedDomains);
        },
        createGroupItem(name, domainList) {
            return {
                name: name,
                domainList: domainList,
                children: [],
            };
        },
        initializeFoldStatus() {
            this.foldStatus = [];
            this.items
                .filter(item => item.parent === null)
                .forEach(() => {
                    this.foldStatus.push(false);
                });
        },
    },
    created() {
        this.initializeFoldStatus();
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';
.group-list {
    $box-padding: 11px 15px;

    @include themify($themes) {
        overflow-y: auto;
        font-size: 12px;
        color: themed('common-message-font-color');

        > .group {
            margin-bottom: 8px;
            border-radius: 3px;
            border: 1px solid themed('common-border-color');

            > .top {
                position: relative;
                padding: $box-padding;
                > .icon {
                    position: absolute;
                    right: 2px;
                    top: 2px;
                }
            }
            > .bottom {
                display: flex;
                border-top: 1px solid themed('common-border-color');

                > * {
                    flex: 1;
                    &.root {
                        padding: $box-padding;
                    }
                    &.children {
                        border-left: 1px solid themed('common-border-color');

                        > .child-group {
                            &:not(:first-child) {
                                border-top: 1px solid
                                    themed('common-border-color');
                            }
                            padding: $box-padding;

                            > .title {
                                margin-bottom: 8px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
