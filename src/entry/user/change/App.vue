<template>
    <login-wrapper :logo-url="logoUrl" :loading="loading">
        <div class="pw-change">
            <div class="title">{{ i18n.changePassword }}</div>
            <div class="description" v-html="i18n.M0115"></div>
            <form class="form-group">
                <div class="field-alert-group">
                    <password-input v-model="password"
                                    :placeholder="i18n.currentPassword"
                                    :invalid="isPasswordInvalid"
                                    name="password"
                                    large />
                    <alert v-if="isPasswordInvalid" :message="message || ''" type="danger" fade-down />
                </div>
                <div class="field-alert-group">
                    <password-input v-model="newPassword"
                                    :placeholder="i18n.newPassword"
                                    :invalid="confirmed && isNewPasswordInvalid"
                                    name="newPassword"
                                    large />
                    <alert v-if="confirmed && isNewPasswordInvalid" :message="message || ''" type="danger" fade-down />
                </div>
                <div class="field-alert-group">
                    <password-input v-model="confirmNewPassword"
                                    :placeholder="i18n.confirmNewPassword"
                                    :invalid="!confirmed"
                                    name="confirmNewPassword"
                                    large />
                    <alert v-if="!confirmed" :message="i18n.M0105 || ''" type="danger" fade-down />
                </div>
            </form>
            <div class="footer">
                <btn :items="[{ text: i18n.changePassword }]"
                     @click="submitPassword"
                     class="primary"
                     large />
                <btn v-if="delay"
                     :items="[{ text: i18n.changeNext }]"
                     class="transparent"
                     @click="laterChangePassword"
                     large />
            </div>
        </div>
    </login-wrapper>
</template>

<script>
import axios from '@library/axios';
import LogoutBtn from "@entry/user/common/LogoutBtn";
import LoginWrapper from "@entry/user/common/LoginWrapper";
import PasswordInput from "@entry/user/common/PasswordInput";
import Btn from "@vuejs/component/button/Btn";
import Alert from "@vuejs/component/Alert/Alert";

import { getMessageAlongPolicy, PW_MODIFY_STATUS_MAP } from '../i18n';
import { createFormData } from '@common/utility';

export default {
    components: {
        LogoutBtn,
        LoginWrapper,
        PasswordInput,
        Btn,
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
        userId: {
            type: String,
            required: false,
            default: '',
        },
        delay: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            password: '',
            newPassword: '',
            confirmNewPassword: '',
            modifyStatus: null,
            confirmed: true,
            loading: false,
        };
    },
    computed: {
        isPasswordInvalid() {
            switch (PW_MODIFY_STATUS_MAP[this.modifyStatus?.code]) {
                case 'INVALID_USER':
                case 'PW_NOT_CORRECT':
                    return true;
            }
            return false;
        },
        isNewPasswordInvalid() {
            switch (PW_MODIFY_STATUS_MAP[this.modifyStatus?.code]) {
                case 'PW_SHORT':
                case 'PW_LESS_LOWERCASE':
                case 'PW_LESS_UPPERCASE':
                case 'PW_LESS_DIGIT':
                case 'PW_LESS_SPECIAL':
                    return true;
            }
            return false;
        },
        message() {
            return this.modifyStatus?.message;
        }
    },
    methods: {
        async submitPassword() {
            this.confirmed = this.newPassword === this.confirmNewPassword;
            if (!this.confirmed) return;

            this.loading = true;
            const { data } = await axios.post(
                '/user/modify/password',
                createFormData({
                    id: this.userId,
                    password: this.password,
                    newPassword: this.newPassword,
                })
            );

            if (data === 'M0116') {
                location.href = '/';
                return;
            }

            this.modifyStatus = await getMessageAlongPolicy(data, this.newPassword);
            this.loading = false;
        },
        async laterChangePassword() {
            this.loading = true;
            await axios.post(
                '/user/modify/password/changedate',
                createFormData({
                    id: this.userId,
                })
            );

            location.href = '/';
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~@entry/user/styles/font-style.scss";
.pw-change {
    @include font-style;
    .form-group {
        margin: 40px 0;
        > *:not(:last-child) {
            margin-bottom: 16px;
        }
    }
    .footer {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        > .aries-ui-btn:last-child {
            margin-left: 0;
        }
    }
}
</style>
