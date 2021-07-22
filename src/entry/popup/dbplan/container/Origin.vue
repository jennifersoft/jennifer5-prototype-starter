<template>
    <div class="origin">
        <div class="tool-bar">
            <span>{{ i18n.sql }}</span>
            <btn
                class="border-none"
                normal
                :items="[{ iconType: settingIcon }]"
                :tooltip-options="{
                    message: i18n.parameterAndDatabaseSettings,
                }"
                @click.native="onShowSettingWindow"
            ></btn>
        </div>
        <slot></slot>
        <div class="btn-bar">
            <btn
                normal
                :items="[{ text: i18n.spBuild }]"
                :tooltip-options="{
                    message: i18n.M0539,
                    position: 'top-center',
                }"
                @click.native="onClickSpBuildBtn"
                v-if="platform === 'net'"
            ></btn>
            <btn
                class="primary"
                normal
                :items="[{ text: i18n.execute }]"
                :loading="isLoading"
                @click.native="onClickRunBtn"
            ></btn>
        </div>
        <window
            :messages="settingMessages"
            :open-w="400"
            :open-h="400"
            :draggable="false"
            @cancel="onCloseSettingWindow"
            @apply="onApplySettingWindow"
            v-if="showSettingWindow"
        >
            <template #subject>{{
                i18n.parameterAndDatabaseSettings
            }}</template>
            <template>
                <tab
                    small
                    :tabs="changedTabs"
                    :active-tab="activeTab"
                    @change="tab => (activeTab = tab)"
                ></tab>
                <div class="contents">
                    <list-selector
                        :list="databaseList"
                        :active-indexes="[databaseIndex]"
                        @list-select="onChangeDatabaseName"
                        v-show="
                            activeTab === 'database' && databaseList.length > 0
                        "
                    ></list-selector>
                    <parameters
                        :names="inlineNames"
                        @change="onChangeInlineNames"
                        v-show="activeTab === 'inline'"
                    ></parameters>
                    <parameters
                        :names="boundNames"
                        :keys="boundParameters.map(data => data.key)"
                        @change="onChangeBoundNames"
                        v-show="activeTab === 'bound'"
                    ></parameters>
                </div>
            </template>
        </window>
    </div>
</template>

<script>
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import Tab from '@vuejs/component/tab/Tab';
import Btn from '@vuejs/component/button/Btn';
import Window from '@vuejs/component/window/Window';
import Parameters from '../component/Parameters';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { BoundParameterTypeDef } from '@common/definition';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    inject: ['i18n', 'platform'],
    components: { ListSelector, Tab, Btn, Window, Parameters },
    data() {
        return {
            settingIcon: ICON_TYPE.settings,
            isLoading: false,

            showSettingWindow: false,
            settingMessages: {
                apply: this.i18n.execute,
                cancel: this.i18n.cancel,
            },

            tabs: [
                { key: 'inline', value: this.i18n.params },
                { key: 'bound', value: this.i18n.bindParams },
                { key: 'database', value: this.i18n.db },
            ],
            activeTab: 'inline',

            inlineNames: [],
            boundNames: [],
            dbName: '',
        };
    },
    computed: {
        ...mapState({
            sql: state => state.sql,
            inlineParameters: state => state.inlineParameters,
            boundParameters: state => state.boundParameters,
            databaseSettings: state => state.databaseSettings,
            databaseName: state => state.databaseName,
        }),
        databaseList() {
            return this.databaseSettings.map((row, i) => {
                return {
                    label: row.name,
                    index: i,
                };
            });
        },
        databaseIndex() {
            const filter = this.databaseList.filter(
                row => row.label === this.databaseName
            );
            return filter.length === 1 ? filter[0].index : 0;
        },
        changedTabs() {
            return this.tabs.map(tab => {
                let disabled;
                if (tab.key === 'inline')
                    disabled = this.inlineParameters.length === 0;
                else if (tab.key === 'bound')
                    disabled = this.boundParameters.length === 0;
                else disabled = this.databaseSettings.length === 0;

                return {
                    ...tab,
                    disabled,
                };
            });
        },
    },
    methods: {
        ...mapMutations(['updateSettings', 'updateOutputQueries']),
        ...mapActions(['buildQueries', 'executeDatabasePlan']),
        onClickSpBuildBtn() {
            const strs = this.boundParameters.map(param => {
                if (param.type === BoundParameterTypeDef.STRING)
                    return `${param.key}='${param.value}'`;
                else return `${param.key}=${param.value}`;
            });
            const output = `${this.sql.trim()} ${strs.join(',')}`;

            this.updateOutputQueries({
                origin: output,
                result: output,
            });
        },
        async onClickRunBtn() {
            this.isLoading = true;
            await this.buildQueries();
            if (this.databaseSettings.length > 0) {
                await this.executeDatabasePlan();
            }
            this.isLoading = false;
        },
        onShowSettingWindow() {
            this.activeTab = this.getAliveFirstTab();
            this.inlineNames = this.inlineParameters.map(data => data.value);
            this.boundNames = this.boundParameters.map(data => data.value);
            this.showSettingWindow = true;
        },
        onCloseSettingWindow() {
            this.showSettingWindow = false;
        },
        async onApplySettingWindow() {
            this.updateSettings({
                inlineNames: this.inlineNames,
                boundNames: this.boundNames,
                databaseName: this.dbName,
            });

            await this.onClickRunBtn();
            this.showSettingWindow = false;
        },
        onChangeDatabaseName({ label }) {
            this.dbName = label;
        },
        onChangeInlineNames(names) {
            this.inlineNames = names;
        },
        onChangeBoundNames(names) {
            this.boundNames = names;
        },
        getAliveFirstTab() {
            let tab = 'inline';
            if (this.changedTabs[0].disabled && !this.changedTabs[1].disabled)
                tab = 'bound';
            return tab;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.origin {
    @include themify($themes) {
        position: relative;
        --toolbar-height: 46px;
        --btnbar-height: 52px;
        height: calc(100% - var(--toolbar-height));

        > .tool-bar {
            height: var(--toolbar-height);
            line-height: var(--toolbar-height);
            padding: 0px 18px;
            border-bottom: 1px solid themed('main-border-color');

            > span {
                font-size: 14px;
                font-weight: 500;
            }

            > .aries-ui-btn {
                float: right;
                margin-top: 5px;
            }
        }

        > textarea {
            border: 0px;
            padding: 18px 16px;
            width: calc(100% - 33px);
            height: calc(100% - 38px - var(--btnbar-height));
            resize: none;
            font-family: Menlo, Monaco, 'Courier New', monospace;
            background-color: themed('textarea-background-color');
            color: themed('textarea-font-color');
        }

        > .btn-bar {
            border-top: 1px solid themed('main-border-color');
            padding: 8px;
            text-align: right;
        }

        ::v-deep .aries-ui-window {
            position: absolute;
            top: 50px;
            right: 20px;

            .body {
                padding-top: 24px;
            }

            .contents {
                overflow: auto;
                max-height: 230px;
                margin-top: 16px;

                /deep/ .list-selector-container {
                    min-height: 220px;
                }
            }
        }
    }
}
</style>
