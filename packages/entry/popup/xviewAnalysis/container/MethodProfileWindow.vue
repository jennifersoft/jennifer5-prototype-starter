<template>
    <window
        class="method-profile-window"
        draggable
        :open-w="364"
        :open-h="498"
        :open-x="24"
        :open-y="windowTop"
        :messages="{
            apply: i18n.save,
            cancel: i18n.cancel,
        }"
        @cancel="() => $emit('cancel')"
        @apply="onClickSaveBtn"
    >
        <template #subject>
            <slot name="subject">
                <span>{{ menuTitle }}</span>

                <tooltip :message="description">
                    <svg-icon
                        :width="tooltipIconSize"
                        :height="tooltipIconSize"
                        :icon-type="tooltipIconType"
                    ></svg-icon>
                </tooltip> </slot
        ></template>
        <slot name="contents">
            <div class="top">
                <div class="bold">
                    <checkbox
                        v-model="activeProfile"
                        :label="i18n.activeProfileSettings"
                    />
                </div>

                <div
                    v-if="
                        activeProfile &&
                            menuType !== profileTypes.EXTERNALCALL &&
                            menuType !== profileTypes.EXCEPT
                    "
                >
                    <div class="line"></div>

                    <div class="title">{{ i18n.parameters }}</div>
                    <div class="params">
                        <div v-for="(name, index) in parameterNames">
                            <checkbox
                                :label="name"
                                v-model="activeParameters[index]"
                                @change="onChangeParameters"
                            />
                        </div>
                    </div>

                    <div class="bold">
                        <checkbox
                            v-model="activeReturn"
                            :disabled="activeMethodProfile.retType === 'void'"
                            :label="i18n.return"
                            @change="onChangeReturn"
                        />

                        <span>({{ activeMethodProfile.retType }})</span>
                    </div>
                </div>
            </div>
            <div class="bottom" v-if="activeProfile">
                <div class="title">{{ i18n.instanceName }}</div>
                <list-selector
                    v-if="readyInstances"
                    :title-label="i18n.selectAll"
                    :list="instances"
                    :active-indexes="activeInstances"
                    :multi-select="true"
                    @check="onCheckInstances"
                ></list-selector>
            </div>
        </slot>
        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </window>
</template>

<script>
import AlertWindow from '@vuejs/component/window/AlertWindow';
import Window from '@vuejs/component/window/Window';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState as baseMapState } from '../store/base';
import { mapState, mapActions } from '../store/timeline';
import { METHOD_PROFILE_TYPES } from '../constant';

