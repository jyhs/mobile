import {mapActions} from 'vuex';
import {ViewBox, Search, Tab, TabItem, Icon, Grid, GridItem, Sticky, Rater, Group, PopupPicker} from 'vux';
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
            activeTab: window.sessionStorage.getItem('SeawaterEncyActiveTab') || 'tj',
            types: [],
            activeTypes: {
                tj: '',
                hy: window.sessionStorage.getItem('SeawaterEncyhyActiveType') || 'all',
                rt: window.sessionStorage.getItem('SeawaterEncyrtActiveType') || 'all',
                yg: window.sessionStorage.getItem('SeawaterEncyygActiveType') || 'all',
                qt: window.sessionStorage.getItem('SeawaterEncyqtActiveType') || 'all'
            },
            encyList: [],
            showSharePicker: false,
            shareTypes: shareTypes,
            shareType: [],
            currentItem: {},
            searching: false,
            searchText: '',
            searchTimer: null
        }
    },
    components: {
        ViewBox,
        Search,
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

    created() {
        this.initRandomEncyList(this.activeTab);
    },

    methods: {
        ...mapActions([
            'getTypesByCategoryCode',
            'getEncyRandomList',
            'getEncyList',
            'getSmallEncyImageById'
        ]),

        async initRandomEncyList(type) {
            if (type !== 'tj') {
                const types = await this.getTypesByCategoryCode({categoryCode: type});
                this.types = [{
                    name: '全部',
                    code: 'all'
                }, ...types];
                this.initEncyListInType(this.activeTypes[this.activeTab]);
            } else {
                this.types = [];
                this.encyList = await this.getEncyRandomList({number: 20});
                for (let ency of this.encyList) {
                    this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
                }
            }
        },

        async initEncyListInType(type) {
            this.$vux.loading.show({
                text: '努力加载中'
            });
            let result = [];
            try {
                if (this.activeTypes[this.activeTab] === 'all') {
                    this.encyList = await this.getEncyRandomList({number: 20});
                    for (let ency of this.encyList) {
                        this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
                    }
                } else {
                    result = await this.getEncyList({type, page: 1, size: 1000});
                    this.encyList = result['materials'] || [];
                    for (let ency of this.encyList) {
                        this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
                    }
                }
            } catch (error) {
                console.error(error);
            }
            this.$vux.loading.hide();
        },

        async handleTabItemClick (type) {
            this.activeTab = type;
            window.sessionStorage.setItem('SeawaterEncyActiveTab', type);
            this.initRandomEncyList(type);
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
                case 'encySearch':
                    this.searching = true;
                    break;
                case 'encySearchCancel':
                    this.searching = false;
                    this.initRandomEncyList();
                    break;
                default:
                    break;
            }
        },

        async handleTypeChange(type) {
            this.activeTypes[this.activeTab] = type.code;
            window.sessionStorage.setItem(`SeawaterEncy${this.activeTab}ActiveType`, type.code);
            this.initEncyListInType(type.code);
        },

        handleShareTypeChange(shareType) {
            this.shareType = shareType;
        },

        handleCloseSharePicker(closeType) {
            if (closeType) {
                console.log('shareType', this.shareType);
            }
        },

        async handleSearchChange()  {
            if (this.searchText) {
                window.clearTimeout(this.searchTimer);
                this.searchTimer = setTimeout(async () => {
                    const result = await this.getEncyList({name: this.searchText, page: 1, size: 100});
                    this.encyList = result['materials'] || [];
                    for (let ency of this.encyList) {
                        this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
                    }
                }, 500);
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
