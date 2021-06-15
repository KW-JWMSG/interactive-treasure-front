import { request_get, request_post } from '../utils/requests'

export const getTreasures = async () => {
    return await request_get('/api/hide/list')
}

export const createTreasures = async (latitude, longitude) => {
    const data = { latitude, longitude }
    return await request_post('/api/hide',data)
}
