<template>
    <div
        class="domain-group-selector"
        :class="{ 'vertically-aligned': verticallyAligned }"
    >
        <transition-group name="fade" tag="div">
            <div
                v-for="(t, i) in treesToRender"
                :key="getRefString(i) + t.label"
                class="three-depth-box"
            >
                <img src="//:0" alt="arrow-step" class="step-arrow" />
                <Breadcrumb
                    :ref="getRefString(i)"
                    :domain-group="t.tree"
                    :selected-one="t.selectedOne"
                    @click.native="close(getRefString(i))"
                    @elementSelected="data => elementSelectHandler(data)"
                />
            </div>
        </transition-group>
    </div>
</template>

<script>
import {
    getAllParents,
    getDepth,
    getAllSiblings,
} from '../../resource/tree/treeAction.js';
import Breadcrumb from './Breadcrumb.vue';
export default {
    components: {
        Breadcrumb,
    },
    props: {
        domainGroupTree: {
            type: Array,
            required: true,
        },
        selectedOne: {
            type: Object,
            default() {
                return {};
            },
        },
        verticallyAligned: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        treesToRender() {
            if (!this.domainGroupTree.length) {
                return [];
            }
            const parents = getAllParents(
                this.selectedOne.treeIndex,
                this.domainGroupTree
            );
            const parentsWitdhElement = parents.concat(this.selectedOne);

            const rootToRender = {
                tree: this.domainGroupTree,
                selectedOne: parentsWitdhElement[0],
            };

            return [rootToRender].concat(
                parentsWitdhElement.slice(1).map(selectedOne => {
                    const tree = getAllSiblings(
                        selectedOne.treeIndex,
                        this.domainGroupTree
                    );

                    return {
                        tree,
                        selectedOne,
                    };
                })
            );
        },
    },
    methods: {
        getRefString(i) {
            return `breadcrumb-#${i}`;
        },
        elementSelectHandler(element) {
            this.$emit('elementSelected', element);
        },
        close(exceptRef) {
            [0, 1, 2]
                .map(i => this.getRefString(i))
                .forEach(ref => {
                    if (exceptRef === ref) {
                        return;
                    }
                    if (this.$refs[ref] && this.$refs[ref][0]) {
                        this.$refs[ref][0].close();
                    }
                });
        },
        select(treeIndex) {
            const element = this.domainGroupTree.find(
                d => d.treeIndex === treeIndex
            );
            return this.elementSelectHandler(element);
        },
        getDepth,
        getAllSiblings,
    },
};
</script>

<style lang="scss" scoped>
@import './var';

@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        box-border-color: #dadada,
        --arrow-svg-path: './assets/breadcrumb-arrow-classic.svg',
        --arrow-vertical-svg-path: './assets/hierarchy-classic.svg',
    ),
    dark: (
        box-border-color: #4e4e4e,
        --arrow-svg-path: './assets/breadcrumb-arrow-dark.svg',
        --arrow-vertical-svg-path: './assets/hierarchy-dark.svg',
    ),
);

.domain-group-selector {
    @include themify($themes) {
        font-size: 0;
        white-space: nowrap;
        display: inline-block;

        > div {
            display: flex;
            flex-direction: row;

            > .three-depth-box {
                display: flex;
                flex-direction: row;

                > .step-arrow {
                    display: none;
                    padding: 3px;
                    content: url(themed('--arrow-svg-path'));
                }
            }

            .three-depth-box + .three-depth-box {
                .step-arrow {
                    display: inherit;
                }
            }
        }

        &.vertically-aligned {
            width: 100%;
            max-width: 248px;
            display: block;

            > div {
                flex-direction: column;

                .three-depth-box {
                    margin: 2px 0;

                    > .step-arrow {
                        width: 12px;
                        height: 13px;
                        content: url(themed('--arrow-vertical-svg-path'));
                    }

                    &:nth-child(2) {
                        ::v-deep .breadcrumb-row-label {
                            max-width: 168px;
                        }
                    }

                    &:nth-child(3) {
                        margin-left: 18px;

                        ::v-deep .breadcrumb-row-label {
                            max-width: 150px;
                        }
                    }
                }

                ::v-deep .breadcrumb {
                    flex-grow: 1;
                    border-radius: 3px;
                    border: solid 1px themed('box-border-color');

                    > .breadcrumb-badge {
                        border-radius: inherit;
                        width: 100%;
                        max-width: none;
                    }

                    .depth-tree {
                        right: 0;
                        left: auto;

                        .submenu {
                            right: 100%;
                            left: auto;
                        }

                        .menu-row {
                            .breadcrumb-row {
                                min-width: 210px;
                                max-width: 210px;
                            }

                            .children-arrow {
                            }
                        }
                    }
                }
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: 0.2s ease;
    transition-property: opacity, transform;
    transform-origin: left;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-3px) scaleX(0.9);
}
</style>
