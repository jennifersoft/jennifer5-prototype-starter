<template>
    <div v-if="contentType == 'html'" class="output" v-html="output" :style="{ height: height+'px', 'max-height': height+'px' }"></div>
    <pre v-else class="output" :style="{ height: height+'px', 'max-height': height+'px' }">{{ output }}</pre>
</template>

<script>
    import { getDayjs, serverDateFormat } from "@common/base"

    export default {
        name: "templateOutput",
        props: {
            contentType: {
                type: String,
                required: false,
                default: 'html'
            },
            subject: {
                type: String,
                required: true
            },
            json: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            },
            height: {
                type: Number,
                required: false,
                default: 360
            }
        },
        computed: {
            sampleData() {
                if(this.json == "") return {};
                return JSON.parse(this.json);
            },
            output() {
                let code = this.code;
                code = code.replace("%subject", this.subject);
                code = code.replace("%deliveryTime", getDayjs().format(serverDateFormat.longWithSec));
                code = code.replace("%domainId", this.sampleData.domainId);
                code = code.replace("%domainName", this.sampleData.domainName);
                code = code.replace("%instanceId", this.sampleData.instanceId);
                code = code.replace("%instanceName", this.sampleData.instanceName != null ? this.sampleData.instanceName : "");
                code = code.replace("%businessName", this.sampleData.businessName != null ? this.sampleData.businessName : "");
                code = code.replace("%value", this.sampleData.value);
                code = code.replace("%time", getDayjs(this.sampleData.time).format(serverDateFormat.longWithSec));
                code = code.replace("%metricsName", this.sampleData.metricsName);
                code = code.replace("%errorType", this.sampleData.errorType);
                code = code.replace("%eventLevel", this.sampleData.eventLevel);
                code = code.replace("%otype", this.sampleData.otype);
                code = code.replace("%serviceName", this.sampleData.serviceName);
                code = code.replace("%message", this.sampleData.message);
                code = code.replace("%detailMessage", this.sampleData.detailMessage);
                code = code.replace("%customMessage", this.sampleData.customMessage);
                return code;
            }
        },
        mounted() {
            this.$emit("ready");
        }
    }
</script>

<style scoped>
    .output {
        overflow-y: auto;
    }
</style>