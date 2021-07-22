<template>
    <div ref="r" class="domain-popup-button" :class="[{ open }]">
        <div class="button-contents" @click="popupToggleHandler">
            <div
                v-for="(r, i) of resourcesToRender"
                :key="r.label"
                class="domain-depth"
            >
                <img v-if="i > 0" src="//:0" class="step-image" />
                <Icon :resource-type="r.resourceType" />
                <span class="resource-name">{{ r.label }}</span>
            </div>
        </div>

        <Transition name="fadeLeft">
            <div v-if="open" ref="popup" class="domain-group-popup">
                <DomainGroupSelector
                    :domain-group-tree="domainGroupTree"
                    :selected-one="selectedOne"
                    @elementSelected="domainGroupSelectHandler"
                />
            </div>
        </Transition>
    </div>
</template>

<script>
import DomainGroupSelector from '../DomainGroupSelector/DomainGroupSelector.vue';
import Icon from '@vuejs/component/Resource/Icon/ResourceIcon.vue';
import { getAllParents } from '@vuejs/component/Resource/Tree/treeAction.js';

export default {
    components: {
        DomainGroupSelector,
        Icon,
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
    },
    data() {
        return {
            open: false,
            openX: 0,
            openY: 0,
            popupWidth: 500,
            popupHeight: 100,
        };
    },
    computed: {
        resourcesToRender() {
            const parents = getAllParents(
                this.selectedOne.treeIndex,
                this.domainGroupTree
            );
            const toRender = parents.concat(this.selectedOne);

            return toRender;
        },
    },
    mounted() {
        this.updateButtonXY();
    },
    methods: {
        select(treeIndex) {
            this.$emit(
                'elementSelected',
                this.domainGroupTree.find(d => d.treeIndex === treeIndex)
            );
        },
        popupToggleHandler() {
            this.open = !this.open;
        },
        updateButtonXY() {
            const btn = this.$refs.r;
            this.openX = 0 - this.popupWidth - 20;
            this.openY = btn.offsetHeight / 2 - this.popupHeight / 2;
        },
        domainGroupSelectHandler(e) {
            this.$emit('elementSelected', e);
            setTimeout(() => {
                this.open = false;
            }, 200);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        bg-color: #fff,
        bg-color-hover: #fafafa,
        border-color: rgba(0, 0, 0, 0.1),
        label-color: #333333,
        --step-svg-path: './assets/step-classic.svg',
    ),
    dark: (
        bg-color: #1c1c1c,
        bg-color-hover: #2e2e2e,
        border-color: #4d4d4d,
        label-color: #d5d5d5,
        --step-svg-path: './assets/step-dark.svg',
    ),
);
.domain-popup-button {
    @include themify($themes) {

        user-select: none;
        font-size: 0;
        position: relative;
        width: 235px;
        height: 82px;
        box-sizing: border-box;
        cursor: pointer;
        transition: background-color 0.2s ease;
        border-radius: 3px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        border: solid 1px themed('border-color');
        background-color: themed('bg-color');

        &:hover,
        &.open {
            background-color: themed('bg-color-hover');
        }

        > .button-contents {
            width: 100%;
            height: 100%;
            padding-left: 13px;
            padding-right: 18px;
            box-sizing: border-box;

            display: flex;
            justify-content: center;
            flex-direction: column;

            > .domain-depth {
                height: 22px;
                display: flex;
                align-items: center;
                flex: initial;

                $indent-width: 11px;

                &:nth-of-type(2) {
                    margin-left: $indent-width;
                }

                &:nth-of-type(3) {
                    margin-left: $indent-width * 2;
                }

                > .step-image {
                    position: relative;
                    left: -7px;
                    top: -1px;
                    content: url(themed('--step-svg-path'));
                }

                > .resource-name {
                    font-size: 12px;
                    line-height: 1.67;
                    color: themed('label-color');
                    margin-left: 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }

        .domain-group-popup {
            z-index: 10;
            padding: 0 10px;
            position: absolute;
            height: 100%;
            top: 18px;
            right: 103%;
            min-width: 320px;
            height: 40px;
            display: flex;
            align-items: center;

            transition: 0.2s ease;
            transition-property: opacity, transform;
            border-radius: 3px;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
            border: solid 1px themed('border-color');
            background-color: themed('bg-color');
        }
    }
}

.fadeLeft-enter,
.fadeLeft-leave-to {
    opacity: 0;
    transform: translateX(10px);
}
</style>
