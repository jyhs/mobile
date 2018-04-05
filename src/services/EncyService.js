import Vue from 'vue';
import {ApiBasePath} from '../constants/index';

export default {
    getCategories() {
        return Vue.axios.get(`${ApiBasePath}/api/material/category`);
    },

    getTypesByCategoryCode({categoryCode}) {
        return Vue.axios.get(`${ApiBasePath}/api/material/types`, {
            params: {
                pc: categoryCode
            }
        });
    },

    getCompatibilities() {
        return Vue.axios.get(`${ApiBasePath}/api/material/compatibility`);
    },

    getLevels() {
        return Vue.axios.get(`${ApiBasePath}/api/material/level`);
    },

    getEncyById({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/material/get`, {
            params: {
                id
            }
        });
    },

    getEncyList({name, type, page = 1, size = 10}) {
        const params = {page, size};
        name && (params.name = name);
        type && (params.type = type);

        return Vue.axios.get(`${ApiBasePath}/api/material/list`, {params});
    },

    getEncyRandomList({number}) {
        return Vue.axios.get(`${ApiBasePath}/api/material/random/list`, {
            params: {number}
        });
    },

    getImagesByEncyId({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/material/imageList`, {
            params: {id}
        });
    },

    getEncyRandomImage() {
        return Vue.axios.get(`${ApiBasePath}/api/material/random/image`);
    },

    getEncyImageById({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/material/image`, {
            params: {id}
        });
    },

    getEncyImagesById({id}) {
        return Vue.axios.get(`${ApiBasePath}/api/material/imageList`, {
            params: {id}
        });
    }
};
