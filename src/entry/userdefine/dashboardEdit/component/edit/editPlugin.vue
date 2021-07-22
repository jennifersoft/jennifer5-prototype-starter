<template>
    <div class="edit-plugin">
        <div class="plugin-configure-without-btn">
            <div class="title">
                <div>Plugin</div>
            </div>
            <div class="plugins">
                <span>Plugin</span>
                <div style="margin-top: 10px;">
                    <dropdown
                        :selected-value="selectedValue"
                        :items="pluginList"
                        @onchange="onChangePlugin"
                    />
                </div>
            </div>
        </div>
        <div v-show="editingComponentDataKey === undefined" class="insert-box">
            <btn
                :items="[{ text: i18n.insert }]"
                style="width: 248px; margin: 10px auto 0 auto; text-align: center!important;"
                class="focus"
                normal
                @click="onClickInsert"
            />
        </div>
    </div>
</template>
<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { loadPluginList } from '@entry/userdefine/dashboardEdit/http';
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';
import Btn from '@vuejs/component/button/Btn';
import { GenerateKey } from '@module/global/GenerateKey';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);
export default {
    name: 'editPlugin',
    components: { Dropdown, Btn },
    data() {
        return {
            i18n: {
                insert: i18n.get('ui.label.insert'),
            },
            pluginList: [],
        };
    },
    methods: {
        ...mapMutations(['setPluginURL', 'setComponent']),

        onChangePlugin(item) {
            this.setPluginURL(item.url);
            if (this.editingComponentDataKey)
                this.setComponent(this.editingPluginOptions);
        },

        onClickInsert() {
            const componentOption = Object.assign(
                { ...this.editingPluginOptions },
                this.defaultComponentPosition
            );

            componentOption.dataKey = GenerateKey.makeLongKeyByTime();
            componentOption.zIndex = this.nextZIndex;

            this.setComponent(componentOption);
        },
    },
    computed: {
        ...mapState([
            'editingPluginOptions',
            'editingComponentDataKey',
            'defaultComponentPosition',
        ]),

        selectedValue() {
            return this.editingPluginOptions.url
                ? this.editingPluginOptions.url
                : this.pluginList.length > 0
                ? this.pluginList[0].value
                : '';
        },
    },
    async mounted() {
        const pluginData = await loadPluginList();

        this.pluginList = pluginData.data.map(item => {
            return { ...item, text: item.name, value: item.url };
        });
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.edit-plugin {
    width: 280px;
    height: calc(100% - 41px);
    @include themify($themes) {
        background-color: themed('area-menu-background-color');
        > .plugin-configure-without-btn {
            height: calc(100% - 67px);
            overflow-y: auto;
            color: themed('edit-component-title2-color');

            div.title {
                height: 40px;
                > div {
                    height: 24px;
                    margin: 8px 0 8px 16px;
                    font-size: 14px;
                    font-weight: bold;
                    color: themed('edit-component-title1-color');
                }
            }

            > div:not(.title) {
                display: flex;
                flex-direction: column;
                padding: 16px;
                > span {
                    line-height: 28px;
                    flex-grow: 1;
                }
            }
        }

        > .insert-box {
            border-top: solid 1px themed('area-menu-border-color');
            margin-top: auto;
            display: flex;
        }
    }
}
</style>
