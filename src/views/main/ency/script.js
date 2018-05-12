import {mapActions} from 'vuex';
import {ViewBox, Tab, TabItem, Icon, Grid, GridItem, Sticky, Rater, Group, PopupPicker} from 'vux';
import {SmallImageBasePath} from '../../../constants/index';

const shareTypes = [{
    name: '微信',
    value: 'wechat'
}, {
    name: 'QQ',
    value: 'qq'
}, {
    name: '微博',
    value: 'weibo'
}];

export default {
    data () {
        return {
            activeTab: 'tj',
            types: [],
            activeType: 'all',
            encyList: [],
            showSharePicker: false,
            shareTypes: shareTypes,
            shareType: [],
            currentItem: {}
        }
    },
    components: {
        ViewBox,
        Tab,
        TabItem,
        Icon,
        Grid,
        GridItem,
        Sticky,
        Rater,
        Group,
        PopupPicker
    },

    async created() {
        this.encyList = await this.getEncyRandomList({number: 20});
        for (let ency of this.encyList) {
            this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
        }
    },

    methods: {
        ...mapActions([
            'getTypesByCategoryCode',
            'getEncyRandomList',
            'getEncyList',
            'getSmallEncyImageById'
        ]),

        async handleTabItemClick (type) {
            this.activeTab = type;
            if (type !== 'tj') {
                const types = await this.getTypesByCategoryCode({categoryCode: type});
                this.types = [{
                    name: '全部',
                    code: 'all'
                }, ...types];
            } else {
                this.types = [];
                this.encyList = await this.getEncyRandomList({number: 20});
                for (let ency of this.encyList) {
                    this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
                }
            }
        },

        handleActions(item, actionType) {
            switch (actionType) {
                case 'share':
                    this.currentItem = item;
                    this.showSharePicker = true;
                    break;
                case 'encyDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: item.id
                        }
                    });
                    break;
                default:
                    break;
            }
        },

        async handleTypeChange(type) {
            this.activeType = type.code;
            this.$vux.loading.show({
                text: '努力加载中'
            });
            let result = [];
            try {
                result = await this.getEncyList({type: type.code, page: 1, size: 1000});
                this.encyList = result['materials'] || [];
            } catch (error) {
                console.error(error);
            }
            this.$vux.loading.hide();
        },

        handleShareTypeChange(shareType) {
            this.shareType = shareType;
        },

        handleCloseSharePicker(closeType) {
            if (closeType) {
                console.log('shareType', this.shareType);
            }
        },

        mapLevel(levelCode) {
            switch (levelCode) {
                case 'ry':
                    return 1;
                case 'yb':
                    return 3;
                case 'kn':
                    return 5;
            }
        }
    }
};
