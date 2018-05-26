import {Tab, TabItem, XInput, Selector, Group} from 'vux';
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
        handleTabItemClick (index) {
            this.index = index;
        }
    }
};
