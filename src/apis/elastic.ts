import axios from "axios";

export const searchMainPageAPI = async (keyword: string) => {
  return await axios.get(
    `${import.meta.env.VITE_API_BASE}search-mainpage?keyword=${keyword}`,
    { withCredentials: true },
  );
};
