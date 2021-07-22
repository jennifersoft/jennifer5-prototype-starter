<template>
    <login-wrapper
        :logo-url="logoUrl"
        :show-footer="isSignIn"
        :expanded="isSignUpForm"
        :loading="loading"
    >
        <succeeded v-if="isSucceeded" @login="goNext" />
        <sign-up
            v-else-if="isSignUpForm"
            :sign-up-status="signUpStatus"
            @submit="submitSignForm"
            @hide="goBack"
        />
        <div class="login-default" v-else>
            <div class="title">{{ i18n.login }}</div>
            <div class="description">
                <template v-if="useSignUp">
                    <span style="margin-right: 8px;">{{ i18n.M0638 }}</span>
                    <span class="link" @click="goNext">
                        {{ i18n.M0492 }}
                    </span>
                </template>
            </div>
            <form
                class="form-group"
                :action="loginUrl"
                method="post"
                ref="loginForm"
            >
                <input-field
                    v-model="userId"
                    name="id"
                    :placeholder="i18n.userId"
                    autocomplete="username"
                    @keyup.enter.native="ifSupportBrowserNLogin"
                    large
                />
                <password-input
                    v-model="userPassword"
                    name="password"
                    :placeholder="i18n.password"
                    @keyup.enter.native="ifSupportBrowserNLogin"
                    large
                />
                <toggle-switch
                    v-if="useAutoLogin"
                    v-model="keepLogin"
                    name="autoLogin"
                    label-position="right"
                    :label="i18n.keepLogin"
                    @change="onChangeAutoLogin"
                />
                <input type="hidden" name="redirect" :value="redirectUrl" />
            </form>
            <div class="footer">
                <btn
                    class="primary login-btn"
                    large
                    :items="[{ text: i18n.login }]"
                    @click="ifSupportBrowserNLogin"
                />
                <alert
                    v-if="!!alertMessage"
                    :message="alertMessage"
                    type="danger"
                    fade-down
                />
            </div>
        </div>
        <modal
            :is-show="showInvalidBrowserLayer"
            :contents-width="340"
            :offset-top="240"
            @apply="login"
            @cancel="() => (showInvalidBrowserLayer = false)"
        >
            <template #subject>
                <span>{{ invalidBrowserTitle }}</span>
            </template>
            <div>
                <span>{{ invalidBrowserTitle }}</span> <br />
                <span>{{ i18n.M0565 }}</span>
            </div>
        </modal>
    </login-wrapper>
</template>

<script>
import axios from '@library/axios';
import { createFormData } from '@common/utility';
import LoginWrapper from '@entry/user/common/LoginWrapper';
import Btn from '@vuejs/component/button/Btn';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import InputField from '@vuejs/component/Input/InputField';
import Modal from '@vuejs/component/window/Modal';
import SignUp from '@entry/user/login/components/SignUp';
import Succeeded from '@entry/user/login/components/Succeeded';
import PasswordInput from '@entry/user/common/PasswordInput';
import { getMessageAlongPolicy } from '@entry/user/i18n';
import Alert from '@vuejs/component/Alert/Alert';

const supportChromeMinimumVersion = 69;
const keepLoginStorageKey = 'autoLogin';

export default {
    components: {
        LoginWrapper,
        SignUp,
        Btn,
        ToggleSwitch,
        InputField,
        Modal,
        PasswordInput,
        Succeeded,
        Alert,
    },
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        logoUrl: {
            type: String,
            required: true,
        },
        redirectUrl: {
            type: String,
            required: true,
        },
        useSignUp: {
            type: Boolean,
            required: true,
        },
        useAutoLogin: {
            type: Boolean,
            required: true,
        },
        messageKey: {
            type: String,
            required: false,
            default: '',
        },
    },
    computed: {
        loginSucceeded() {
            return this.messageKey === '';
        },
        isSucceeded() {
            return this.sequence === 2;
        },
        isSignUpForm() {
            return this.sequence === 1;
        },
        isSignIn() {
            return this.sequence === 0;
        },
        isFieldsValid() {
            // JQA-881: 크로미움 기반 브라우저에서 autofill 버그가 있어서 버튼에 비활성화 처리하지 않음.
            return this.userId.length > 0 && this.userPassword.length > 0;
        },
    },
    data() {
        const autoLogin = this.checkedAutoLogin();

        return {
            userId: '',
            userPassword: '',
            keepLogin: autoLogin,
            loginUrl: autoLogin ? '/login/auto' : '/login/page',

            invalidBrowserTitle: '',
            showInvalidBrowserLayer: false,
            signUpSucceeded: false,

            sequence: 0,
            alertMessage:
                this.messageKey === '' ? null : this.i18n[this.messageKey],
            signUpStatus: null,
            loading: false,
        };
    },
    methods: {
        async login() {
            if (!this.keepLogin) {
                if (this.userId === '') {
                    this.alertMessage = this.i18n.M0001;
                    return;
                }

                if (this.userPassword === '') {
                    this.alertMessage = this.i18n.M0002;
                    return;
                }

                this.loading = true;
                const { data } = await axios.post(
                    '/login/duplicate',
                    createFormData({
                        format: 'json',
                        id: this.userId,
                    })
                );
                this.loading = false;

                if (data === true) this.alertMessage = this.i18n.M0292;
            }

            this.$refs.loginForm.submit();
        },
        async submitSignForm(payload) {
            this.loading = true;
            const { data } = await axios.post(
                '/login/user/save',
                createFormData(payload)
            );

            if (data === 'M0107') this.sequence++;
            this.signUpStatus = await getMessageAlongPolicy(
                data,
                payload.password
            );
            this.loading = false;
        },
        ifSupportBrowserNLogin() {
            if (!this.isSupportBrowserVersion()) {
                this.invalidBrowserTitle = this.i18n.M0564.replace(
                    '%d',
                    supportChromeMinimumVersion
                );
                this.showInvalidBrowserLayer = true;
            } else {
                this.login();
            }
        },
        isSupportBrowserVersion() {
            const version = this.getChromeVersion();
            return version !== false && version >= supportChromeMinimumVersion;
        },
        getChromeVersion() {
            const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            return raw ? parseInt(raw[2], 10) : false;
        },
        onChangeAutoLogin(checked) {
            // 브라우저 종료 시에도 유지되어야 하기 때문에 localStorage를 사용한다.
            localStorage.setItem(keepLoginStorageKey, checked);
        },
        checkedAutoLogin() {
            if (this.messageKey !== '') {
                localStorage.removeItem(keepLoginStorageKey);
                return false;
            }

            return localStorage.getItem(keepLoginStorageKey) === 'true';
        },
        goNext() {
            this.sequence++;
            if (this.sequence > 2) this.sequence = 0;
            this.signUpStatus = null;
            this.alertMessage = null;
        },
        goBack() {
            this.sequence--;
            this.signUpStatus = null;
            this.alertMessage = null;
        },
    },
    mounted() {
        if (this.loginSucceeded && this.keepLogin) this.login();
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/user/styles/font-style.scss';
.login-default {
    display: flex;
    flex-direction: column;

    @include font-style;

    .form-group {
        margin: 40px 0;
        > :first-child {
            margin-bottom: 16px;
        }
        > .aries-switch-wrapper {
            margin-top: 40px;
        }
    }
    .footer {
        margin-bottom: 40px;
        display: flex;
        flex-direction: column;
    }
}
</style>
