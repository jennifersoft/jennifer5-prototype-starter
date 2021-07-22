<template>
    <list-selector :title-label="i18n.errorType"
                   :list="errorTypes"
                   :multi-select="true"
                   ref="r"
                   @check="onSelect"/>
</template>

<script>
    import ListSelector from "@vuejs/component/ListSelector/ListSelector";
    import {ErrorTypeDef} from "@common/definition";

    export default {
        name: "ErrorTypeSelector",
        components: {
            ListSelector
        },
        inject: {
            i18n: {
                default: () => ({
                    errorType: 'errorType',
                })
            }
        },
        data() {
            return {
                errorTypes: Object.keys(ErrorTypeDef).map(key => ({ label: key, value: ErrorTypeDef[key] }))
            }
        },
        methods: {
            onSelect(list) {
                this.$emit('change', list);
            },
            unselectAll() {
                this.$refs.r.uncheckAll();
                this.$emit('change', []);
            }
        }
    }
</script>

<style scoped>

</style>