export default {
    inject: {
        i18n: {
            default: {
                save: 'Save',
                cancel: 'Cancel',
                methodProfile: 'Mehtod profile',
                exceptMethodProfile: 'Except method profile',
                txCall: 'External Call',
                guid: 'GUID',
                userId: 'User ID',
                selectAll: 'Select all',
                instanceName: 'Instance name',
                parameters: 'Parameters',
                return: 'Return',
                activeProfileSettings: 'Active profile settings',
            },
        },
    },
    components: {
        AlertWindow,
        Window,
        ListSelector,
        Checkbox,
        Tooltip,
        SvgIcon,
    },
    props: {
        menuIndex: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        fullMethodDescription: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...baseMapState({
            windowTop: state => state.mainHeight - state.distHeight - 153,
            transactionRow: state => state.transactionRow,
        }),
        ...mapState({
            instances: state => {
                return state.instances.map(row => {
                    return {
                        label: row.shortName,
                        description: row.statusMsg,
                        oid: row.oid,
                    };
                });
            },
            activeMethodProfile: state => state.activeMethodProfile,
        }),
        parameterNames() {
            return this.parseParameterNames(
                this.activeMethodProfile.params.value
            );
        },
        menuTitle() {
            return this.menus[this.menuIndex].text;
        },
        menuType() {
            return this.menus[this.menuIndex].type;
        },
    },
    watch: {
        activeMethodProfile(profile) {
            this.activeProfile = profile.description !== null;
            this.activeReturn = profile.returnValue === '1';
            this.activeParameters = this.parseParameterIndexes(
                profile.params.value,
                profile.indexList
            );
            this.activeInstances = this.parseInstanceIndexes(
                this.instances,
                profile.insList
            );
        },
    },
    data() {
        return {
            activeProfile: false,
            activeInstances: [],
            activeParameters: [], // 매개변수 순서값(인덱스)가 들어가야 함.
            activeReturn: false,

            readyInstances: false,
            profileTypes: METHOD_PROFILE_TYPES,
            menus: [
                {
                    text: this.i18n.methodProfile,
                    type: METHOD_PROFILE_TYPES.METHOD,
                },
                {
                    text: this.i18n.exceptMethodProfile,
                    type: METHOD_PROFILE_TYPES.EXCEPT,
                },
                {
                    text: this.i18n.txCall,
                    type: METHOD_PROFILE_TYPES.EXTERNALCALL,
                },
                { text: this.i18n.guid, type: METHOD_PROFILE_TYPES.GUID },
                { text: this.i18n.userId, type: METHOD_PROFILE_TYPES.USERID },
            ],

            alertMessage: '',

            tooltipIconSize: 16,
            tooltipIconType: ICON_TYPE.info,
        };
    },
    methods: {
        ...mapActions(['loadMethodProfile', 'setMethodProfile']),

        parseParameterNames(paramStr) {
            const tmpStr = paramStr.replace('(', '').replace(')', '');
            return tmpStr == '' ? [] : tmpStr.split(',');
        },
        parseParameterIndexes(paramStr, indexStr) {
            paramStr = !paramStr ? '' : paramStr;
            indexStr = !indexStr ? '' : indexStr;

            const result = [];
            const paramList = this.parseParameterNames(paramStr);
            const tmpStr = indexStr.replace('{', '').replace('}', '');
            const tmpIndexList = tmpStr == '' ? [] : tmpStr.split(',');

            for (let i = 0; i < paramList.length; i++) {
                result.push(false);
            }

            for (let i = 0; i < tmpIndexList.length; i++) {
                result[tmpIndexList[i]] = true;
            }

            return result;
        },
        parseInstanceIndexes(insList, insStr) {
            insStr = !insStr ? '' : insStr;

            const result = [];
            const tmpStr = insStr.replace('{', '').replace('}', ''),
                tmpInsList =
                    tmpStr == ''
                        ? ['' + this.transactionRow.sysOid]
                        : tmpStr.split(',');

            for (let i = 0; i < insList.length; i++) {
                const oid = '' + insList[i].oid;
                const status = tmpInsList.includes(oid);
                if (status) result.push(i);
            }

            return result;
        },
        onCheckInstances(instances) {
            const oids = instances.map(inst => inst.oid);
            const checkedIndexes = [];

            this.instances.forEach((inst, index) => {
                if (oids.includes(inst.oid)) checkedIndexes.push(index);
            });
            this.activeInstances = checkedIndexes;
        },
        onChangeParameters() {
            if (
                this.menuType === METHOD_PROFILE_TYPES.GUID ||
                this.menuType === METHOD_PROFILE_TYPES.USERID
            ) {
                this.activeReturn = false;
            }
        },
        onChangeReturn() {
            if (
                this.menuType === METHOD_PROFILE_TYPES.GUID ||
                this.menuType === METHOD_PROFILE_TYPES.USERID
            ) {
                this.activeParameters = [];
            }
        },
        async onClickSaveBtn() {
            const indexes = this.activeParameters
                .map((status, index) => (status ? index : -1))
                .filter(index => index !== -1);

            const oids = this.instances
                .filter((instance, index) =>
                    this.activeInstances.includes(index)
                )
                .map(instance => instance.oid);

            if (this.activeProfile && oids.length === 0) {
                this.alertMessage = this.i18n.M0026;
                return;
            }

            await this.setMethodProfile({
                type: this.menus[this.menuIndex].type,
                languageType: this.transactionRow.langType,
                domainId: this.transactionRow.sid,
                fullMethodDescription: this.fullMethodDescription,
                activeProfile: this.activeProfile,
                activeReturn: this.activeReturn,
                activeParameters: indexes,
                activeInstances: oids,
            });

            this.$emit('cancel');
        },
    },
    created() {
        this.loadMethodProfile({
            type: this.menus[this.menuIndex].type,
            xtype: this.transactionRow.xtype,
            domainId: this.transactionRow.sid,
            fullMethodDescription: this.fullMethodDescription,
        }).then(() => {
            // TODO: ListSelector 컴포넌트에 watch를 추가하면, 포스트 로드를 하지 않아도 됨.
            this.readyInstances = true;
        });
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.method-profile-window {
    @include themify($themes) {
        .top {
            min-height: 200px;

            .title {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .bold {
                ::v-deep .aries-checkbox-label {
                    font-weight: bold;
                }

                span {
                    font-size: 12px;
                    margin-bottom: -3px;
                    color: #616161;
                }
            }

            .line {
                height: 1px;
                margin: 10px 0;
                background-color: themed('method-profile-window-border-color');
            }

            .params {
                height: 80px;
                margin-bottom: 15px;
                overflow: auto;
            }
        }

        .bottom {
            > .title {
                font-size: 12px;
                margin-bottom: 8px;
                color: #616161;
            }

            ::v-deep .list-selector-container {
                min-height: 146px;
            }
        }
    }

    ::v-deep .alert-window {
        top: 0px !important;
    }

    ::v-deep .body > .title {
        > span {
            float: left;
            margin-top: -2px;
            margin-right: 2px;
        }
    }
}
</style>
