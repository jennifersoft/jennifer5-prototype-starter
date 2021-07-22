<template>
    <div class="xtable nowrap" ref="table">
        <window
            v-if="showDetailPopup"
            :open-w="610"
            :open-h="440"
            :open-x="96"
            :open-y="popupOffset"
            hide-footer
            @cancel="closePopup"
        >
            <template #subject>
                <span>{{ popupOptions.data.subject }}</span>
            </template>
            <div style="overflow: auto; height: 364px;">
                {{ formattedTime(popupOptions.data.time) }}<br /><br />
                {{ popupOptions.data.detailMessage }}
            </div>
        </window>
        <table class="table simple headline hover stripeless list-table">
            <thead>
                <tr>
                    <th>{{ i18n.eventLevel }}</th>
                    <th>{{ i18n.time }}</th>
                    <th>{{ i18n.target }}</th>
                    <th>{{ i18n.eventType }}</th>
                    <th>{{ i18n.message }}</th>
                    <th>{{ i18n.value }}</th>
                    <th>{{ i18n.transaction }}</th>
                    <th>{{ i18n.application }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import {
    setSortEff,
    getEventData,
    openXViewPopupForEvent,
} from '@common/utility';
import Window from '@vuejs/component/window/Window';
import { getDayjs } from '@common/base';
import { TEMPLATE_ROW_LIST } from "@entry/analysis/dbmetrics/event/templates";

jui.use(XTableComp);

export default {
    name: 'DbEventTable',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                time: 'time',
                target: 'target',
                eventType: 'eventType',
                eventLevel: 'eventLevel',
                count: 'count',
                message: 'message',
                value: 'value',
                transaction: 'transaction',
                application: 'application',
            }),
        },
    },
    components: { Window },
    props: {
        list: {
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        popupOffset: {
            type: Number,
            required: true,
        },
    },
    watch: {
        list(next) {
            this.showDetailPopup = false;
            this.table.update(next);
        },
        height(next, prev) {
            if (!!this.$refs.table && next !== prev)
                this.table.scrollHeight(next);
        },
    },
    data() {
        return {
            showDetailPopup: false,
            popupOptions: {
                data: null,
            },
        };
    },
    methods: {
        openEventDetail(e, data) {
            const { clientX, clientY } = e;
            this.$set(this.popupOptions, 'data', getEventData(data));
            this.showDetailPopup = true;
        },
        formattedTime(time) {
            return getDayjs(time).format('YYYY-MM-DD HH:mm:ss');
        },
        closePopup() {
            if (this.showDetailPopup) this.showDetailPopup = false;
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: [
                'eventLevelName',
                'time',
                'name',
                'errorTypeName',
                'newMessage',
                'value',
                null,
                'serviceName',
            ],
            resize: true,
            rowHeight: 25,
            sort: [0, 1, 2, 3, 4, 5, 7],
            sortCache: true,
            event: {
                select: function(row, e) {
                    const { data } = row;
                    const { target } = e;
                    if (target.classList.contains('link')) {
                        if (target.classList.contains('more')) {
                            self.openEventDetail(e, data);
                        } else if (target.classList.contains('transaction')) {
                            const { sid, time, relevantTxId } = data;
                            openXViewPopupForEvent(sid, time, relevantTxId);
                        }
                    }
                },
                sort: function(column, e) {
                    setSortEff(column, e, true);
                },
            },
            tpl: {
                row: TEMPLATE_ROW_LIST,
            },
        });
        this.table.scrollHeight(this.height);
    },
    beforeDestroy() {
        this.showDetailPopup = false;
    },
};
</script>

<style lang="scss" scoped>
@import "~@entry/analysis/dbmetrics/event/styles/table-style.scss";
.list-table ::v-deep {
    @include table-style;
}
</style>
