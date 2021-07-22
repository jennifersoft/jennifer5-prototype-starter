<template>
    <div
        class="tool-iframe"
        data-tool-type="iframe"
        @mousedown="onMousedownComponent"
        :data-key="iframeOption.dataKey"
        :data-startx="iframeOption.startx"
        :data-endx="iframeOption.endx"
        :data-starty="iframeOption.starty"
        :data-endy="iframeOption.endy"
        :data-zindex="iframeOption.zIndex"
        :style="style"
    >
        <iframe @click.prevent.self :src="iframeOption.url"></iframe>

        <edit-component-template
            :data-key="iframeOption.dataKey"
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
        iframeOption: {
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
            'setEditingIframe',
            'setComponent',
            'removeComponent',
        ]),

        onMousedownComponent(event) {
            this.setEditingIframe(this.iframeOption.dataKey)
            this.$emit('onMousedownComponent', event)
        },

        onMousedownResizePoint(emitData) {
            this.$emit('onMousedownResizePoint', emitData)
        },
    },
    computed: {
        style() {
            return {
                'z-index': this.iframeOption.zIndex,
                left: this.areaWidth * this.iframeOption.startx * 0.01 + 'px',
                top: this.areaHeight * this.iframeOption.starty * 0.01 + 'px',
                width:
                    this.areaWidth *
                        (this.iframeOption.endx - this.iframeOption.startx) *
                        0.01 +
                    'px',
                height:
                    this.areaHeight *
                        (this.iframeOption.endy - this.iframeOption.starty) *
                        0.01 +
                    'px',
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.tool-iframe {
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