import {Tab, TabItem, XInput, Selector, Group} from 'vux';
import {mapActions} from 'vuex';
import Login from '../../../components/Login.vue';
import Register from '../../../components/Register.vue';

export default {
    data () {
        return {
            index: 0,
        };
    },

    components: {
        Tab,
        TabItem,
        XInput,
        Selector,
        Group,
        Login,
        Register
    },

    methods: {
        ...mapActions([
            'loadingShow',
        ]),

        handleTabItemClick (index) {
            this.index = index;
            this.updateAuth();
        },

        updateAuth () {
            this.authSVG = this.authSVG.replace(/\?.*/ig, '') + '?' + Math.random();
        },

        async handleLogin () {
            this.$vux.loading.show({
                text: '努力加载中'
            });
            let result = {};
            try {
                result = await this.login({
                    name: this.loginForm.name,
                    password: this.loginForm.password,
                    auth: this.loginForm.auth
                });
            } catch(error) {
                console.error(error);
            }
            this.$vux.loading.hide();
            this.$vux.loading.hide();

            if (result.status === 'ok') {
                this.$vux.toast.show({
                    text: '登录成功'
                });
                this.$router.push('/');
                localStorage.setItem('Authorization', result.token);
            } else {
                this.updateAuth();
            }
        },

        async handleRegister () {
            const validateResult = Validator.groupValidator(this.$refs['registerForm'].$children);
            if (!validateResult.status) {
                this.$vux.toast.show({
                    text: validateResult.errorMsg,
                    type: 'warn',
                    time: 3000
                });
                return;
            }

            const valid = await this.validateMore();
            if (valid) {
                this.$vux.loading.show({
                    text: '努力加载中'
                });
                let result = {};
                try {
                    result = await this.register({
                        name: this.registerForm.name,
                        password1: this.registerForm.password1,
                        password2: this.registerForm.password2,
                        city: this.registerForm.city,
                        phone: this.registerForm.phone,
                        auth: this.registerForm.auth
                    });
                } catch(error) {
                    console.error(error);
                }
                this.$vux.loading.hide();

                if (result.status === 'ok') {
                    this.$vux.toast.show({
                        text: '注册成功，请登录'
                    });
                    this.loginForm.name = this.registerForm.name;
                    this.index = 0;
                } else {
                    this.updateAuth();
                }
            }
        },

        async validateMore () {
            const {city} = this.registerForm;

            if (!city) {
                this.$vux.toast.show({
                    text: '请选择城市',
                    type: 'warn',
                    time: 3000
                });
                return false;
            }
            if (!this.validatePass()) {
                return false;
            }

            return await this.validateUsername();
        },

        async validateUsername () {
            const {name} = this.registerForm;

            if (!name) {
                return true;
            }

            let result = {};
            try {
                result = await this.checkUsername({name: this.registerForm.name});
            } catch(error) {
                console.error(error);
            }

            return result.status === 'ok';
        },

        validatePass () {
            const {password1, password2} = this.registerForm;

            if (password1 !== password2) {
                this.$vux.toast.show({
                    text: '输入密码不一致',
                    type: 'warn',
                    time: 3000
                });
                return false;
            }

            return true;
        }
    }
};
