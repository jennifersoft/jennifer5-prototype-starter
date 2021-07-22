<template>
    <window
        :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
        animation-name="fade-down"
        :open-w="400"
        :open-h="contentHeight"
        :open-x="popupOffset.x"
        :open-y="popupOffset.y"
        @apply="save"
        @cancel="closeAdvancedSearchCondition"
    >
        <template #subject>
            <div class="window-head">
                {{ i18n.advancedFilter }}
            </div>
        </template>
        <div>
            <tab
                :tabs="tabData"
                :active-tab="currentTab"
                @change="updateCurrentTab"
            >
            </tab>
            <div
                v-show="currentTab === 'searchInTransaction'"
                class="condition-box"
            >
                <input-field
                    normal
                    :placeholder="i18n.txid"
                    v-model="inputValues.txid"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.applicationName"
                    v-model="inputValues.applicationName"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.ipaddr"
                    v-model="inputValues.ip"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.userId"
                    v-model="inputValues.userId"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.guid"
                    v-model="inputValues.guid"
                ></input-field>
            </div>
            <div
                v-show="currentTab === 'searchInProfile'"
                class="condition-box"
            >
                <div class="note">
                    <svg-icon
                        :icon-type="cautionIcon"
                        :width="16"
                        :height="16"
                    />
                    <span>{{ i18n.M0611 }}</span>
                </div>
                <input-field
                    normal
                    :placeholder="i18n.method"
                    v-model="inputValues.method"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.sqlBoundParameter"
                    v-model="inputValues.sqlBoundParameter"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.externalCall"
                    v-model="inputValues.externalCall"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.file"
                    v-model="inputValues.file"
                ></input-field>
                <input-field
                    normal
                    :placeholder="i18n.message"
                    v-model="inputValues.message"
                ></input-field>
                <checkbox
                    v-model="inputValues.excludeBot"
                    normal
                    :label="i18n.excludeBot"
                />
                <div class="textarea-wrapper">
                    <textarea
                        v-model="inputValues.sql"
                        :placeholder="i18n.sqlContext"
                    ></textarea>
                </div>
            </div>
        </div>
    </window>
</template>

<script>
import { i18n } from '@common/utility';
import Window from '@vuejs/component/window/Window';
import Tab from '@vuejs/component/tab/Tab';
import InputField from '@vuejs/component/Input/InputField';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import { mapMutations, mapState } from 'vuex';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
export default {
    name: 'AdvancedSearchConditionWindow',
    inject: {
        i18n,
        theme: {
            type: String,
            default: 'classic',
        },
    },
    components: {
        SvgIcon,
        Window,
        Tab,
        InputField,
        Checkbox,
    },
    data() {
        return {
            tabData: [
                {
                    key: 'searchInTransaction',
                    value: this.i18n.searchInTransaction,
                },
                { key: 'searchInProfile', value: this.i18n.searchInProfile },
            ],
            currentTab: 'searchInTransaction',
            inputValues: {
                //트랜잭션 검색
                txid: undefined,
                applicationName: undefined,
                ip: undefined,
                userId: undefined,
                guid: undefined,

                //프로파일 검색
                method: undefined,
                sqlBoundParameter: undefined,
                externallCall: undefined,
                file: undefined,
                message: undefined,
                excludeBot: false,
                sql: undefined,
            },
        };
    },

    methods: {
        ...mapMutations('xviewAnalysis', [
            'updateAdvancedSearchCondition',
            'closeAdvancedSearchCondition',
        ]),
        updateCurrentTab(key) {
            this.currentTab = key;
        },
        cancel() {},
        save() {
            Object.keys(this.inputValues).forEach(key => {
                if (this.inputValues[key] === '')
                    this.inputValues[key] = undefined;
            });

            this.updateAdvancedSearchCondition(this.inputValues);
            this.closeAdvancedSearchCondition();
        },
        restore() {
            this.inputValues = { ...this.advanced };
        },
    },
    computed: {
        ...mapState('xviewAnalysis', {
            advanced: state => state.searchedCondition.advanced,
        }),

        contentHeight() {
            return this.currentTab === 'searchInTransaction' ? 410 : 590;
        },
    },
    mounted() {
        this.restore();
    },
    created() {
        this.cautionIcon = ICON_TYPE.caution3;
    },
    beforeMount() {
        this.popupOffset = {
            x: 570,
            y: 140,
        };
    },
};
</script>
<style lang="scss" scoped>
.condition-box {
    margin-top: 16px;
    > div {
        margin: 4px 0;
        @import '~@vuejs/component/themes.scss';
        @include themify($themes) {
            &.textarea-wrapper {
                box-sizing: border-box;
                border: 1px solid themed('border-color');
                padding: 10px;

                font-size: 14px;
                border-radius: 2px;
                height: 72px;
                > textarea {
                    border: none;
                    outline: none;
                    resize: none;
                    color: themed('typography-color-primary');
                    background-color: transparent;

                    &::placeholder {
                        color: themed('typography-color-grey2');
                    }

                    max-width: 100%;
                    width: 100%;
                }
            }

            &.note {
                margin-bottom: 12px;
                padding: 12px;
                border-radius: 4px;
                background: themed('note-background');
                align-items: center;
                display: flex;
                > span {
                    margin-left: 4px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
