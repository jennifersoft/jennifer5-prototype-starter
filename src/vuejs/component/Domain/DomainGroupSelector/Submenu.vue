<template>
    <div ref="submenu-container" class="submenu-container">
        <div
            v-if="isOverflowed && isUpable"
            class="arrow up"
            :class="{ isUpable }"
            @click="cursorUp"
            @mouseenter="
                isHoveringUp = true;
                cursorUp();
            "
            @mouseleave="stopCursormove"
        >
            <img class="carrot"
                 src="//:0"
                 alt="arrow-carrot" />
        </div>
        <div
            v-for="(d, i) in domainGroupVisible"
            :key="`${d.label}-${i}`"
            class="menu-row"
        >
            <Row
                :no-interaction="d.noInteraction"
                :resource-type="d.resourceType"
                :label="d.label"
                :has-children="hasChildren(d.treeIndex, domainGroup)"
                @elementSelected="$emit('elementSelected', d)"
            >
                <div
                    v-if="hasChildren(d.treeIndex, domainGroup)"
                    class="submenu"
                    :class="{
                        overflowed:
                            getAllChildren(d.treeIndex, domainGroup).length >
                            MAX_VISIBLE_ROWS_IN_PAGE,
                    }"
                >
                    <Submenu
                        :domain-group="getAllChildren(d.treeIndex, domainGroup)"
                        @elementSelected="
                            element => $emit('elementSelected', element)
                        "
                    />
                </div>
            </Row>
        </div>
        <div
            v-if="isOverflowed && isDownable"
            class="arrow down"
            @mouseenter="
                isHoveringDown = true;
                cursorDown();
            "
            @mouseleave="stopCursormove"
        >
            <img class="carrot" src="//:0" />
        </div>
    </div>
</template>

<script>
import {
    hasChildren,
    getAllChildren,
    getDepth,
} from '../../Resource/Tree/treeAction.js';
import Row from './Row.vue';
import _ from '@library/lodash';

const CURSOR_MOVE_STEP = 1;
const CURSOR_MOVING_TIME_INTERVAL = 70;

export default {
    inject: {
        MAX_VISIBLE_ROWS_IN_PAGE: {
            default: 15,
        },
    },
    name: 'Submenu',
    components: {
        Row,
    },
    props: {
        domainGroup: {
            required: true,
            type: Array,
            validator(d) {
                return d.length > 0;
            },
        },
        selectedOne: {
            default() {
                return this.domainGroup[0];
            },
            type: Object,
        },
    },
    data() {
        return {
            open: true,
            pageCursorIndex: 0,
            cursorMoveSchedular: null,
            isHoveringDown: false,
            isHoveringUp: false,
            CURSOR_MOVE_STEP,
            CURSOR_MOVING_TIME_INTERVAL,
        };
    },
    computed: {
        visibleRowsInList() {
            if (this.isUpable && this.isDownable) {
                return this.MAX_VISIBLE_ROWS_IN_PAGE - 1;
            }
            return this.MAX_VISIBLE_ROWS_IN_PAGE;
        },
        currentDepthRows() {
            return this.domainGroup.filter(
                d =>
                    getDepth(d.treeIndex) ===
                    getDepth(this.selectedOne.treeIndex)
            );
        },
        isOverflowed() {
            return this.currentDepthRows.length > this.MAX_VISIBLE_ROWS_IN_PAGE;
        },
        isDownable() {
            const domainGroupLength = this.currentDepthRows.length;
            return (
                this.pageCursorIndex +
                    this.CURSOR_MOVE_STEP +
                    this.MAX_VISIBLE_ROWS_IN_PAGE <=
                domainGroupLength
            );
        },
        isUpable() {
            return this.pageCursorIndex + 1 - this.CURSOR_MOVE_STEP > 0;
        },
        domainGroupVisible() {
            return this.currentDepthRows.slice(
                this.pageCursorIndex,
                this.pageCursorIndex + this.visibleRowsInList
            );
        },
    },
    mounted() {
        this.$refs['submenu-container'].onwheel = _.throttle(e => {
            if (e.deltaY > 0) {
                this.cursorDown();
                return;
            }
            if (e.deltaY < 0) {
                this.cursorUp();
                return;
            }
        }, this.CURSOR_MOVING_TIME_INTERVAL);
    },
    methods: {
        stopCursormove() {
            clearTimeout(this.cursorMoveSchedular);
            this.isHoveringDown = false;
            this.isHoveringUp = false;
        },
        cursorDown() {
            if (!this.isDownable) {
                return;
            }

            this.pageCursorIndex += this.CURSOR_MOVE_STEP;

            if (!this.isHoveringDown) {
                return;
            }
            this.cursorMoveSchedular = setTimeout(() => {
                this.cursorDown();
            }, this.CURSOR_MOVING_TIME_INTERVAL);
        },
        cursorUp() {
            if (!this.isUpable) {
                return;
            }
            this.pageCursorIndex -= this.CURSOR_MOVE_STEP;

            if (!this.isHoveringUp) {
                return;
            }
            this.cursorMoveSchedular = setTimeout(() => {
                this.cursorUp();
            }, this.CURSOR_MOVING_TIME_INTERVAL);
        },
        hasChildren,
        getAllChildren,
        getDepth,
    },
};
</script>

<style lang="scss" scoped>
@import './var';
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        bg-color: #ffffff,
        border-color: transparent,
        arrow-color-hover: #f5f5f5,
        --arrow-svg-path: './assets/arrow-right-classic.svg',
    ),
    dark: (
        bg-color: #1c1c1c,
        border-color: #404040,
        arrow-color-hover: #2e2e2e,
        --arrow-svg-path: './assets/arrow-right-dark.svg',
    ),
);

.submenu-container {
    @include themify($themes) {
        min-width: $breadcrumb-min-width;
        width: auto;
        max-width: $breadcrumb-max-width;
        border-radius: 4px;
        background-color: themed('bg-color');
        border: 1px solid themed('border-color');
        box-shadow: 0 3px 14px 0 rgba(0, 0, 0, 0.15),
            0 5px 5px -3px rgba(0, 0, 0, 0.2);
        padding: 2px;
        position: relative;
        > .menu-row {
            position: relative;
            display: block;

            .submenu {
                z-index: 99;
                position: absolute;
                top: -2px;
                left: 100%;
                pointer-events: none;
                opacity: 0;
                transition: 0.2s ease;
                transform: translateX(-5px) scaleX(0.95);
                transition-property: opacity, transform;
                transform-origin: top left;
            }
        }
        > .menu-row:hover > * > .submenu {
            pointer-events: inherit;
            opacity: 1;
            transform: translateX(0) scaleX(1);
            z-index: 100;
        }

        > .arrow {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            height: 24px;
            margin: -2px;
            $padding-fit-to-row: 2px;

            &:hover {
                background-color: themed('arrow-color-hover');
            }

            > .carrot {
                content: url(themed('--arrow-svg-path'));
            }

            &.up {
                margin-bottom: 0;
                padding-bottom: $padding-fit-to-row;
                .carrot {
                    transform: rotate(270deg);
                }
            }

            &.down {
                margin-top: 0;
                padding-top: $padding-fit-to-row;
                .carrot {
                    transform: rotate(90deg);
                }
            }
        }
    }
}
</style>
