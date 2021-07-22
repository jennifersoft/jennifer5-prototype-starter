<template>
    <div class="toolComponent tool-text"
        data-tool-type="textbox"
         @mousedown="onMousedownComponent"
         @click.prevent.self
        :data-key="textOption.dataKey"
         :data-startx="textOption.startx"
         :data-endx="textOption.endx"
         :data-starty="textOption.starty"
         :data-endy="textOption.endy"
         :data-zindex="textOption.zIndex"

         :style="style"
        >
		<span contenteditable="true" @focusout="changeTextWhenFocusout" :style="spanStyle">{{textOption.content}}</span>

        <edit-component-template
                :data-key="textOption.dataKey"
                @onMousedownResizePoint="onMousedownResizePoint"
        >
        </edit-component-template>
    </div>
</template>

<script>
    import EditComponentTemplate from "@entry/userdefine/dashboardEdit/component/template/editComponentTemplate";
    import { createNamespacedHelpers } from "vuex";
    const {mapGetters, mapState, mapMutations} = createNamespacedHelpers("userdefine");

    export default {
        name: "textTemplate",
        components: { EditComponentTemplate },
        props: {
            textOption: {
                type: Object,
                required: true,
            },
            areaHeight: {
                type: Number,
                required: true,
            },
            areaWidth: {
                type: Number,
                required: true,
            },
        },
        methods: {
            ...mapMutations([
                'setEditingTextbox',
                'setContentOnTextbox',
                'setComponent',
                'removeComponent',
            ]),

            onMousedownComponent(event) {
                this.setEditingTextbox(this.textOption.dataKey);
                this.$emit("onMousedownComponent", event);
            },

            onMousedownResizePoint(emitData) {
                this.$emit("onMousedownResizePoint", emitData);
            },

            changeTextWhenFocusout(e) {
                this.setContentOnTextbox(e.target.innerText);
                this.setComponent(this.editingTextOptions);
            },
        },
        computed: {
            ...mapState([
                'editingTextOptions',
                'editingComponentDataKey',
            ]),

            style() {
                return {
                    'z-index': this.textOption.zIndex,
                    'left': (this.areaWidth * this.textOption.startx * 0.01) + 'px',
                    'top': (this.areaHeight * this.textOption.starty * 0.01) + 'px',
                    'width': (this.areaWidth * (this.textOption.endx - this.textOption.startx) * 0.01) + 'px',
                    'height': (this.areaHeight * (this.textOption.endy - this.textOption.starty) * 0.01) + 'px',
                };
            },

            spanStyle() {
                return {
                    'color': this.textOption.color,
                    'font-size': this.textOption.fontSize + "px",
                    'text-align': this.textOption.textAlign,
                    'align-self': this.textOption.textVerticalAlign,
                }
            }

        },
    };
</script>
<style lang="scss" scoped>
    .tool-text {
        position: absolute;
        background-color: transparent;
        cursor: pointer;
        display: flex;

        > span {
            position: absolute;
            z-index: 10;
            width: calc(100% - 8px);
            left: 4px;
            cursor: text;
            border-radius: 2px;
            @import '~@vuejs/component/themes.scss';
            @include themify($themes) {

                &:hover {
                    box-shadow: 0 0 0 1px themed('border-color');
                }
                &:focus {
                    box-shadow: 0 0 0 1px themed('background-color-purple');
                    outline: none;
                }
            }
        }
    }
</style>