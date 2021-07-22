<template>
    <div class="sign-up">
        <div class="title">{{ i18n.M0497 }}</div>
        <div class="sign-in-msg">
            <span style="margin-right: 8px;">{{ i18n.M0639 }}</span>
            <span class="link"
                  @click="$emit('hide')">
                {{ i18n.login }}
            </span>
        </div>
        <form class="form-group">
            <div class="sub-title">{{ i18n.requiredFields }}</div>
            <div class="field-alert-group">
                <input-field v-model="id"
                             name="id"
                             autocomplete="username"
                             :placeholder="i18n.userId"
                             :invalid="isIDInvalid"
                             large />
                <alert v-if="isIDInvalid" :message="message || ''" type="danger" fade-down />
            </div>
            <input-field v-model="name"
                         name="name"
                         autocomplete="off"
                         :placeholder="i18n.userName"
                         large />
            <div class="field-alert-group">
                <password-input v-model="password"
                                name="password"
                                autocomplete="new-password"
                                :placeholder="i18n.password"
                                :invalid="isPasswordInvalid"
                                large />
                <alert v-if="isPasswordInvalid" :message="message || ''" type="danger" fade-down />
            </div>
            <div class="sub-title">{{ i18n.optionalFields }}</div>
            <input-field v-model="company"
                         :placeholder="i18n.company"
                         large />
            <div class="inline">
                <input-field v-model="dept"
                             :placeholder="i18n.dept"
                             large />
                <input-field v-model="jobTitle"
                             :placeholder="i18n.jobTitle"
                             large />
            </div>
            <div class="field-alert-group">
                <input-field v-model="cellphone"
                             :invalid="isPhoneInvalid"
                             :placeholder="i18n.cellphone"
                             large />
                <alert v-if="isPhoneInvalid" :message="i18n.M0300" type="danger" fade-down />
            </div>
            <div class="field-alert-group">
                <input-field v-model="email"
                             :invalid="isEmailInvalid"
                             :placeholder="i18n.email"
                             large />
                <alert v-if="isEmailInvalid" :message="i18n.M0299" type="danger" fade-down />
            </div>
        </form>
        <div class="footer">
            <btn :items="[{ text: i18n.joinIn }]"
                 :disabled="!allRequired"
                 class="primary sign-up-btn" large
                 @click="submitSignForm"/>
        </div>
    </div>
</template>

<script>
import { validCheckEmail, validCheckCellphone } from '@common/utility';
import Btn from "@vuejs/component/button/Btn";
import InputField from "@vuejs/component/Input/InputField";
import PasswordInput from "@entry/user/common/PasswordInput";
import Alert from "@vuejs/component/Alert/Alert";
import { SIGN_UP_STATUS_MAP } from "@entry/user/i18n";

export default {
    name: "SignUp",
    components: {
        Btn,
        InputField,
        PasswordInput,
        Alert,
    },
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        signUpStatus: {
            type: Object,
            default: null,
        }
    },
    methods: {
        async submitSignForm() {
            if (this.isPhoneInvalid || this.isEmailInvalid) return;
            this.invalidMessage = null;

            this.$emit('submit', { ...this.$data });
        },
    },
    computed: {
        allRequired() {
            return this.id.length > 0
                && this.name.length > 0
                && this.password.length > 0;
        },
        isIDInvalid() {
            const status = SIGN_UP_STATUS_MAP[this.signUpStatus?.code];
            return status === 'INVALID_ID'
                || status === 'ID_ALREADY_EXISTS'
                || status === 'INVALID_USER';
        },
        isPasswordInvalid() {
            const status = SIGN_UP_STATUS_MAP[this.signUpStatus?.code];
            return status === 'PW_SHORT'
                || status === 'PW_LESS_LOWERCASE'
                || status === 'PW_LESS_UPPERCASE'
                || status === 'PW_LESS_DIGIT'
                || status === 'PW_LESS_SPECIAL';
        },
        isPhoneInvalid() {
            return this.cellphone !== '' && !validCheckCellphone(this.cellphone);
        },
        isEmailInvalid() {
            return this.email !== '' && !validCheckEmail(this.email);
        },
        message() {
            return this.signUpStatus?.message;
        }
    },
    data() {
        return {
            id: '',
            name: '',
            password: '',
            // confirm: '',
            company: '',
            dept: '',
            jobTitle: '',
            cellphone: '',
            email: '',
            invalidMessage: null,
        };
    },
    created() {
        this.isEmailValid = validCheckEmail;
        this.isPhoneValid = validCheckCellphone;
        this.statusMap = SIGN_UP_STATUS_MAP;
    },
};
</script>

<style lang="scss" scoped>
.sign-up {

    display: flex;
    flex-direction: column;
    > .title {
        font-size: 32px;
        font-weight: bold;
        color: #212121;
    }
    .form-group {
        flex: 1;
        margin: 40px 0;

        > .sub-title {
            font-size: 14px;
            font-weight: bold;
            color: #212121;
            &:not(:first-child) {
                margin-top: 24px;
            }
        }

        > :not(:first-of-type) {
            margin-top: 16px
        }
        .inline {
            display: flex;
            > :first-child {
                margin-right: 16px;
            }
        }
    }
    .sign-in-msg {
        margin-top: 16px;
        font-size: 16px;
        line-height: 1.5;
        color: #616161;

        .link {
            color: #6e18f8;
            cursor: pointer;
        }
    }

    .footer {
        display: flex;
        justify-content: flex-end;
        position: relative;

        .fail-msg {
            position: absolute;
            bottom: 0;
            right: 120px;
            text-align: right;
            font-size: 12px;
            color: #df2c34;
        }
    }
}
</style>
