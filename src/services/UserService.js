import Vue from 'vue';
import {ApiBasePath} from '../constants/index';

export default {
    register(params = {}) {
        return Vue.axios.post(`${ApiBasePath}/api/users/register`, params);
    },

    login(params = {}) {
        return Vue.axios.post(`${ApiBasePath}/api/users/login`, params);
    },

    logout(params) {
        return Vue.axios.post(`${ApiBasePath}/api/users/logout`, params);
    },

    getUserById({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/users/get`, {
            params: {
                id
            }
        });
    },

    getUserAvatar({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/users/get/logo`, {
            params: {
                id
            }
        });
    },

    uploadUserAvatar(formData) {
        return Vue.axios.post(`${ApiBasePath}/api/users/upload`, formData);
    }
};
