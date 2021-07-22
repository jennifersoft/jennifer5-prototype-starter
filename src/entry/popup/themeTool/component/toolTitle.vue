<template>
    <div class="tool-title">
        <div class="subject">{{ i18n.chartSetting }}</div>
        <div class="tools">
            <btn
                :items="[{ text: i18n.modifyUI }]"
                normal
                @click="toggleUseEditor"
                v-if="useEditor"
            ></btn>
            <btn
                :items="[{ text: i18n.modifyCode }]"
                normal
                @click="toggleUseEditor"
                v-else
            ></btn>
            <btn
                :items="[{ text: i18n.cancel }]"
                normal
                @click="onCancelWindow"
            ></btn>
            <btn
                :items="[{ text: i18n.submit }]"
                class="primary"
                normal
                @click="onSaveChartStyles"
            ></btn>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn'
import { mapState, mapMutations } from '../constant'

export default {
    inject: {
        i18n: {
            default: {
                chartSetting: 'Chart Settings',
                modifyUI: 'Modify UI',
                modifyCode: 'Modify Code',
                cancel: 'Cancel',
                submit: 'Submit',
            },
        },
    },
    components: {
        Btn,
    },
    computed: {
        ...mapState({
            useEditor: state => state.useEditor,
            chartStyles: state => state.chartStyles,
            activeTab: state => state.activeTab,
        }),
    },
    methods: {
        ...mapMutations({
            toggleUseEditor: 'toggleUseEditor',
        }),
        onCancelWindow() {
            window.close()
        },
        onSaveChartStyles() {
            try {
                window.postMessage({
                    type: 'themeTool',
                    brush: this.activeTab,
                    themes: this.chartStyles,
                })
                window.close()
            } catch (e) {
                alert(e)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.tool-title {
    display: flex;
    padding: 16px 17px 15px 24px;

    > .subject {
        width: 50%;
        font-size: 16px;
        font-weight: bold;
        line-height: 36px;
    }

    > .tools {
        width: 50%;
        text-align: right;

        ::v-deep .aries-ui-btn + .aries-ui-btn {
            margin-left: 4px !important;
        }
    }
}
</style>
