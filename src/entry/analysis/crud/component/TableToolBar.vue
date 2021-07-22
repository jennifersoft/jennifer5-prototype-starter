<template>
    <div class="table-tool-bar">
        <input-field
            small
            :width="inputWidth"
            :placeholder="i18n.application"
            v-model="applicationFilter"
            @blur="emitFilteringValues"
        ></input-field>

        <input-field
            small
            :width="inputWidth"
            :placeholder="i18n.table"
            v-model="tableFilter"
            @blur="emitFilteringValues"
        ></input-field>
        <btn
            small
            class="primary"
            :items="[{ text: i18n.crudFiltering }]"
            :pressed="showCrudPopup"
            @click="() => (showCrudPopup = !showCrudPopup)"
            v-if="tableFilter !== ''"
        ></btn>
        <window
            :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
            @cancel="() => (showCrudPopup = false)"
            @apply="onApplyCrudFilter"
            v-if="showCrudPopup"
        >
            <template #subject>{{ i18n.crudFiltering }}</template>
            <div class="ckbox">
                <checkbox
                    v-model="crudFilter.C"
                    :label="i18n.crudCreate"
                ></checkbox>
            </div>
            <div class="ckbox">
                <checkbox
                    v-model="crudFilter.R"
                    :label="i18n.crudRead"
                ></checkbox>
            </div>
            <div class="ckbox">
                <checkbox
                    v-model="crudFilter.U"
                    :label="i18n.crudUpdate"
                ></checkbox>
            </div>
            <div class="ckbox">
                <checkbox
                    v-model="crudFilter.D"
                    :label="i18n.crudDelete"
                ></checkbox>
            </div>
        </window>

        <input-field
            small
            :width="inputWidth"
            :placeholder="i18n.databaseFunction"
            v-model="functionFilter"
            @blur="emitFilteringValues"
        ></input-field>
    </div>
</template>

<script>
import InputField from '@vuejs/component/Input/InputField';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Btn from '@vuejs/component/button/Btn';
import Window from '@vuejs/component/window/Window';

export default {
    inject: ['i18n'],
    components: { InputField, Btn, Window, Checkbox },
    data() {
        return {
            inputWidth: 140,
            applicationFilter: '',
            tableFilter: '',
            functionFilter: '',
            crudFilter: {
                C: true,
                R: true,
                U: true,
                D: true,
            },
            showCrudPopup: false,
        };
    },
    methods: {
        emitFilteringValues() {
            this.$emit('change-filter', {
                application: this.applicationFilter,
                table: this.tableFilter,
                function: this.functionFilter,
                crud: this.crudFilter,
            });
        },
        onApplyCrudFilter() {
            this.emitFilteringValues();
            this.showCrudPopup = false;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.table-tool-bar {
    @include themify($themes) {
        position: relative;
        display: flex;

        ::v-deep .input-field-wrapper {
            margin-right: 4px;
        }

        ::v-deep .aries-ui-btn {
            margin-right: 4px;
            margin-left: -5px;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            border-left-width: 0px;
        }

        ::v-deep .aries-ui-window {
            position: absolute;
            width: 300px;
            height: 300px;
            top: 27px;
            left: 143px;

            .ckbox {
                &:not(:last-child) {
                    border-bottom: 1px solid
                        themed('table-tool-bar-crud-popup-border-color');
                }

                padding: 10px;
            }
        }
    }
}
</style>
