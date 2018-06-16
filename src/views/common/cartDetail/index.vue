<template>
    <div class="cart-detail-container">
        <div class="header">
            <span @click="handleActions({}, 'return')">
                <icon class="el-icon-coral-return f20"></icon>
                <span class="f16" style="position: relative; top: -2px;">回首页</span>
            </span>
            <span class="name f16">{{group.name}}</span>
            <span @click="handleActions({}, 'groupDetail')">
                <span class="f16" style="position: relative; top: -2px;">去购物</span>
                <icon class="el-icon-coral-enter f20"></icon>
            </span>
        </div>
        <div class="block">
            <div class="block-content m-b-10" v-for="item in detailsInCart" :key="item.id">
                <div class="img-container">
                    <img :src="item.encyImage" alt="生物图片">
                </div>
                <div class="info">
                    <span class="name f15">{{item.name}}</span>
                    <div>
                        <span class="size f12">{{item.size}}</span>
                        <span class="price f14">￥{{item.price}}</span>
                    </div>
                    <div class="count-container">
                        <x-number
                                v-model="item.count" :min="1" :max="max" width="40px"
                                @on-change="handleActions({}, 'numberChange')">
                        </x-number>
                        <span @click.stop="handleActions(item, 'deleteConfirm')">
                            <icon class="el-icon-coral-empty f18"></icon>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="total-count">
            <span class="f20">合计<span style="font-weight: bold;">
                <span style="color: #ee753c;">￥{{totalCount + parseInt((totalCount * group.freight || 0) * 100) / 100}}</span>
                <span class="f14">(含运费<span style="color: #ee735c;">￥{{parseInt((totalCount * group.freight || 0) * 100) / 100}}</span>)</span>
            </span></span>
        </div>
        <div>
            <group>
                <x-input placeholder="联系电话" is-type="china-mobile"
                         v-model="phone" :readonly="group.status===0">
                </x-input>
                <x-textarea
                        :max="200" name="description" placeholder="备注"
                        v-model="remark" :readonly="group.status===0">
                </x-textarea>
            </group>
        </div>
        <div class="submit" v-if="group.status===1">
            <button class="btn btn-full f15" @click="handleSubmit">确认购买</button>
        </div>
        <div class="submit" v-else>
            <button class="btn btn-full btn-disabled f15">确认购买</button>
        </div>
        <confirm v-model="deleteConfirm" :title="`删除${currentItem.name}`"
                 @on-confirm="handleConfirmDelete">
            <p style="text-align:center;">亲，确定删除吗？</p>
        </confirm>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
