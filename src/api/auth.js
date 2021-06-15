import { request_get, request_post } from '../utils/requests'

export const checkLogin = async () => {
    return await request_get('/api/user')
}

export const doLogout = async () => {
    return await request_get('/api/user/logout')
}

export const doLogin = async (user_id, user_pw) => {
    const data = { user_id, user_pw }
    return await request_post('/api/user/login', data)
}

export const doJoin = async (user_id, user_pw, user_name) => {
    const data = { user_id, user_pw, user_name }
    return await request_post('/api/user/join', data)
}