<template>
    <div class="group-add-container">
        <group>
            <cell is-link :border-intent="false" :arrow-direction="showDetails?'up':'down'"
                  @click.native="showDetails = !showDetails">
                <span slot="title">
                    <span class="dot"></span>
                    <span class="title">{{bill.name}}</span>
                </span>
            </cell>
            <div class="items slide" :class="showDetails ?'animate':''">
                <div class="item" :class="{active: index%2!==1}" v-for="(item, index) in details" :key="item.id">
                    <span class="name f13">{{item.name}}</span>
                    <span class="size f13">{{item.size}}</span>
                    <span class="price f13">￥{{item.price}}</span>
                </div>
            </div>
        </group>
        <div class="input-container m-t-10">
            <div class="input-item">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">团单名</span>
                </div>
                <input placeholder="请输入" v-model="form.name"/>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">联系人姓名</span>
                </div>
                <input placeholder="请输入" v-model="form.contacts"/>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">联系人手机</span>
                </div>
                <input placeholder="请输入" v-model="form.phone"/>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">截止时间</span>
                </div>
                <group>
                    <datetime
                        placeholder="请选择"
                        :start-date="startDate"
                        format="YYYY-MM-DD HH:mm"
                        v-model="form.end_date"
                    >
                    </datetime>
                </group>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">开团城市</span>
                </div>
                <selector placeholder="请选择" :options="cities" v-model="form.city"></selector>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">其他信息</span>
                </div>
                <textarea placeholder="请输入" class="other-info" v-model="form.description"></textarea>
            </div>
            <button class="btn btn-full m-t-10 f16" @click="submit">确认开团</button>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import {Group, Cell, Datetime, Selector, PopupPicker} from 'vux';
    import {formatDateTimeParam} from '../../../util/date';

    export default {
        data() {
            const today = new Date();
            return {
                showDetails: false,
                details: [],
                bill: {},
                cities: [],
                currentUser: {},
                curProvince: window.localStorage.getItem('SeawaterCurProvince') || 'sh',
                startDate: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
                form: {
                    name: undefined,
                    contacts: undefined,
                    phone: undefined,
                    end_date: undefined,
                    city: undefined,
                    description: undefined
                }

            };
        },

        components: {
            Group,
            Cell,
            Datetime,
            Selector,
            PopupPicker
        },

        async created() {
            const {id} = this.$route.params;

            this.bill = (await this.getBillById({id}));
            this.details = await this.getDetailsByBillId({id}) || [];

            this.currentUser = (await this.getUserById({
                id: parseInt(window.localStorage.getItem('SeawaterLoginUserId'))
            }))[0];
            this.form.contacts = this.currentUser.name;
            this.form.phone = this.currentUser.phone;
            this.form.city = this.currentUser.city;
            const cities = await this.getCitiesInProvinces({
                area: this.curProvince
            });
            for (let city of cities) {
                this.cities.push({
                    key: city.name,
                    value: city.value
                });
            }
        },

        methods: {
            ...mapActions([
                'getDetailsByBillId',
                'getBillById',
                'getUserById',
                'getCitiesInProvinces',
                'addGroupByBillIdAndUserId'
            ]),

            async submit() {
                const needValid = ['name', 'contacts', 'phone', 'end_date', 'city'];
                const message = ['团单名', '联系人姓名', '联系人手机', '截止时间', '开团城市'];

                for (let i = 0; i < needValid.length; i++) {
                    if (!this.form[needValid[i]]) {
                        this.$vux.toast.show({
                            type: 'warn',
                            text: `请完善${message[i]}`
                        });
                        return;
                    }
                }

                const sendInfo = Object.assign({}, this.form, {
                    end_date: this.form.end_date ? formatDateTimeParam(this.form.end_date.replace(/-/g, '/')) : '',
                    bill_id: this.$route.params.id,
                    user_id: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
                    province: this.curProvince
                });
                this.$vux.loading.show({
                    text: '努力加载中'
                });
                const result = await this.addGroupByBillIdAndUserId(sendInfo);
                this.$vux.loading.hide();

                if (result.status === 'ok') {
                    this.$vux.toast.show({
                        type: 'success',
                        message: `开团${this.form.name}成功`
                    });
                    this.$router.push({name: 'myGroups'});
                }
            }
        }
    };
</script>
<style lang="less">
    .group-add-container {
        min-height: 100%;
        .slide {
            padding: 0 20px;
            overflow: hidden;
            max-height: 0;
            transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
        }
        .animate {
            max-height: 9999px;
            transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
            transition-delay: 0s;
        }
        .weui-cells {
            margin-top: 0;
            background: #fff;
            a {
                height: 0.40rem;
                box-sizing: border-box;
                font-size: 14px;
                color: #aaa;
                border: 2px solid #e1e8ee;
                border-radius: 6px;
                &.weui-cell {
                    padding: 0 13px;
                }
            }
        }
        .weui-select {
            border: 2px solid #e1e8ee;
            height: 0.4rem;
            line-height: 0.4rem;
            border-radius: 6px;
        }
        .vux-datetime-value {
            text-align: left;
            .vux-cell-value {
                color: #000;
            }
        }
        .dot {
            display: inline-block;
            width: 0.1rem;
            height: 0.1rem;
            font-size: 0;
            border-radius: 50%;
            background-color: #39b7f9;
        }
        .items {
            .active {
                background-color: #d6e9ff;
            }
            .item {
                height: 0.30rem;
                line-height: 0.30rem;
                display: flex;
                flex-direction: row;
                padding: 0 0.15rem;
                .name {
                    color: #000;
                    width: 50%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .size {
                    color: #9b9191;
                    width: 30%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .price {
                    color: #ffa512;
                    width: 20%;
                }
            }
        }
        .input-container {
            padding: 0 0.1rem;
            .input-item {
                .title {
                    margin-bottom: 0.07rem;
                    .rect {
                        padding: 8px 3px;
                        width: 0;
                        font-size: 0;
                        background-color: #f4a623;
                        position: relative;
                        top: -5px;
                        margin-left: 0.03rem;
                    }
                    .title-text {
                        margin-left: 0.05rem;
                    }
                }
                input, textarea {
                    display: inline-block;
                    width: 100%;
                    height: 0.4rem;
                    box-sizing: border-box;
                    background: #fff;
                    border: 2px solid #e1e8ee;
                    border-radius: 6px;
                    text-indent: 1em;
                    font-size: 14px;
                }
                textarea {
                    height: 0.8rem;
                    outline: none;
                    text-indent: 15px;
                }
            }
            .btn-full {
                background-color: #39b7f9;
            }
        }
    }
</style>
