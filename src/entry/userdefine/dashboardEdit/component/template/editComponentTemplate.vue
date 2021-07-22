<template>
    <div class="edit-block" :class="{active: isActiveComponent}">

            <div class="close-btn" @click="onClickRemoveComponent">
                <div class="new-icon-close"/>
            </div>

            <div class="edit-resize-point need-start-x-update need-start-y-update "
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.START_X_UPDATE, COMPONENT_RESIZE.START_Y_UPDATE])"
                 style="top: -3px; left: -3px; cursor: nwse-resize;"></div>
            <div class="edit-resize-point need-start-y-update "
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.START_Y_UPDATE])"
                 style="top: -3px; left: calc(50% - 3px); cursor: ns-resize;"></div>
            <div class="edit-resize-point need-start-y-update need-end-x-update "
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.END_X_UPDATE, COMPONENT_RESIZE.START_Y_UPDATE])"
                 style="top: -3px; left: calc(100% - 3px); cursor: nesw-resize;">

            </div>

            <div class="edit-resize-point need-start-x-update "
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.START_X_UPDATE])"
                 style="top: calc(50% - 3px); left: -3px; cursor: ew-resize;"></div>
            <div class="edit-resize-point need-end-x-update"
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.END_X_UPDATE])"
                 style="top: calc(50% - 3px); left: calc(100% - 3px); cursor: ew-resize;"></div>

            <div class="edit-resize-point need-start-x-update need-end-y-update"
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.START_X_UPDATE, COMPONENT_RESIZE.END_Y_UPDATE])"
                 style="top: calc(100% - 3px); left: -3px; cursor: nesw-resize;"></div>
            <div class="edit-resize-point need-end-y-update"
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.END_Y_UPDATE])"
                 style="top: calc(100% - 3px); left: calc(50% - 3px); cursor: ns-resize;"></div>
            <div class="edit-resize-point need-end-x-update need-end-y-update"
                 @mousedown.stop="onMousedownResizePoint($event, [COMPONENT_RESIZE.END_X_UPDATE, COMPONENT_RESIZE.END_Y_UPDATE])"
                 style="top: calc(100% - 3px); left: calc(100% - 3px); cursor: nwse-resize;"></div>
        </div>

</template>
<script>
    import { COMPONENT_RESIZE } from "@entry/userdefine/dashboardEdit/const";
    import { createNamespacedHelpers } from "vuex";

    const {mapGetters, mapState, mapMutations, mapActions} = createNamespacedHelpers("userdefine");

    export default {
        name: "editComponentTemplate",
        components: {  },
        props: {
            dataKey: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                COMPONENT_RESIZE: COMPONENT_RESIZE,
            }
        },
        methods: {
            ...mapActions([
                'emitRemoveComponent'
            ]),

            onMousedownResizePoint(event, directions) {
                event.stopPropagation();
                this.$emit("onMousedownResizePoint", {event: event, directions: directions});
            },

            onClickRemoveComponent() {
                this.emitRemoveComponent(this.dataKey);
                this.$emit('onRemoveComponent', this.dataKey);
            },
        },
        computed: {
            ...mapState([
                'editingComponentDataKey',
            ]),

            isActiveComponent() {
                return this.dataKey === this.editingComponentDataKey;
            },

        }
    };
</script>
<style lang="scss" scoped>
    @import '../themes.scss';

    .edit-block {
        margin: 3px;
        width: calc(100% - 8px);
        height: calc(100% - 8px);

        > div {
            display: none;
        }


        @include themify($themes) {
            border: dashed 1px themed('coponent-border-color');
        }

        &.active {
            > div {
                display: flex;
            }

            @include themify($themes) {
                border: solid 1px themed('coponent-active-border-color');
            }
        }

        .close-btn {
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            opacity: 0.6;
            border-radius: 3px;
            background: #8652ff;
            position: relative;
            z-index: 100;
            left: 7px;
            top: 7px;
            cursor: pointer;

            &:hover {
                opacity: 1;
            }

            .new-icon-close {
                width: 16px;
                height: 16px;

                background-size: cover;
                background-image: url('close.svg');
            }
        }

        .edit-resize-point {
            position: absolute;
            z-index: 90;
            width: 6px;
            height: 6px;
            background-color: #fff;
            border: 1px solid rgba(0,0,0,.2);
        }
    }
</style>