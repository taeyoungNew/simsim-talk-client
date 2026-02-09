import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}`,
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.data.status;

    if (status === 401 || status === 403) {
      err.isAuthExpired = true;
    }

    return Promise.reject(err);
  },
);

export default instance;
