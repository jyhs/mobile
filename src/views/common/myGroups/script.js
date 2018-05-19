import {mapActions} from 'vuex';
import {compile} from '../../../util/data';
import {AvatarBasePath, GroupExcelBasePath} from '../../../constants/index';
import {formatDateTimeParam} from '../../../util/date';

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            groups: [],
        };
    },

    created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'getGroupList',
            'finishGroupByIdAndUserId',
            'reopenGroupByIdAndUserId',
            'downloadGroupByIdAndUserId'
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
        },

        handleReopenGroup(group) {
            const now = new Date();
            this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD HH',
                startDate: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`,
                minHour: now.getHours() + 1,
                onConfirm: async (val) => {
                    this.$vux.loading.show({
                        text: '努力加载中'
                    });
                    let result = {};
                    try {
                        result = await this.reopenGroupByIdAndUserId({
                            id: group.id,
                            user_id: this.currentUserId,
                            end_date: formatDateTimeParam(new Date(`${val.replace(/-/g,"/")}:00:00`))
                        });
                    } catch(error) {
                        console.error(error);
                    }
                    this.$vux.loading.hide();

                    if (result.status === 'ok') {
                        this.$vux.toast.show({
                            text: `重新开始团购${group.name}成功`
                        });
                        this.initData();
                    }
                }
            });
        },

        async handleDownload(group) {
            this.$vux.loading.show({
                text: '努力加载中'
            });

            let result = {};
            try {
                result = await this.downloadGroupByIdAndUserId({
                    id: group.id,
                    user_id: group.user_id,
                });

                if (result.status === 'ok') {
                    const elemIF = document.createElement("iframe");
                    elemIF.src = `${GroupExcelBasePath}${result.name}?${Math.random()}`;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }
            } catch (error) {
                console.error(error);
            }

            this.$vux.loading.hide();
        }
    }
};