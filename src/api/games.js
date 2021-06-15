import { request_get, request_post } from '../utils/requests'

export const currentGame = async () => {
    return await request_get('/api/game')
}

export const createGame = async (treasure_id) => {
    const data = { treasure_id }
    return await request_post('/api/game', data)
}

export const getRank = async () => {
    return await request_get('/api/game/rank')
}

export const doSuccess = async (treasure_id) => {
    return await request_get(`/api/game/success/${treasure_id}`)
}

export const doFail = async (treasure_id) => {
    return await request_get(`/api/game/fail/${treasure_id}`)
}