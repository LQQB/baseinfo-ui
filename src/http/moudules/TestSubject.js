import axios from '../axios'

/* 
 * 考试批次管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/testSubject/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/testSubject/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/testSubject/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/testSubject/findPermissions',
        method: 'get',
        params
    })
}