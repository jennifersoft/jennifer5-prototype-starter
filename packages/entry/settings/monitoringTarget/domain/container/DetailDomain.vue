<template>
    <div class="detail-domain">
        <div class="row">
            <div class="left">{{ i18n.defaultSetting }}</div>
            <div class="right">
                <div class="form">
                    <div class="subject">{{ i18n.id }}</div>
                    <div class="input">
                        <format-number-input
                            normal
                            :width="400"
                            :min="1"
                            :max="32767"
                            :disabled="!isNew"
                            v-model="selectedDomain.sid"
                        ></format-number-input>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18n.name }}</div>
                    <div class="input">
                        <input-field
                            normal
                            v-model="selectedDomain.shortName"
                        ></input-field>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18n.description }}</div>
                    <div class="input">
                        <input-field
                            normal
                            v-model="selectedDomain.longName"
                        ></input-field>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="left">{{ i18n.dataServer }}</div>
            <div class="right">
                <div class="form">
                    <div class="subject">{{ i18n.ip }}</div>
                    <div class="input">
                        <input-field
                            normal
                            v-model="selectedDomain.ip"
                            :dropdown-list="ipList"
                        ></input-field>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18n.port }}</div>
                    <div class="input">
                        <format-number-input
                            normal
                            :width="400"
                            :min="0"
                            :max="65535"
                            v-model="selectedDomain.port"
                        ></format-number-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="isExpandSettings">
            <div class="left">{{ i18n.instance }}</div>
            <div class="right">
                <div class="form">
                    <checkbox
                        normal
                        :label="i18n.autoIncreaseInstanceID"
                        :disabled="selectedDomain.batchJob"
                        v-model="selectedDomain.newAssignForDuplication"
                    ></checkbox>
                </div>
                <div class="form">
                    <checkbox
                        normal
                        :label="i18n.autoRemoveInstance"
                        v-model="selectedDomain.autoRemove"
                    ></checkbox>

                    <div class="sub-form">
                        <div
                            :class="[
                                'message',
                                !selectedDomain.autoRemove ? 'disabled' : '',
                            ]"
                        >
                            {{ i18n.autoRemovePeriod }}
                        </div>
                        <format-number-input
                            :disabled="!selectedDomain.autoRemove"
                            :width="80"
                            :min="0"
                            :max="60"
                            v-model="selectedDomain.autoRemoveTimeInMinute"
                        ></format-number-input>
                        {{ i18n.minute }}
                    </div>

                    <div class="form separator">
                        <div class="subject">
                            {{ i18n.firstInstanceNamingRule }}
                        </div>
                        <div class="sub-form">
                            <option-group
                                normal
                                :options="namingRuleOptions"
                                :active="[selectedDomain.namingRule]"
                                @change="onChangeNamingRule"
                            ></option-group>
                        </div>
                        <naming-rule-window
                            :naming-rule="selectedDomain.namingRule"
                            @cancel="() => (activeNamingRuleWindow = false)"
                            v-if="activeNamingRuleWindow"
                        ></naming-rule-window>
                    </div>

                    <div class="form">
                        <div class="message">
                            {{ i18n.initialAgentOptions }}
                        </div>
                        <div class="input">
                            <dropdown
                                normal
                                :disabled="isNew"
                                :width="140"
                                :items="agentList"
                                :selected-value="selectedDomain.initialAgent"
                                @onchange="onChangeInitialAgent"
                            ></dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="isExpandSettings">
            <div class="left">{{ i18n.monitoring }}</div>
            <div class="right">
                <div class="info">{{ i18n.M0362 }}</div>
                <checkbox
                    normal
                    :label="i18n.batchJobMonitoring"
                    v-model="selectedDomain.batchJob"
                    @change="onChangeBatchJobMonitoring"
                ></checkbox>
            </div>
        </div>
        <div class="row" v-if="isExpandSettings">
            <div class="left">{{ i18n.visitUserCollectionRule }}</div>
            <div class="right">
                <option-group
                    normal
                    :options="visitUserOptions"
                    :active="[selectedDomain.visitUserRule]"
                    @change="onChangeVisitUserRule"
                ></option-group>
            </div>
        </div>
        <div class="row" v-if="useDomainGroup">
            <div class="left">{{ i18n.domainGroup }}</div>
            <div class="right">
                <domain-group-selector
                    @elementSelected="onChangeDomainGroup"
                    :selected-one="selectedDomainGroup"
                    :domain-group-tree="domainGroupList"
                    :vertically-aligned="true"
                ></domain-group-selector>
            </div>
        </div>
        <div class="footer">
            <btn
                class="border-none"
                normal
                :items="[{ text: i18n.cancel }]"
                @click="backToScreenMode"
            ></btn>
            <btn
                class="primary"
                normal
                :disabled="isDuplicated || isInvalidated"
                :loading="saveLoading"
                :items="[{ text: i18n.saveChanges }]"
                @click="onClickSaveBtn"
            ></btn>
        </div>
    </div>
