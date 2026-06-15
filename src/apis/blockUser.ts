import axios from "./axios";

interface BlockUserType {
  blockUserId: string;
}

interface UnBlockUserType {
  unBlockUserId: string;
}

export const blockUserAPI = async ({ blockUserId }: BlockUserType) => {
  return await axios.post(
    `${import.meta.env.VITE_API_BASE}block-user/`,
    { blockUserId },
    { withCredentials: true },
  );
};

export const unBlockUserAPI = async ({ unBlockUserId }: UnBlockUserType) => {
  return await axios.delete(
    `${import.meta.env.VITE_API_BASE}block-user/${unBlockUserId}`,
    {
      withCredentials: true,
    },
  );
};
