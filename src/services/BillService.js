import Vue from 'vue';
import {ApiBasePath} from '../constants/index';

export default {
    getBillList({name, page = 1, size = 10, userId}) {
        const params = {page, size};
        name && (params.name = name);
        userId && (params.user_id = userId);

        return Vue.axios.get(`${ApiBasePath}/api/bill/list`, {params});
    },

    getDetailsByBillId({id, name}) {
        const params = {id};
        name && (params.name = name);

        return Vue.axios.get(`${ApiBasePath}/api/bill/detail`, {params});
    },

    getBillById({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/bill/get`, {
            params: {
                id
            }
        });
    }
};
