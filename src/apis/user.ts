import axios from "./axios";

interface editMyInfoReq {
  aboutMe: string;
  age: number;
  targetId: string;
  username: string;
}

export const changeMyProfileImgAPI = async (formData: FormData) => {
  return await axios.patch(
    `${import.meta.env.VITE_API_BASE}user/my-profile-img`,
    formData,
    { withCredentials: true },
  );
};
export const changeMyBackgroundImgAPI = async (formData: FormData) => {
  return await axios.patch(
    `${import.meta.env.VITE_API_BASE}user/my-background-img`,
    formData,
    { withCredentials: true },
  );
};

// 나의 유저정보가져오기
export const myInfoAPI = async () => {
  return await axios.get(`${import.meta.env.VITE_API_BASE}user/my-info`, {
    withCredentials: true,
  });
};

export const userInfoAPI = async (userId: string) => {
  return await axios.get(
    `${import.meta.env.VITE_API_BASE}user/user-info/${userId}`,
    { withCredentials: true },
  );
};

export const editMyInfo = async (editMyInfo: editMyInfoReq) => {
  return await axios.put(
    `${import.meta.env.VITE_API_BASE}user/${editMyInfo.targetId}`,
    {
      username: editMyInfo.username,
      age: editMyInfo.age,
      aboutMe: editMyInfo.aboutMe,
    },
    {
      withCredentials: true,
    },
  );
};

export const deleteUserAPI = async (password: string) => {
  return await axios.delete(
    `${import.meta.env.VITE_API_BASE}user/delete-user`,
    {
      withCredentials: true,
      params: { password },
    },
  );
};
