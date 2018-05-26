import {mapActions} from 'vuex';
import {Badge} from 'vux';

export default {
    data() {
        return {
            bill: {},
            details: []
        };
    },

    components: {
        Badge
    },

    async created() {
        const {id} = this.$route.params;

        this.$vux.loading.show({
            text: '努力加载中'
        });
        this.bill = (await this.getBillById({id}));
        this.details = await this.getDetailsByBillId({id: this.bill.id}) || [];
        this.$vux.loading.hide();
    },

    mounted() {
        const ele = document.getElementById('loading');
        ele.style.display = 'none';
    },

    methods: {
        ...mapActions([
            'getBillById',
            'getDetailsByBillId'
        ]),

        async handleDataRefresh(done) {
            const {id} = this.$route.params;
            this.bill = (await this.getBillById({id}));
            done();
        }
    }
};