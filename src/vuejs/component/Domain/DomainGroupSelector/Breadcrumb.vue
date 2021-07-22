<template>
    <div class="breadcrumb">
        <div
            v-click-outside="clickAwayHandler"
            class="breadcrumb-badge"
            @click="openHandler"
        >
            <Icon :resource-type="selectedOneToRender.resourceType" />
            <span class="breadcrumb-row-label">{{
                selectedOneToRender.label
            }}</span>
            <img
                v-if="hasMoreToShow"
                class="breadcrumb-arrow"
                src="//:0"
                alt="arrow-more"
            />
        </div>
        <div class="depth-tree" :class="{ active: open }">
            <Submenu
                :is-root="true"
                :domain-group="domainGroup"
                @elementSelected="elementSelectHandler"
            />
        </div>
    </div>
</template>

<script>
import clickOutside from '@vuejs/directive/clickOutside';
import { hasChildren } from '../../Resource/Tree/treeAction.js';
import Icon from '../../Resource/Icon/ResourceIcon.vue';
import Submenu from './Submenu.vue';

export default {
    directives: {
        clickOutside,
    },
    components: {
        Icon,
        Submenu,
    },
    props: {
        domainGroup: {
            required: true,
            type: Array,
        },
        selectedOne: {
            default: false,
            type: [Object, Boolean],
        },
    },
    data() {
        return {
            open: false,
        };
    },
    computed: {
        selectedOneToRender() {
            return this.selectedOne || this.domainGroup[0];
        },
        hasMoreToShow() {
            return this.domainGroup.length !== 1;
        },
    },
    methods: {
        close() {
            this.open = false;
        },
        elementSelectHandler(element) {
            this.close();
            this.$emit('elementSelected', element);
        },
        openHandler() {
            if (!this.hasMoreToShow) {
                return;
            }
            this.open = !this.open;
        },
        clickAwayHandler() {
            this.close();
        },
        hasChildren,
    },
};
</script>

<style lang="scss" scoped>
@import './var';
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        bg-color-hover: rgba(0, 0, 0, 0.05),
        label-color: #333333,
        --arrow-svg-path: './assets/arrow-right-classic.svg',
    ),
    dark: (
        bg-color-hover: rgba(255, 255, 255, 0.05),
        label-color: #d5d5d5,
        --arrow-svg-path: './assets/arrow-right-dark.svg',
    ),
);

.breadcrumb {
    display: inline-block;
    position: relative;
    user-select: none;

    > .breadcrumb-badge {
        @include themify($themes) {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;

            min-width: $breadcrumb-min-width;
            width: auto;
            max-width: $breadcrumb-max-width;
            height: 28px;
            border-radius: 3px;

            padding: 5px 32px 5px 8px;

            background-color: transparent;
            transition: background-color 0.2s ease;

            &:hover {
                background-color: themed('bg-color-hover');
            }

            > .breadcrumb-row-label {
                -webkit-font-smoothing: antialiased;
                font-size: 12px;
                margin-left: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: themed('label-color');
                width: 100%;
            }

            > .breadcrumb-arrow {
                position: absolute;
                right: 10px;
                transform: rotate(90deg);
                content: url(themed('--arrow-svg-path'));
            }
        }
    }

    .depth-tree {
        position: absolute;
        top: 105%;
        left: 0;
        pointer-events: none;
        opacity: 0;
        transition: 0.1s ease;
        transition-property: opacity, transform;
        transform: translateY(-2px);

        z-index: 1000;
    }
    .depth-tree.active {
        pointer-events: inherit;
        opacity: 1;
        display: inline-block;
        transform: translateY(0);
    }
}

.child-tree {
    position: absolute;
    top: 100%;
    left: 100%;
}
</style>