<template>
    <login-wrapper :logo-url="logoUrl" :loading="loading">
        <div class="create-admin">
            <div class="title">{{ i18n.M0480 }}</div>
            <div class="description">
                <span>{{ i18n.M0640 }}</span><br/>
                <span>{{ i18n.M0641 }}</span>
            </div>
            <form class="form-group">
                <div class="field-alert-group">
                    <input-field v-model="id"
                                 :placeholder="i18n.userId"
                                 :invalid="isIdInvalid"
                                 large
                                 @keyup.native.enter="createAdminUser" />
                    <alert v-if="isIdInvalid" :message="alertMessage || ''" type="danger" fade-down />
                </div>
                <input-field v-model="name"
                             :placeholder="i18n.userName"
                             large
                             @keyup.native.enter="createAdminUser" />
                <password-input v-model="password"
                                :placeholder="i18n.password"
                                @keyup.native.enter="createAdminUser"
                                large />
            </form>
            <div class="footer">
                <btn :items="[{ text: i18n.createAdminUser }]"
                     class="primary sign-up-btn" large
                     @click="createAdminUser" />
            </div>
        </div>
    </login-wrapper>
</template>

<script>
import axios from '@library/axios';
import { createFormData } from '@common/utility';
import LoginWrapper from "@entry/user/common/LoginWrapper";
import InputField from "@vuejs/component/Input/InputField";
import PasswordInput from "@entry/user/common/PasswordInput";
import Btn from "@vuejs/component/button/Btn";
import Alert from "@vuejs/component/Alert/Alert";
import { ADMIN_SIGN_UP_STATUS } from "@entry/user/i18n";

export default {
    components: {
        LoginWrapper,
        InputField,
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
    },
    data() {
        return {
            id: '',
            password: '',
            // confirm: '',
            name: '',
            status: null,
            alertMessage: null,
            loading: false,
        };
    },
    computed: {
        isIdInvalid() {
            switch (ADMIN_SIGN_UP_STATUS[this.status]) {
                case 'ID_INVALID':
                case 'ID_SHORT':
                    return true;
            }
            return false;
        }
    },
    methods: {
        async createAdminUser() {
            // if (this.password !== this.confirm) {
            //     alert(this.i18n.M0105);
            //     return;
            // }

            this.loading = true;
            const { data } = await axios.post(
                '/login/user/setup',
                createFormData({
                    ...this.$data,
                })
            );
            this.loading = false;
            if (data == 'M0478') location.href = '/';

            this.status = data;
            this.alertMessage = this.i18n[data];
        },
    },
};
</script>

<style lang="scss">
@import "~@entry/user/styles/font-style.scss";
.create-admin {
    display: flex;
    flex-direction: column;

    .form-group {
        margin: 40px 0;

        > *:not(:last-child) {
            margin-bottom: 16px;
        }
    }
    > .footer {
        display: flex;
        position: relative;
        > .fail-msg {
            position: absolute;
            top: 52px;
            font-size: 12px;
            color: #df2c34;
        }
        .sign-up-btn {
            flex: 1;
        }
    }
    @include font-style;
}
</style>
