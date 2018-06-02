<template>
    <div class="login-block">
        <div class="login f13 box-sizing p-l-20 p-r-20 clearfix">
            <input class="box-sizing input m-t-9 m-b-9 f14" placeholder="请输入用户名"
                   v-model="loginForm.name"
            />
            <input type="password" class="box-sizing input m-b-9 f14" minlength="6"
                   maxlength="20" placeholder="请输入密码"
                   v-model="loginForm.password"
            />
            <div v-if="loginHasError" style="position: relative">
                <input class="box-sizing input m-b-9 f14 phone-input" minlength="11" maxlength="11"
                       placeholder="请输入手机号" v-model="loginForm.phone"
                />
                <button class="verify-code-btn" :disabled="countDown.isStart"
                        @click.prevent.stop="sendVerifyCode">
                    <CountDown
                            :is-start="countDown.isStart"
                            :seconds="120"
                            initContent="获取短信验证码"
                            afterContent="重新获取验证码"
                            :on-count-end="handleCountEnd"
                    >
                    </CountDown>
                </button>
            </div>
            <input v-if="loginHasError" class="box-sizing input m-b-9 f14" minlength="4" maxlength="4"
                   placeholder="请输入短信验证码" v-model="loginForm.auth"
            />
            <button v-if="loginEnabled" class="btn btn-default btn-large" @click="handleLogin">
                马上登录
            </button>
            <button class="btn btn-disabled btn-large" v-else>马上登录</button>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import CountDown from './CountDown.vue';
    import RegExp from '../constants/regExp';

    export default {
        name: 'Login',
        data () {
            return {
                loginForm: {
                    name: '',
                    password: '',
                    phone: '',
                    auth: ''
                },
                loginEnabled: true,
                inputHasErrorNum: Number(window.sessionStorage.getItem('SeaWaterInputHasErrorNum')) || 0,
                loginHasError: Boolean(window.sessionStorage.getItem('SeaWaterLoginHasError')) || false,
                countDown: {
                    isStart: false
                },
                requestId: ''
            };
        },

        components: {
            CountDown
        },

        methods: {
            ...mapActions([
                'sendVerification',
                'login'
            ]),

            handleCountEnd() {
                this.countDown.isStart = false;
            },

            async sendVerifyCode() {
                if (!this.validSendCode()) {
                    return;
                }

                this.$vux.loading.show({
                    text: '短信发送中'
                });
                let result = {};
                try {
                    result = await this.sendVerification({
                        phone: this.loginForm.phone
                    });
                } catch (error) {
                    console.error(error);
                }
                this.$vux.loading.hide();

                if (result.status === 'ok') {
                    this.requestId = result.requestId;
                    this.$vux.toast.show({
                        type: 'success',
                        text: '发送短信验证码成功，请查收'
                    });
                    this.countDown.isStart = true;
                } else {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '发送短信验证码失败，请稍后重试'
                    });
                }
            },

            async handleLogin() {
                if (!this.validLogin()) {
                    return;
                }

                this.loginEnabled = false;
                this.$vux.loading.show({
                    text: '努力加载中'
                });
                let result = {};
                try {
                    const sendInfo = Object.assign({}, this.loginForm, {
                        requestId: this.requestId || 'defaultRequestId',
                        is_error: this.loginHasError,
                        auth: this.loginForm.auth || '1234',
                        phone: this.loginForm.phone || '00000000000'
                    });
                    result = await this.login(sendInfo);
                } catch (error) {
                    console.error(error);
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '输入错误，请重试',
                        time: 3000
                    });
                    this.inputHasErrorNum++;
                    window.sessionStorage.setItem('SeaWaterInputHasErrorNum', this.inputHasErrorNum);
                    this.loginForm.password = '';
                    this.loginForm.phone = '';
                    this.loginForm.auth = '';
                    if (this.inputHasErrorNum === 3) {
                        this.loginHasError = true;
                        window.sessionStorage.setItem('SeaWaterLoginHasError', true);
                    }
                }
                this.$vux.loading.hide();
                this.loginEnabled = true;

                if (result.status === 'ok') {
                    this.$vux.toast.show({
                        text: '登录成功'
                    });
                    this.loginHasError = false;
                    window.location.href = '/';
                    window.localStorage.setItem('SeawaterAuthorization', result.token);
                    window.localStorage.setItem('SeawaterLoginUserId', result.id);
                    window.sessionStorage.removeItem('SeaWaterInputHasErrorNum');
                    window.sessionStorage.removeItem('SeaWaterLoginHasError');
                }
            },

            validSendCode() {
                const {name, password, phone} = this.loginForm;

                if (!name) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '用户名不能为空'
                    });
                    return false;
                }
                if (!password) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '密码不能为空'
                    });
                    return false;
                }
                if (!phone) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '手机号不能为空'
                    });
                    return false;
                } else if (!RegExp.PhoneReg.test(phone)) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '请填写正确的手机号'
                    });
                    return false;
                }

                return true;
            },

            validLogin() {
                const {name, password} = this.loginForm;

                if (!name) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '用户名不能为空'
                    });
                    return false;
                }
                if (!password) {
                    this.$vux.toast.show({
                        type: 'warn',
                        text: '密码不能为空'
                    });
                    return false;
                }

                if (this.loginHasError) {
                    const {phone, auth} = this.loginForm;

                    if (!phone) {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '手机号不能为空'
                        });
                        return false;
                    } else if (!RegExp.PhoneReg.test(phone)) {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '请填写正确的手机号'
                        });
                        return false;
                    }
                    if (!auth) {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: '短信验证码不能为空'
                        });
                        return false;
                    }
                }

                return true;
            }
        }
    };
</script>
<style lang="less">
    .login-block {
        background-color: #fff;
        border-radius: 8px;
        margin-bottom: 34px;
        .login {
            color: #7b7b7b;
            .verify-code-btn {
                position: absolute;
                right: 0;
                top: 0;
                width: 40%;
                height: 38px;
                line-height: 38px;
                background-color: #20a0ff;
                color: #fff;
                padding: 0 5px;
                border-radius: 5px;
                text-decoration: none;
                border: none;
                cursor: pointer;
                outline: none;
                &:disabled {
                    background-color: #999;
                }
            }
            .phone-input {
                width: 55%;
            }
            .btn-default {
                background: linear-gradient(#0099E8, #027FF3);
                background-color: #027FF3;
                color: #fff;
                line-height: 44px;
            }
            .btn-large {
                width: 100%;
                height: 40px;
                line-height: 40px;
            }
            .btn-disabled {
                background-color: #CCC;
            }
        }
        .input {
            height: 40px;
            background-color: #f3f4f5;
            color: #027FF3;
            padding: 0 15px;
            border-radius: 4px;
        }
        .input:focus {
            border-color: #027FF3;
        }
    }
</style>
