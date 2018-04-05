import Vue from 'vue';
import {ApiBasePath} from '../constants/index';

export default {
    sendVerification(params) {
        return Vue.axios.post(`${ApiBasePath}/api/tools/send/verification`, params);
    },

    getProvinces() {
        return Vue.axios.get(`${ApiBasePath}/api/tools/provinces`);
    },

    getCities() {
        return Vue.axios.get(`${ApiBasePath}/api/tools/citys`);
    },

    getCitiesInProvinces({area}) {
        return Vue.axios.get(`${ApiBasePath}/api/tools/citys?`, {
            params: {
                area
            }
        });
    },

    getTypes() {
        return Vue.axios.get(`${ApiBasePath}/api/users/types`);
    }
};
