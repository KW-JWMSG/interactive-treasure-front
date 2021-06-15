import axios from 'axios'

// axios.defaults.baseURL = "http://192.168.0.140:3000/"
axios.defaults.baseURL = "http://localhost:3000/"
axios.defaults.withCredentials = true;
export const request_get = async (url) => {
    return await axios.get(url).catch(err => {
        return err
    })
}

export const request_post = async (url, data) => {
    return await axios.post(url, data).catch(err => {
        return err
    });
}

export const request_put = async (url, data) => {
    return await axios.put(url, data).catch(err => {
        return err
    });
}