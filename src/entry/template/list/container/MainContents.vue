<template>
    <div class="main-contents">
        <x-table
            :key="tableSequence"
            :table-type="'nowrap'"
            :table-effect="'hover stripeless vborderless'"
            :table-size="'large'"
            :scroll-height="scrollHeight"
            :columns="columns"
            :data="rows"
            :template-row="rowTemplate"
            :row-height="35"
            :resize="true"
            :sort-type="'single'"
            @click="onClickTableRow"
        ></x-table>

        <directory-window
            v-if="showSelectDirectory"
            :title="i18n.buildDirectory"
            :no-directory="true"
            :style="tableWindowStyle"
            @cancel="onCloseDirectoryWindow"
            @apply="onApplyDirectoryWindow"
            @select="onSelectDirectoryKey"
        ></directory-window>

        <build-setting-window
            v-if="showBuildSetting"
            :mail-form="selectedMailForm"
            :style="tableWindowStyle"
            @cancel="onCloseBuildSettingWindow"
            @apply="onApplyBuildSettingWindow"
            @alert="message => $emit('alert', message)"
        ></build-setting-window>
    </div>
</template>

<script>
import XTable from 'vue-sheets/src/components/xtable';
import _ from '@library/lodash';
import { getDayjs, serverDateFormat } from '@common/base';
import { i18n, printEscape } from '@common/utility';
import { linkToEditorPage } from '@entry/document/list/utility';
import DirectoryWindow from '@entry/document/list/container/DirectoryWindow';
import BuildSettingWindow from './BuildSettingWindow';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    inject: ['theme', 'i18n', 'language'],
    components: {
        XTable,
        DirectoryWindow,
        BuildSettingWindow,
    },
    computed: {
        ...mapState({
            templateList: state => state.templateList,
        }),
        columns() {
            return [
                {
                    key: 'key',
                    name: '',
                    width: '30px',
                },
                {
                    key: 'no',
                    name: this.i18n.no,
                    sort: true,
                    width: '60px',
                },
                {
                    key: 'title',
                    name: this.i18n.title,
                    sort: true,
                    width: '40%',
                },
                {
                    key: 'writerId',
                    name: this.i18n.creator,
                    sort: true,
                },
                {
                    key: 'updateTime',
                    name: this.i18n.updateTime,
                    sort: true,
                },
                {
                    key: 'lastBuildTime',
                    name: this.i18n.lastBuildTime,
                },
                {
                    key: 'lastBuildDocumentKey',
                    name: this.i18n.nextBuildTime,
                },
                {
                    key: 'key',
                    name: this.i18n.build,
                    width: '150px',
                },
            ];
        },
        rows() {
            return this.templateList.map(row => {
                const DATE_FORMAT = `${serverDateFormat.longWithSec}`;
                const BUILD_DIST_CLASS = [
                    '',
                    'daily',
                    'weekly',
                    'monthly',
                    'custom',
                ];
                const buildDist = (row.buildDist || '').split(',')[0];

                return {
                    rowChecked: this.rowChecked,
                    updateTimeFormat: getDayjs(row.updateTime).format(
                        DATE_FORMAT
                    ),
                    lastBuildTimeFormat:
                        row.lastBuildDocumentError || !row.lastBuildDocumentKey
                            ? ''
                            : getDayjs(row.lastBuildTime).format(DATE_FORMAT),
                    titleFormat: printEscape(row.title),
                    buildDistType:
                        BUILD_DIST_CLASS[
                            buildDist === '' ? 0 : parseInt(buildDist[0])
                        ],
                    buildDistFormat: this.getBuildDistText(row.buildDist),
                    ...row,
                };
            });
        },
    },
    watch: {
        templateList() {
            this.rowChecked = {};
        },
    },
    data() {
        return {
            tableWindowStyle: {
                right: '25px',
                top: '0px',
            },

            showSelectDirectory: false,
            selectedDirectoryKey: '*',
            selectedTemplateKey: null,

            showBuildSetting: false,
            selectedMailForm: {},

            tableSequence: 0,
            scrollHeight: 500,
            rowChecked: {},
            rowTemplate: `
<tr>
    <td width="30px"><input type="checkbox" class="key-checkbox" value="<!= key !>" <! if(rowChecked[key] === true) { !>checked<! } !> /></td>
    <td><!= no !></td>
    <td><span class="template-link"><!= titleFormat !></span></td>
    <td><!= writerId !></td>
    <td><!= updateTimeFormat !></td>
    <td><span class="report-link"><!= lastBuildTimeFormat !></span></td>
    <td><span class="build-dist <!= buildDistType !>"><!= buildDistFormat !></span></td>
    <td align="right"><span class="build-btn">${i18n.get(
        'ui.label.build'
    )}</span> <span title="${
                this.i18n.autoBuildSet
            }" class="build-setup"><i class="icon-gear"></i></span></td>
</tr>
            `,

            resizeHandler: null,
        };
    },
    methods: {
        ...mapMutations(['updateCheckedTemplateKeys']),
        ...mapActions(['startTemplateBuild', 'loadTemplateList']),

        onCloseBuildSettingWindow() {
            this.selectedMailForm = {};
            this.showBuildSetting = false;
        },
        onApplyBuildSettingWindow() {
            this.onCloseBuildSettingWindow();
            this.loadTemplateList();
        },

        onSelectDirectoryKey({ key }) {
            this.selectedDirectoryKey = key;
        },
        onCloseDirectoryWindow() {
            this.selectedTemplateKey = null;
            this.selectedDirectoryKey = '*';
            this.showSelectDirectory = false;
        },
        onApplyDirectoryWindow() {
            this.startTemplateBuild({
                key: this.selectedTemplateKey,
                directoryKey: this.selectedDirectoryKey,
                isManualBuild: false,
            });
            this.onCloseDirectoryWindow();
        },
        onClickTableRow(row, e) {
            const cls = e.target.className;
            const marginTop = e.pageY - 20;
            const windowTop =
                marginTop + 160 > this.scrollHeight
                    ? this.scrollHeight - 150
                    : marginTop;

            if (cls === 'key-checkbox') {
                this.rowChecked[row.data.key] = e.target.checked;

                this.updateCheckedTemplateKeys(
                    Object.keys(this.rowChecked).filter(
                        key => this.rowChecked[key] === true
                    )
                );
            } else if (cls === 'template-link') {
                linkToEditorPage('/report/template/edit', row.data.key);
            } else if (cls === 'report-link') {
                linkToEditorPage(
                    '/report/document/edit',
                    row.data.lastBuildDocumentKey
                );
            } else if (cls === 'build-btn') {
                if (this.showSelectDirectory) this.onCloseDirectoryWindow();

                this.$set(this.tableWindowStyle, 'top', `${windowTop - 84}px`);
                this.selectedTemplateKey = row.data.key;
                this.showSelectDirectory = true;
                this.showBuildSetting = false;
            } else if (cls === 'build-setup' || cls === 'icon-gear') {
                if (this.showBuildSetting) this.onCloseBuildSettingWindow();

                this.$set(this.tableWindowStyle, 'top', `${windowTop - 84}px`);
                this.showSelectDirectory = false;
                this.showBuildSetting = true;

                setTimeout(() => {
                    this.selectedMailForm = {
                        key: row.data.key,
                        directoryKey: row.data.directoryKey,
                        buildDist: row.data.buildDist,
                        useSendMail: row.data.checkSendMail ?? false,
                        senderMail: row.data.mailSender ?? '',
                        senderName: row.data.mailSenderName ?? '',
                        receivers: row.data.mailReceiver ?? '',
                    };
                }, 10);
            }
        },
        getDayStrForEnglish(num) {
            let numStr = '' + num,
                lastNum = parseInt(numStr.charAt(numStr.length - 1));

            if (lastNum == 1) return `${num}st`;
            else if (lastNum == 2) return `${num}nd`;
            else if (lastNum == 3) return `${num}rd`;
            return `${num}th`;
        },
        getBuildDistText(buildDist) {
            const week_list = [
                this.i18n.sunday,
                this.i18n.monday,
                this.i18n.tuesday,
                this.i18n.wednesday,
                this.i18n.thursday,
                this.i18n.friday,
                this.i18n.saturday,
            ];
            const tokens = (buildDist || '').split(',');
            const type = tokens[0] === '' ? -1 : parseInt(tokens[0]);

            const blank = this.language == 'en' ? ' ' : '';

            if (type === 1) {
                return this.i18n.daily;
            } else if (type === 2) {
                return [
                    this.i18n.weekly,
                    week_list[parseInt(tokens[1]) - 1],
                ].join(' ');
            } else if (type === 3) {
                if (this.language == 'en') {
                    return (
                        this.getDayStrForEnglish(tokens[1]) +
                        ' day of every month'
                    );
                } else {
                    return [
                        this.i18n.monthly,
                        `${tokens[1]}${blank}${this.i18n.day}`,
                    ].join(' ');
                }
            } else if (type === 4) {
                return [
                    this.i18n.user,
                    `(${tokens[1]}${blank}${this.i18n.day})`,
                ].join(' ');
            }

            return '';
        },
    },
    beforeMount() {
        this.resizeHandler = _.throttle(() => {
            this.tableSequence += 1;
            this.scrollHeight = window.innerHeight - 220;
        }, 1000);

        this.resizeHandler();

        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.main-contents {
    @include themify($themes) {
        padding: 24px;

        ::v-deep .xtable {
            th:last-child {
                text-align: center;
            }

            .template-link,
            .report-link,
            .build-btn,
            .build-setup {
                cursor: pointer;
            }

            .build-dist {
                padding: 1px 2px;
                border-radius: 2px;
                color: themed('table-build-dist-font-color');

                &.daily {
                    background-color: themed(
                        'table-build-dist-daily-background-color'
                    );
                }
                &.weekly {
                    background-color: themed(
                        'table-build-dist-weekly-background-color'
                    );
                }
                &.monthly {
                    background-color: themed(
                        'table-build-dist-monthly-background-color'
                    );
                }
                &.custom {
                    background-color: themed(
                        'table-build-dist-custom-background-color'
                    );
                }
            }

            .report-link {
                color: themed('table-report-link-font-color');
            }

            .build-btn {
                border-radius: 2px;
                padding: 4px 6px;
                border: 1px solid themed('table-build-button-border-color');
                color: themed('table-build-button-font-color');
            }

            .build-setup {
                border-radius: 2px;
                padding: 4px 8px 4px 8px;

                &:hover {
                    background-color: themed(
                        'table-build-icon-hover-background-color'
                    );
                }
            }

            .icon-gear {
                cursor: pointer;
                display: inline-block;
                width: 14px;
                height: 14px;
                background-size: cover;
                margin-bottom: -3px;
                background-image: themed('table-build-icon-asset-url');
            }
        }
    }
}
</style>
