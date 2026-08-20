import axios from "axios";

export const globalSearchAPI = async (keyword: string) => {
  return await axios.get(
    `${import.meta.env.VITE_API_BASE}elastic-search/global-search?keyword=${keyword}`,
    { withCredentials: true },
  );
};
