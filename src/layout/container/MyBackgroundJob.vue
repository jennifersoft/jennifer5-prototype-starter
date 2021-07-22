<template>
    <window
        animation-name="fade-down"
        :open-x="offsetX"
        :open-y="offsetY"
        :open-w="width"
        :open-h="height"
        hide-footer
        @cancel="$emit('close')"
    >
        <template #subject>
            <span>{{ i18n.myBackgroundJob }}</span>
        </template>
        <div class="bg-job-content">
            <div class="btn-group">
                <btn
                    :items="[{ iconType: icons.talk }]"
                    :tooltip-options="{ message: i18n.shareToTalk }"
                    :disabled="!selectedRow"
                    class="transparent"
                    @click="onClickShareToTalk"
                    normal
                />
                <btn
                    :items="[{ iconType: icons.arrowDownward }]"
                    :tooltip-options="{ message: i18n.download }"
                    :disabled="!selectedRow"
                    class="transparent"
                    @click="onClickDownload"
                    normal
                />
                <btn
                    :items="[{ iconType: icons.delete }]"
                    :tooltip-options="{ message: i18n.delete }"
                    :disabled="!selectedRow"
                    class="transparent"
                    @click="onClickDelete"
                    normal
                />
                <btn
                    :items="[{ iconType: icons.refresh }]"
                    :tooltip-options="{
                        message: i18n.refresh,
                        position: 'bottom-right',
                    }"
                    class="transparent"
                    @click="onClickRefresh"
                    normal
                />
            </div>
            <table class="table classic hover large vborderless" ref="table">
                <thead>
                    <tr>
                        <th width="80px">{{ i18n.type }}</th>
                        <th>{{ i18n.fileName }}</th>
                        <th>{{ i18n.creationTime }}</th>
                        <th width="80px">{{ `${i18n.size} (${i18n.kb})` }}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';
import { TEMPLATE_ROW } from '@layout/templates';
import { mapState, mapActions, mapMutations } from '@layout/vuex';
import _ from '@library/lodash';

jui.use(XTableComp);

export default {
    name: 'MyBackgroundJob',
    components: {
        Window,
        Btn,
    },
    inject: {
        i18n: {
            default: {
                myBackgroundJob: 'My Background Job',
                type: 'Type',
                fileName: 'File name',
                creationTime: 'Creation time',
                size: 'Size',
                kb: 'KB',
                shareToTalk: 'Share to TALK',
                download: 'Download',
                delete: 'Delete',
                refresh: 'Refresh',
            },
        },
    },
    props: {
        width: {
            type: Number,
            default: 800,
        },
        height: {
            type: Number,
            default: 576,
        },
    },
    watch: {
        backgroundJobs(list) {
            this.table.update(list);
        },
    },
    computed: {
        ...mapState({
            backgroundJobs: state => state.backgroundJob,
        }),
    },
    data() {
        return {
            selectedRow: null,
            offsetX: window.innerWidth / 2 - this.width / 2,
            offsetY: window.innerHeight / 2 - this.height / 2,
        };
    },
    methods: {
        ...mapActions([
            'fetchBackgroundJob',
            'removeBackgroundJob',
            'downloadBackgroundJob',
            'exportBackgroundJob',
        ]),
        onClickShareToTalk() {
            if (!this.selectedRow) return;
            this.exportBackgroundJob(this.selectedRow);
        },
        onClickDownload() {
            if (!this.selectedRow) return;
            this.downloadBackgroundJob(this.selectedRow);
        },
        async onClickDelete() {
            if (!this.selectedRow) return;
            await this.removeBackgroundJob(this.selectedRow);
            this.onClickRefresh();
        },
        onClickRefresh() {
            this.fetchBackgroundJob();
            this.selectedRow = null;
        },
        onResize: _.debounce(function({ target }) {
            this.offsetX = target.innerWidth / 2 - this.width / 2;
            this.offsetY = target.innerHeight / 2 - this.height / 2;
        }),
    },
    created() {
        this.icons = {
            talk: ICON_TYPE.talk,
            arrowDownward: ICON_TYPE.arrowDownward,
            delete: ICON_TYPE.trashcan,
            refresh: ICON_TYPE.refresh,
        };
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', this.$refs.table, {
            fields: [null, 'name', 'lastModified', 'length'],
            resize: true,
            sort: [1, 2, 3],
            sortCache: true,
            sortLoading: true,
            rowHeight: 35,
            event: {
                sort: setSortEff,
                click: function(row, e) {
                    if (self.selectedRow?.name === row.data.name) {
                        this.unselect(row.index);
                        self.selectedRow = null;
                    } else {
                        this.select(row.index);
                        self.selectedRow = row.data;
                    }
                },
            },
            tpl: {
                row: TEMPLATE_ROW,
            },
        });
        this.table.scrollHeight(this.height - 160);
        window.addEventListener('resize', this.onResize);

        this.fetchBackgroundJob();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
};
</script>

<style lang="scss" scoped>
.bg-job-content {
    > .btn-group {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
    }
    table > tbody {
        cursor: pointer;
    }
}
</style>
