import {mapActions} from 'vuex';
import {Search, Swiper, Group, PopupPicker, Rater, LoadMore} from 'vux';
import {compile} from '../../../util/data';
import {AvatarBasePath, SmallImageBasePath} from '../../../constants/index';

const baseList = [{
    url: 'javascript: void(0);',
    img: '/static/images/banner/banner1.jpg',
    title: ''
}, {
    url: 'javascript: void(0);',
    img: '/static/images/banner/banner2.jpg',
    title: ''
}, {
    url: 'javascript: void(0);',
    img: '/static/images/banner/banner3.jpg',
    title: ''
}, {
    url: 'javascript: void(0);',
    img: '/static/images/banner/banner4.jpg',
    title: ''
}];

const urlList = baseList.map((item) => ({
    url: item.url,
    img: item.img,
    fallbackImg: item.fallbackImg,
    title: item.title
}));

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            list: urlList,
            billFirstWordColor: ['#ee735c', '#d4e5e0', '#f5a623', '#64c708', '#84daef'],
            showProvincesPicker: false,
            provinces: [],
            curProvince: [localStorage.getItem('SeawaterCurProvince') || 'sh'],
            curProvinceName: localStorage.getItem('SeawaterCurProvinceName') || '上海',
            groups: undefined,
            bills: undefined,
            encyList: [],
            hasActiveGroup: true,
            hasActiveLingShow: true,
            hasActiveBill: true,
            groupCountDownTimer: null
        };
    },

    components: {
        Search,
        Swiper,
        Group,
        PopupPicker,
        Rater,
        LoadMore
    },

    async created () {
        const provinces = JSON.parse(window.localStorage.getItem('SeawaterProvinces'));
        if (provinces && provinces.length) {
            this.provinces = provinces;
        } else {
            this.provinces = await this.getProvinces();
            window.localStorage.setItem('SeawaterProvinces', JSON.stringify(this.provinces));
        }
        
        this.encyList = await this.getEncyRandomList({number: 10});
        for (let ency of this.encyList) {
            this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
            if (ency.focus_id) {
                this.$set(ency, 'isFocused', true);
            } else {
                this.$set(ency, 'isFocused', false);
            }
        }
    },

    async activated() {
        const response = await this.getGroupList({
            page: 1,
            size: 10,
            province: this.curProvince[0]
        });
        this.groups = response.res;
        //this.bills = (await this.getBillList({page: 1, size: 10}))['bills'] || [];

        for (let group of this.groups) {
            this.$set(group, 'userAvatar', `${AvatarBasePath}?id=${group.user_id}`);
            this.$set(group, 'interval', this.getIntervalFromNow(group.end_date));
        }
        if (this.groupCountDownTimer) {
            window.clearInterval(this.groupCountDownTimer);
        } else {
            this.groupCountDownTimer = window.setInterval(() => {
                for (let group of this.groups) {
                    this.$set(group, 'interval', this.getIntervalFromNow(group.end_date));
                }
            }, 1000);
        }
    },

    destroyed() {
        window.clearInterval(this.groupCountDownTimer);
    },

    methods: {
        ...mapActions([
            'updateGroupsInCurProvince',
            'getProvinces',
            'getGroupList',
            'getUserAvatar',
            'getBillList',
            'getEncyRandomList',
            'getEncyImagesById',
            'focusEncy'
        ]),

        handleShowProvinces() {
            this.showProvincesPicker = true;
        },

        async handleProvinceChange(value) {
            this.curProvince = value;
            this.curProvinceName = this.getProvinceNameByValue(value);
            const response = await this.getGroupList({
                page: 1,
                size: 10,
                province: value[0]
            });
            this.groups = response.res;
            for (let group of this.groups) {
                this.$set(group, 'userAvatar', `${AvatarBasePath}?id=${group.user_id}`);
            }
            //this.bills = (await this.getBillList({page: 1, size: 10}))['bills'] || [];
            this.updateGroupsInCurProvince(this.groups);

            window.localStorage.setItem('SeawaterCurProvince', value[0]);
            window.localStorage.setItem('SeawaterCurProvinceName', this.curProvinceName);
        },

        async handleDataRefresh(done) {
            const response = await this.getGroupList({
                page: 1,
                size: 10,
                province: this.curProvince[0]
            });
            this.groups = response.res;
            for (let group of this.groups) {
                this.$set(group, 'userAvatar', `${AvatarBasePath}?id=${group.user_id}`);
            }
            //this.bills = (await this.getBillList({page: 1, size: 10}))['bills'] || [];
            this.encyList = await this.getEncyRandomList({number: 10});
            for (let ency of this.encyList) {
                this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.id}`);
                if (ency.focus_id) {
                    this.$set(ency, 'isFocused', true);
                } else {
                    this.$set(ency, 'isFocused', false);
                }
            }
            done();
        },

        handleActions(item, actionType) {
            switch (actionType) {
                case 'toGroupTab':
                    this.$emit('on-to', 'group');
                    break;
                case 'groupHelp':
                    this.$vux.toast.text('程序猿努力开发中！');
                    break;
                case 'cityComm':
                case 'fishStores':
                case 'coopStores':
                case 'billDetail':
                case 'encyDetail':
                case 'groupAdd':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: item.id
                        }
                    });
                    break;
                case 'groupDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: compile(item.id)
                        }
                    });
                    break;
                case 'focus':
                    this.handleFocusEncy(item);
                    break;
                default:
                    break;
            }
        },

        async handleFocusEncy(ency) {
            const response = await this.focusEncy({
                user_id: this.currentUserId,
                material_id: ency.id
            });

            if (response.status === 'ok') {
                this.$set(ency, 'isFocused', !ency.isFocused);
            }
        },

        getIntervalFromNow(endDate) {
            const now = new Date().getTime();
            const end = new Date(endDate.replace(/-/g,"/")).getTime();

            return Math.floor(Math.abs(end - now) / 1000);
        },

        getProvinceNameByValue(value) {
            for (let province of this.provinces) {
                if (province.value === value[0]) {
                    return province.name;
                }
            }

            return '';
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
        },

        mapTimeInterval(totalSeconds) {
            const days = Math.floor(totalSeconds/3600/24) || 0;
            const hours = Math.floor((totalSeconds - days * 24 * 3600) / 3600) ||  0;
            const minutes = Math.floor((totalSeconds - days * 24 * 3600 - hours * 3600) / 60) || 0;
            const seconds = Math.floor((totalSeconds - days * 24 * 3600-hours * 3600 - minutes * 60)) || 0;

            return `${days !== 0 ? `${days}天` : ``}${hours !== 0 ? `${hours}小时` : ``}${minutes !== 0 ? `${minutes}分` : ``}${seconds}秒`;
        }
    },

    watch: {
        groups: function (curValue) {
            this.hasActiveGroup = curValue.filter(item => (item.status === 1 && item.userType !== 'lss')).length !== 0;
            this.hasActiveLingShow = curValue.filter(item => (item.status === 1 && item.userType === 'lss')).length !== 0;
        },
        bills: function (curValue) {
            const filteredBills = curValue.filter(item => item.status === 1);
            this.hasActiveBill = filteredBills.length !== 0;
        }
    }
};
