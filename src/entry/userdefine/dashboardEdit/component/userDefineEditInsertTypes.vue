<template>
    <div class="insert-tool">
        <div>
            <tooltip
                :message="i18n.chart"
                :offset="-2"
                :position="'top-center'"
            >
                <btn
                    :items="icon.chart"
                    class="border-none"
                    :class="{ 'light-focus': isActiveChartTab }"
                    @click="onClickTab(INSERT_TYPE_ON_UI.GENERAL)"
                />
            </tooltip>
        </div>
        <div>
            <tooltip :message="i18n.text" :offset="-2" :position="'top-center'">
                <btn
                    :items="icon.text"
                    class="border-none"
                    :class="{ 'light-focus': isActiveTextTab }"
                    @click="onClickTab(INSERT_TYPE_ON_UI.TEXT)"
                />
            </tooltip>
        </div>
        <div>
            <tooltip
                :message="i18n.iframe"
                :offset="-2"
                :position="'top-center'"
            >
                <btn
                    :items="icon.iframe"
                    class="border-none"
                    :class="{ 'light-focus': isActiveIframeTab }"
                    @click="onClickTab(INSERT_TYPE_ON_UI.IFRAME)"
                />
            </tooltip>
        </div>
        <div>
            <tooltip :message="'Plugin'" :offset="-2" :position="'top-center'">
                <btn
                    :items="icon.plugin"
                    class="border-none"
                    :class="{ 'light-focus': isActivePluginTab }"
                    @click="onClickTab(INSERT_TYPE_ON_UI.PLUGIN)"
                />
            </tooltip>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { INSERT_TYPE_ON_UI } from '@entry/userdefine/dashboardEdit/const';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { i18n } from '@common/utility';

export default {
    name: 'userDefineInsertTypes',
    components: { Btn, Tooltip },
    data() {
        return {
            i18n: {
                chart: i18n.get('ui.label.chart'),
                text: i18n.get('ui.label.text'),
                iframe: i18n.get('ui.en.iframe'),
            },
            icon: {
                chart: [
                    {
                        value: INSERT_TYPE_ON_UI.GENERAL,
                        iconType: ICON_TYPE.chart,
                    },
                ],
                text: [
                    { value: INSERT_TYPE_ON_UI.TEXT, iconType: ICON_TYPE.text },
                ],
                iframe: [
                    {
                        value: INSERT_TYPE_ON_UI.IFRAME,
                        iconType: ICON_TYPE.iframe,
                    },
                ],
                plugin: [
                    {
                        value: INSERT_TYPE_ON_UI.PLUGIN,
                        iconType: ICON_TYPE.plugin,
                    },
                ],
            },

            INSERT_TYPE_ON_UI: INSERT_TYPE_ON_UI,
            ICON_TYPE: ICON_TYPE,
            iconSize: 16,
        };
    },
    methods: {
        ...mapMutations('userdefine', [
            'emitInsertTypeOnUI',
            'emitShowWindowWhenUseToolType',
        ]),

        ...mapActions('userdefine', ['emitNonSelectComponent']),

        onClickTab(type) {
            this.emitNonSelectComponent();
            this.emitInsertTypeOnUI(type);
            if (type !== INSERT_TYPE_ON_UI.GENERAL)
                this.emitShowWindowWhenUseToolType(true);
        },
    },
    computed: {
        ...mapGetters('userdefine', ['selectedInsertTypeOnUI']),

        isActiveChartTab() {
            return (
                this.selectedInsertTypeOnUI === INSERT_TYPE_ON_UI.GENERAL ||
                this.selectedInsertTypeOnUI === INSERT_TYPE_ON_UI.CUSTOM ||
                this.selectedInsertTypeOnUI === INSERT_TYPE_ON_UI.FRONT
            );
        },

        isActiveTextTab() {
            return this.selectedInsertTypeOnUI === INSERT_TYPE_ON_UI.TEXT;
        },

        isActiveIframeTab() {
            return this.selectedInsertTypeOnUI === INSERT_TYPE_ON_UI.IFRAME;
        },

        isActivePluginTab() {
            return this.selectedInsertTypeOnUI === INSERT_TYPE_ON_UI.PLUGIN;
        },
    },
};
</script>
<style lang="scss" scoped>
@import 'themes.scss';
.insert-tool {
    @include themify($themes) {
        background-color: themed('area-menu-background-color');

        height: 26px;
        padding: 7px;
        border-bottom: solid 1px themed('area-menu-border-color');
        display: flex;
        flex-direction: row;

        > div {
            width: 26px;
            height: 26px;
            border-radius: 3px;

            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 2px;
            cursor: pointer;
        }
    }
}
</style>
