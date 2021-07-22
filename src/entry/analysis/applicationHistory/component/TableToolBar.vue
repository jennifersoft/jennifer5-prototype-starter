<template>
    <div class="table-tool-bar">
        <search
            small
            :width="140"
            :placeholder="i18n.resourceType"
            v-model="typeFilter"
            @search="emitFilteringValues"
            @clear="emitFilteringValues"
        ></search>
        <search
            small
            :width="200"
            :placeholder="i18n.resourceName"
            v-model="nameFilter"
            @search="emitFilteringValues"
            @clear="emitFilteringValues"
        ></search>
    </div>
</template>

<script>
import Search from '@vuejs/component/Input/Search';

export default {
    inject: ['i18n'],
    components: { Search },
    data() {
        return {
            typeFilter: '',
            nameFilter: '',
        };
    },
    methods: {
        emitFilteringValues() {
            this.$emit('change-filter', {
                type: this.typeFilter,
                name: this.nameFilter,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.table-tool-bar {
    ::v-deep .input-field-wrapper {
        margin-right: 6px;
    }
}
</style>
