import {mapActions} from 'vuex';
import {compile} from '../../../util/data';
import {AvatarBasePath} from '../../../constants/index';

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            groups: []
        };
    },

    created() {
        this.initData();
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
            for (let group of this.groups) {
                this.$set(group, 'userAvatar', `${AvatarBasePath}?id=${group.user_id}`);
            }
        },

        handleActions(item, actionType) {
            switch (actionType) {
                case 'main':
                    window.sessionStorage.setItem('SeawaterTabActiveIndex', 2);
                    window.sessionStorage.setItem('SeawaterGroupTabActive', 'bill');
                    this.$router.push('/');
                    break;
                case 'groupDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: compile(item.id)
                        }
                    });
                    break;
                case 'return':
                    this.$router.push('/');
                    break;
                default:
                    break;
            }
        },

        handleDataRefresh(done) {
            this.initData();
            done();
        },

        handleFinishGroup(group) {
            this.$vux.confirm.show({
                title: '确定结束',
                content: '确定结束热团吗？',
                onConfirm: async () => {
                    const result = await this.finishGroupByIdAndUserId({
                        id: group.id,
                        user_id: this.currentUserId
                    });
                    if (result.status === 'ok') {
                        this.$vux.toast.show({
                            type: 'success',
                            text: `结束团单${group.name}成功`
                        });
                        this.initData();
                    }
                }
            });
        }
    }
};