</template>

<script>
import DomainGroupSelector from '@vuejs/component/Domain/DomainGroupSelector/DomainGroupSelector.vue';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import InputField from '@vuejs/component/Input/InputField';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import OptionGroup from '@vuejs/component/Toggle/OptionGroup';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Btn from '@vuejs/component/button/Btn';
import NamingRuleWindow from './NamingRuleWindow';
import { mapState, mapMutations, mapActions } from '../vuex';
import { initializeTreeNodes, reloadTreeNodes } from '../../base/utility';

export default {
    inject: ['i18n'],
    components: {
        DomainGroupSelector,
        FormatNumberInput,
        InputField,
        Checkbox,
        OptionGroup,
        Dropdown,
        Btn,
        NamingRuleWindow,
    },
    props: {
        isNew: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        ...mapState({
            useDomainGroup: state => state.useDomainGroup,
            domainGroupTree: state => state.domainGroupTree,
            selectedDomain: state => state.selectedDomain,
            domainList: state => state.domainList,
        }),
        domainGroupTreeNodes() {
            return initializeTreeNodes(this.domainGroupTree);
        },
        domainGroupList() {
            const nodes = this.domainGroupTreeNodes;
            const lastIndex = nodes.filter(node => node.parent === null).length;

            return [
                ...nodes
                    .filter(node => node.sid === -1)
                    .map(node => this.createDomainGroupSelectorItem(node)),
                this.createDomainGroupSelectorItem({
                    label: this.i18n.unknownGroup,
                    key: `${lastIndex}`,
                    sid: -2,
                }),
            ];
        },
        isExpandSettings() {
            return this.selectedDomain.isConnected || this.isNew;
        },
        isDuplicated() {
            return (
                this.domainList.filter(
                    row => row.sid === this.selectedDomain.sid
                ).length > 0 && this.isNew
            );
        },
        isInvalidated() {
            const { shortName, ip } = this.selectedDomain;
            if (shortName === '' || ip === '') return true;
            return false;
        },
        ipList() {
            const ipSet = new Set();
            this.domainList.forEach(row => {
                ipSet.add(row.ip);
            });

            const ipList = [];
            ipSet.forEach(ip => {
                ipList.push({
                    text: ip,
                    value: ip,
                });
            });
            return ipList;
        },
    },
    data() {
        return {
            namingRuleOptions: [
                {
                    label: this.i18n.instanceName,
                    value: 1,
                },
                {
                    label: this.i18n.hostName,
                    value: 2,
                },
                {
                    label: this.i18n.configFileName,
                    value: 3,
                },
                {
                    label: this.i18n.ip,
                    value: 4,
                },
            ],
            activeNamingRuleWindow: false,
            visitUserOptions: [
                {
                    label: this.i18n.clientId,
                    value: 1,
                },
                {
                    label: this.i18n.clientIp,
                    value: 2,
                },
            ],
            agentList: [
                {
                    text: this.i18n.none,
                    value: -1,
                },
            ],
            saveLoading: false,

            // 부모 도메인 그룹 관련 데이터
            selectedDomainGroup: null,
        };
    },
    methods: {
        ...mapMutations(['backToScreenMode']),
        ...mapActions([
            'getAgentList',
            'saveDetailDomain',
            'updateDetailDomain',
            'saveDomainGroupTree',
        ]),
        onChangeInitialAgent({ value }) {
            this.selectedDomain.initialAgent = value;
        },
        onChangeNamingRule(values) {
            this.selectedDomain.namingRule = values[0];
            if (!this.isNew) this.activeNamingRuleWindow = true;
        },
        onChangeVisitUserRule(values) {
            this.selectedDomain.visitUserRule = values[0];
        },
        onChangeBatchJobMonitoring(active) {
            // 배치잡 옵션이 활성화 될 때, 인스턴스 자동 생성은 비활성화 시킨다
            if (active) this.selectedDomain.newAssignForDuplication = false;
        },
        onChangeDomainGroup(item) {
            this.selectedDomainGroup = item;
        },
        async onClickSaveBtn() {
            this.saveLoading = true;

            const domain = this.selectedDomain;
            const domainGroup = this.selectedDomainGroup;

            if (this.isNew) await this.saveDetailDomain(domain);
            else
                await this.updateDetailDomain({
                    row: domain,
                    isNew: false,
                });

            // 도메인 그룹이 변경되었거나, 미분류 도메인이 아닐 경우
            if (
                domainGroup.treeIndex !== domain.parentIndex &&
                domainGroup.data.sid !== -2
            ) {
                const nodes = reloadTreeNodes(this.domainGroupTreeNodes);
                const node = nodes.filter(node => node.sid === domain.sid)[0];

                if (!node) {
                    nodes.push({
                        parent: domainGroup.treeIndex,
                        label: domain.shortName,
                        sid: domain.sid,
                        key: domain.sid,
                    });
                } else {
                    node.parent = domainGroup.treeIndex;
                }

                // 새로 트리를 구성하고, index 순으로 정렬한다.
                await this.saveDomainGroupTree(reloadTreeNodes(nodes));
            }

            this.saveLoading = false;
            this.backToScreenMode();
        },
        createDomainGroupSelectorItem(node) {
            return {
                label: node.label,
                noInteraction: false,
                resourceType: 'domain-group',
                treeIndex: node.key,
                data: {
                    title: node.label,
                    index: node.key,
                    sid: node.sid,
                },
            };
        },
    },
    created() {
        const domain = this.selectedDomain;

        // 대표 에이전트 데이터 초기화
        if (!this.isNew && domain.isConnected) {
            this.getAgentList(domain.sid).then(res => {
                this.agentList = this.agentList.concat(
                    res.data.map(item => {
                        return {
                            text: item.shortName,
                            value: item.oid,
                        };
                    })
                );
            });
        }

        // 부모 도메인 그룹 목록 데이터 초기화
        if (this.useDomainGroup && this.domainGroupList.length > 0) {
            this.domainGroupList.forEach(item => {
                if (item.treeIndex === domain.parentIndex)
                    this.selectedDomainGroup = item;
            });

            // 그룹에 속하지 않는 Domain으로 설정
            if (this.selectedDomainGroup === null) {
                this.selectedDomainGroup = {
                    ...this.domainGroupList[this.domainGroupList.length - 1],
                };
            }
        }
    },
};
</script>

<style lang="scss" scoped>
@import '../../../basic/base';
@import '../themes';

.detail-domain {
    @include themify($themes) {
        .right {
            ::v-deep .input-field-wrapper {
                max-width: 400px;
            }

            .form {
                margin-bottom: 16px;

                > .subject {
                    margin-bottom: 8px;
                }
                > .sub-form {
                    margin-left: 24px;
                    margin-bottom: 24px;
                }

                .message {
                    margin-top: 16px;
                    margin-bottom: 8px;
                    font-size: 12px;
                    &.disabled {
                        opacity: 0.5;
                    }
                }

                &.separator {
                    border-bottom: 1px solid themed('common-border-color');
                }
            }

            .info {
                font-size: 14px;
                line-height: 1.57;
                margin-bottom: 16px;
                color: themed('common-message-font-color');
            }
        }
    }
}
</style>
