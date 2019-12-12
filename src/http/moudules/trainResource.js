import axios from '../axios'

/* 
 * 教学资源管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/trainResource/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/trainResource/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/trainResource/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/trainResource/findPermissions',
        method: 'get',
        params
    })
}
// 通过考试批次获取所关联的考试课目
export const findAllByTestBatchId = (data) => {
    return axios({
        url: '/trainResource/findAllByTestBatchId',
        method: 'post',
        data
    })
}

//删除考试批次与某个考试课目的关联关系
export const deleteRelatedTestSubject = (params) => {
    return axios({
        url: '/trainResource/deleteRelatedTestSubject',
        method: 'get',
        params
    })
}

//获取大专业数据
export const findAllSpecial = (params) => {
    return axios({
        url: '/trainResource/findAllSpecial',
        method: 'get',
        params
    })
}

//获取大专业数据
export const findAllR = () => {
    return axios({
        url: '/trainResource/findAllR',
        method: 'get'
    })
}


