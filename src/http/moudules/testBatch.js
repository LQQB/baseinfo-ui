import axios from '../axios'

/* 
 * 考试批次管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/testBatch/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/testBatch/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/testBatch/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/testBatch/findPermissions',
        method: 'get',
        params
    })
}

// 关联考试批次与考试课目
export const relatedTestSubject = (data) => {
    return axios({
        url: '/testBatch/relatedTestSubject',
        method: 'post',
        data
    })
}

// 解除关联考试批次与考试课目
export const unRelatedTestSubject = (params) => {
    return axios({
        url: '/testBatch/unRelatedTestSubject',
        method: 'get',
        params
    })
}