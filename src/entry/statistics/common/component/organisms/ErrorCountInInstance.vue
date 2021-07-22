<template>
    <section id="error-count-in-instance">
        <h3>{{chapterNumber}}. {{title}} </h3>

        <div class="head">
            <progress-bar :progress="progress" />
            <table class="table simple headline">
                <thead>
                <tr>
                    <th v-for="column in columns">
                        {{column.name}}
                    </th>
                </tr>

                </thead>
                <tbody>
                <tr v-for="(row, rowIndex) in errorData">
                    <td v-for="(column, columnIndex) in columns" >
                        <div v-if="(column.key === 'name' || column.key === 'errorTypeName')">
                            {{row[column.key]}}
                        </div>
                        <div v-else>
                            {{row[column.key].toLocaleForAries()}}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    import { createNamespacedHelpers } from "vuex";
    import { OTypeDef } from "@common/definition";
    import ProgressBar from "@vuejs/component/Loading/ProgressBar";

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('statistics');

    export default {
        name: "errorCountInInstance",
        components: {
            ProgressBar,
        },
        props: {
            chapterNumber: {
                type: Number,
                required: false,
                default: 4
            }
        },
        inject: {
            otype: {
                default: OTypeDef.SYSTEM,
            },
        },
        data() {
            return {
                i18n: {
                    instanceErrorCount: i18n.get("ui.label.instanceErrorCount"),
                    businessErrorCount: i18n.get("ui.label.businessErrorCount"),
                }
            }
        },
        computed: {
            ...mapState({
                progress: state => state.progressForErrorData,
                errorData: state => state.errorData,
            }),

            columns() {
                return [
                    {key: "name", name: (this.otype === OTypeDef.BUSINESS)? i18n.get("ui.label.business") : i18n.get("ui.label.instance")},
                    {key: "errorTypeName", name: i18n.get("ui.label.errorType")},
                    {key: "count", name: i18n.get("ui.label.errorCount")},
                ];
            },

            title() {
                return (this.otype === OTypeDef.BUSINESS)? this.i18n.businessErrorCount : this.i18n.instanceErrorCount;
            }

        }
    };
</script>
<style lang="scss" scoped>
    table {
        tr > td:last-child {
            text-align: right;
        }
    }

</style>