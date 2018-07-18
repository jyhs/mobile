import {Tab, TabItem, XInput, Selector, Group, Divider} from 'vux';
import Login from '../../../components/Login.vue';
import Register from '../../../components/Register.vue';

export default {
    data () {
        return {
            index: 0,
            showWechatLogin: false,
            wechatLoginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6edb9c7695fb8375&redirect_uri=https://group.huanjiaohu.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
            isWechat: true,
        };
    },

    components: {
        Tab,
        TabItem,
        XInput,
        Selector,
        Group,
        Login,
        Register, 
        Divider
    },

    activated() {
        this.isWechat = /MicroMessenger/.test(navigator.userAgent);
    },

    methods: {
        handleTabItemClick (index) {
            this.index = index;
        },

        handleActions(item, actionType) {
            switch(actionType) {
                case 'wechatLogin':
                    window.sessionStorage.removeItem(`SeawaterTabActiveIndex`);
                    window.location.href = this.wechatLoginUrl;
                    break;
                case 'return':
                    window.sessionStorage.removeItem(`SeawaterTabActiveIndex`);
                    window.location.href = '/';
                    break;
                default:
                    break;
            }
        }
    }
};
