<template>
    <div class="tool-side-tab">
        <div
            :class="['menu', activeTab == 'line' ? 'active' : '']"
            @click="() => $emit('change-tab', 'line')"
        >
            {{ i18n.line }}
        </div>
        <div
            :class="['menu', activeTab == 'pie' ? 'active' : '']"
            @click="() => $emit('change-tab', 'pie')"
        >
            {{ i18n.pie }}
        </div>
        <div
            :class="['menu', activeTab == 'bar' ? 'active' : '']"
            @click="() => $emit('change-tab', 'bar')"
        >
            {{ i18n.bar }}
        </div>
    </div>
</template>

<script>
export default {
    inject: {
        i18n: {
            default: {
                line: 'Line',
                pie: 'Pie',
                bar: 'Bar',
            },
        },
    },
    props: {
        activeTab: {
            type: String,
            required: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.tool-side-tab {
    line-height: 39px;

    > .menu {
        display: inline-block;
        height: 39px;
        padding: 0px 14px;
        font-size: 14px;
        &:not(.active) {
            cursor: pointer;
        }
    }
}
</style>
