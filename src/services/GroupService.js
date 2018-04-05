import Vue from 'vue';
import {ApiBasePath} from '../constants/index';

export default {
    getGroupList({name, userId, province, page = 1, size = 10}) {
        const params = {
            page,
            size
        };
        name && (params.name = name);
        userId && (params.user_id = userId);
        province && (params.province = province);

        return Vue.axios.get(`${ApiBasePath}/api/group/list`, {params});
    },

    getGroupById({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/group/get`, {
            params: {
                id
            }
        });
    },

    getCountById({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/group/count`, {
            params: {
                id
            }
        });
    },

    finishGroupByIdAndUserId(params) {
        return Vue.axios.post(`${ApiBasePath}/api/group/finish`, params);
    },

    addGroupByBillIdAndUserId(params) {
        return Vue.axios.post(`${ApiBasePath}/api/group/add`, params);
    }
};
