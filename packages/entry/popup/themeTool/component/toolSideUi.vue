<template>
    <div
        class="tool-side-ui"
        :style="{
            width: width + 'px',
            height: height + 'px',
            'max-height': height + 'px',
        }"
    >
        <side-ui-line
            v-if="activeTab === 'line'"
            @sync-editor="onSyncEditor"
        ></side-ui-line>
        <side-ui-bar
            v-else-if="activeTab === 'bar'"
            @sync-editor="onSyncEditor"
        ></side-ui-bar>
        <side-ui-pie
            v-else-if="activeTab === 'pie'"
            @sync-editor="onSyncEditor"
        ></side-ui-pie>
    </div>
</template>

<script>
import methods from './mixin/methodsForUI'
import SideUiLine from './toolSideUiLine'
import SideUiBar from './toolSideUiBar'
import SideUiPie from './toolSideUiPie'

export default {
    mixins: [methods],
    components: {
        SideUiLine,
        SideUiBar,
        SideUiPie,
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        activeTab: {
            type: String,
            required: true,
        },
    },
}
</script>

<style lang="scss">
.tool-side-ui {
    overflow-y: auto;
    overflow-x: hidden;

    > div {
        padding-bottom: 100px;
        margin: 22px 24px;

        > section {
            margin-bottom: 25px;

            > .subject {
                font-size: 14px;
                font-weight: bold;
            }
            > .widgets {
                > .widget {
                    display: flex;
                    padding: 16px 0px;
                    &.column {
                        flex-direction: column;
                        > .main {
                            text-align: center;
                        }
                    }
                    > .title {
                        flex: 1;
                        font-weight: 500;
                        line-height: 28px;
                    }
                    > .main {
                        flex: 1;
                        text-align: right;
                    }
                }
            }
        }
    }
}
</style>
