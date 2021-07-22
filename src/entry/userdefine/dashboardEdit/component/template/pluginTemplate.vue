<template>
    <div
        class="tool-plugin"
        data-tool-type="plugin"
        @mousedown="onMousedownComponent"
        :data-key="pluginOption.dataKey"
        :data-startx="pluginOption.startx"
        :data-endx="pluginOption.endx"
        :data-starty="pluginOption.starty"
        :data-endy="pluginOption.endy"
        :data-zindex="pluginOption.zIndex"
        :style="style"
    >
        <iframe @click.prevent.self :src="pluginOption.url"></iframe>

        <edit-component-template
            :data-key="pluginOption.dataKey"
            @onMousedownResizePoint="onMousedownResizePoint"
        >
        </edit-component-template>
    </div>
</template>

<script>
import EditComponentTemplate from '@entry/userdefine/dashboardEdit/component/template/editComponentTemplate'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
)

export default {
    name: 'iframeTemplate',
    components: { EditComponentTemplate },
    props: {
        pluginOption: {
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
            'setEditingPlugin',
            'setComponent',
            'removeComponent',
        ]),

        onMousedownComponent(event) {
            this.setEditingPlugin(this.pluginOption.dataKey)
            this.$emit('onMousedownComponent', event)
        },

        onMousedownResizePoint(emitData) {
            this.$emit('onMousedownResizePoint', emitData)
        },
    },
    computed: {
        style() {
            return {
                'z-index': this.pluginOption.zIndex,
                left: this.areaWidth * this.pluginOption.startx * 0.01 + 'px',
                top: this.areaHeight * this.pluginOption.starty * 0.01 + 'px',
                width:
                    this.areaWidth *
                        (this.pluginOption.endx - this.pluginOption.startx) *
                        0.01 +
                    'px',
                height:
                    this.areaHeight *
                        (this.pluginOption.endy - this.pluginOption.starty) *
                        0.01 +
                    'px',
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.tool-plugin {
    position: absolute;
    background-color: transparent;
    cursor: pointer;

    > iframe {
        z-index: -10;
        opacity: 0.5;
        margin: 4px;
        position: absolute;
        border: 0;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
    }
}
</style>
