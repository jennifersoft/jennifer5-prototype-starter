<template>
    <div class="popup-and-button-wrapper" v-click-outside="close">
        <button
            ref="popup-button"
            class="jui-ish-button"
            @click="buttonClickHandler"
        >
            {{ i18n.targetConfig }}:
            <Icon
                style-override="position: relative; top:3px;"
                :resource-type="selectedResourceType"
            />
            {{ selectedResourceText }}
        </button>
        <window
            v-if="open"
            :messages="messagesForWindow"
            :open-x="openX"
            :open-y="openY"
            :open-w="prettyWidth"
            :animation-name="'fade-down'"
            @apply="submitHandler"
            @cancel="cancelHandler"
        >
            <template #subject>
                <span>{{ i18n.targetConfig }}</span>
            </template>
            <div class="popup-window-container">
                <resource-selector
                    :tab="currentTab"
                    :resources="currentResources"
                    :no-border="false"
                    :show-resource-type-tab="false"
                    @tab-change="tabChangeHandler"
                    @resource-change="resourceChangeHandler"
                />
            </div>
        </window>
    </div>
</template>

<script>
import ResourceSelector, {
    capitalizeFirstLetter,
} from '@vuejs/component/resource/resourceSelector/ResourceSelector.vue';
import Window from '@vuejs/component/window/Window';
import Icon from '@vuejs/component/resource/icon/ResourceIcon';
import clickOutside from '@vuejs/directive/clickOutside';

export default {
    inject: {
        i18n: {
            default: {
                targetConfig: 'Select targets',
                cancel: 'Cancel',
                submit: 'Finish',
            },
        },
    },
    components: {
        ResourceSelector,
        Window,
        Icon,
    },
    directives: {
        clickOutside,
    },
    props: {
        resources: {
            type: Array,
            required: true,
        },
        popupPositionLeft: {
            type: Boolean,
            default: false,
        },
        defaultSelectedResourceIndex: {
            type: Number,
            default: 0,
            validator(v) {
                return v >= 0 || v < this.resources.length;
            },
        },
    },
    data() {
        return {
            open: false,
            openX: 0,
            openY: 0,

            currentTab: this.resources[this.defaultSelectedResourceIndex]
                .resourceType,
            selectedResourceType: this.resources[
                this.defaultSelectedResourceIndex
            ].resourceType,

            currentResources: Array.from(this.resources),
            selectedResources: Array.from(this.resources),
        };
    },
    computed: {
        prettyWidth() {
            if (this.resources.length === 2) {
                return 324;
            } else {
                return 350;
            }
        },
        messagesForWindow() {
            return {
                apply: this.i18n.submit,
                cancel: this.i18n.cancel,
            };
        },
        selectedResourceText() {
            return capitalizeFirstLetter(this.selectedResourceType);
        },
    },
    watch: {
        resources(newResources) {
            this.currentTab =
                newResources[this.defaultSelectedResourceIndex].resourceType;
            this.selectedResourceType =
                newResources[this.defaultSelectedResourceIndex].resourceType;

            this.currentResources = Array.from(newResources);
            this.selectedResources = Array.from(newResources);

            this.submitHandler();
        },
    },
    mounted() {
        this.updateButtonXY();
    },
    methods: {
        updateButtonXY() {
            const { top, height, left, width } = this.$refs[
                'popup-button'
            ].getBoundingClientRect();
            this.openY = top + height + 8;
            if (this.popupPositionLeft) {
                this.openX = left;
            } else {
                this.openX = left - this.prettyWidth + width;
            }
        },
        buttonClickHandler() {
            if (!this.open) {
                this.updateButtonXY();
            }
            this.open = !this.open;
            this.$emit('buttonClick', this.open);
        },
        cancelHandler() {
            this.open = false;
            setTimeout(() => {
                this.currentTab = this.selectedResourceType;
                this.currentResources = Array.from(this.selectedResources);
            }, 150);
        },
        submitHandler() {
            this.open = false;
            this.selectedResourceType = this.currentTab;
            this.selectedResources = Array.from(this.currentResources);

            this.$emit('submit', {
                resourceType: this.selectedResourceType,
                tree: this.selectedResources
                    .find(r => r.resourceType === this.selectedResourceType)
                    .tree.filter(t => t.check === 'on'),
            });
        },
        tabChangeHandler(tab) {
            this.currentTab = tab;
            this.resourceChangeHandler({
                resourceType: tab,
                tree: this.currentResources.find(
                    ({ resourceType }) => resourceType === tab
                ).tree,
            });
        },
        resourceChangeHandler({ resourceType, tree }) {
            this.currentTab = resourceType;
            const index = this.currentResources.findIndex(
                r => r.resourceType === resourceType
            );
            this.$set(this.currentResources, index, {
                ...this.currentResources[index],
                tree,
            });
        },
        close() {
            if (this.open) this.open = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.popup-and-button-wrapper {
    display: inline-block;
}
.popup-window-container {
    box-sizing: border-box;
    width: 100%;
    height: 250px;
    position: relative;
    font-size: 0;
}

@import '~@vuejs/component/resource/style/button-style.scss';
.jui-ish-button {
    @include button-style;
}
</style>
