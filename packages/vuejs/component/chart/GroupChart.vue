<template>
    <recycle-scroller
        :class="['group-chart']"
        :items="data"
        :buffer="height"
        :item-size="nodeSize"
        :key-field="'index'"
    >
        <template v-slot="{ item }">
            <div
                :class="['node', activeIndex === item.index ? 'active' : '']"
                @click="() => $emit('onchange', item)"
            >
                <div class="subject">
                    <div class="left" :title="item.name">{{ item.name }}</div>
                    <div class="right" :title="item.value">
                        {{ item.value }}
                    </div>
                </div>
                <div class="graph">
                    <div class="background">
                        <div
                            class="gauge"
                            :style="{ width: `${item.rate * 100}%` }"
                        ></div>
                    </div>
                </div>
            </div>
        </template>
    </recycle-scroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
    components: {
        RecycleScroller,
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
        activeIndex: {
            type: Number,
            required: true,
        },
        activeSequence: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    methods: {},
    data() {
        return {
            nodeSize: 57,
            height: 200,
            resizeHandler: null,
        };
    },
    watch: {
        activeSequence(newVal) {
            this.$el.scrollTop = this.nodeSize * newVal + 10;
        },
    },
    mounted() {
        this.height = this.$el.clientHeight;
    },
};
</script>

<style lang="scss" scoped>
@import './themes.scss';

.group-chart {
    font-size: 11px;
    padding: 16px 14px;

    &.disabled {
        .node {
            cursor: not-allowed !important;
        }
    }

    @include themify($themes) {
        .node {
            padding: 12px;
            cursor: pointer;
            border-radius: 3px;

            &.active {
                background-color: themed('group-chart-active-background-color');
                cursor: default;
            }
            &:hover {
                background-color: themed('group-chart-hover-background-color');
            }

            > .subject {
                margin-bottom: 8px;
                display: flex;
                > .left {
                    flex: 0 0 180px;
                    max-width: 180px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                > .right {
                    flex: 1;
                    font-weight: bold;
                    text-align: right;
                }
            }

            > .graph {
                > .background {
                    position: relative;
                    height: 8px;
                    background: themed('group-chart-graph-background-color');
                    border-radius: 2px;
                    > .gauge {
                        position: absolute;
                        height: 8px;
                        background: #8652ff;
                        border-radius: 2px;
                    }
                }
            }
        }
    }
}
</style>
