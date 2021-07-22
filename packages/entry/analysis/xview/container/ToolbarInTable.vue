<template>
    <div>
        <btn
            :class="['size-small', 'border-none']"
            :items="[{ iconType: iconTypes.column }]"
            :pressed="showColumnMenu"
            :tooltip-options="{ message: i18n.manageTableColumns }"
            @click="onClickManageColumns()"
        ></btn>
        <btn
            :class="['size-small', 'border-none']"
            :items="[{ iconType: iconTypes.arrowDownward }]"
            :tooltip-options="{ message: i18n.manageTableColumns }"
            @click="onClickDownload()"
        ></btn>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'ToolbarInTable',
    components: {
        Btn,
    },
    data() {
        return {
            iconType: {
                column: ICON_TYPE.column,
                arrowDownward: ICON_TYPE.arrowDownward,
            },
        };
    },
    methods: {
        onClickDownload() {},
        onClickManageColumns() {},
    },
    created() {},
};
</script>

<style scoped></style>
