import {mapActions} from 'vuex';
import {Card} from 'vux';

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            avatarImgPath: ''
        };
    },

    components: {
        Card
    },

    created() {
        this.initData();
    },

    mounted() {
        const ele = document.getElementById('loading');
        ele.style.display = 'none';
    },

    methods: {
        ...mapActions([
            'getGroupList',
            'finishGroupByIdAndUserId'
        ]),

        async initData() {
            const result = await this.getGroupList({
                page: 1,
                size: 1000,
                userId: this.currentUserId
            });
            this.groups = result.res || [];
        },

        handleDataRefresh(done) {
            this.initData();
            done();
        },

        upload() {}
    }
};