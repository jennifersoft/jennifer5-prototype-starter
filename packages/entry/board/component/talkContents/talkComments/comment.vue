<template>
   <div class="comment">
       <div class="subject">
           <span class="writer">{{ writer }}</span>
           <span class="date">{{ date }}</span>
       </div>
       <div class="description" v-html="content"></div>
       <svg-icon v-if="loginId === writer"
               :icon-type="iconType.close"
               :width="iconSize"
               :height="iconSize"
                 @click.native="() => $emit('delete-comment', commentKey)"
       ></svg-icon>
   </div>
</template>

<script>
    import SvgIcon from "@vuejs/component/icon/SvgIcon";
    import { ICON_TYPE } from "@vuejs/component/icon/iconType";

    export default {
        components: {
            SvgIcon
        },
        inject: {
            loginId: {
                default: "root"
            }
        },
        props: {
            commentKey: {
                type: String,
                required: true
            },
            writer: {
                type: String,
                required: true
            },
            date: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                iconType: ICON_TYPE,
                iconSize: 16
            }
        }
    }
</script>

<style lang="scss" scoped>
    .comment {
        padding: 16px 0px;

        > .subject {
            margin-bottom: 10px;

            > .writer {
                font-size: 14px;
                font-weight: bold;
                margin-right: 16px;
            }
            > .date {
                font-size: 12px;
            }
        }

        > .description {
            font-size: 14px;
            width: 99%;
        }

        > svg {
            float: right;
            margin-top: -32px;
            cursor: pointer;
        }
    }
</style>