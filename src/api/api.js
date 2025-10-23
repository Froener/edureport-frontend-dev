// src/api/api.js
import axios from "axios";

const BASE_URL = "https://edureport-backend.onrender.com/api";

// Cria o axios instance com interceptadores
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

//request pro interceptador pra adicionar o token pros headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Resposta do interceptador pra gerir o token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //se n n tentamos dar refresh no token e o erro é 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        //Tentar dar refresh no token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        //Tentar a request original com o novo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        //refresh falhou -> desloga o usuário
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  login: async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      //Salva os tokens
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return res.data;
    } catch (error) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.error || "Login failed");
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Error ao fazer logout", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");
    }
  },

  // user profile -pega informações do usuário-
  getCurrentUserProfile: async () => {
    const res = await axiosInstance.get("/profile/me");
    return res.data;
  },

  // atualiza as informações do usuário -> vai poder mudar o q tiver permissão no back end, tipo endereço
  updateCurrentUserProfile: async (updates) => {
    const res = await axiosInstance.put("/profile/me", updates);
    return res.data;
  },

  signUpStudent: async (payload) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/signup/student`, payload);

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return res.data;
    } catch (error) {
      console.error(
        "Erro ao cadastrar aluno:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  },

  signUpSchool: async (payload) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/signup/school`, payload);

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return res.data;
    } catch (error) {
      console.error(
        "Erro ao cadastrar escola:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.error || "Sign up failed");
    }
  },

  signUpAdmin: async (adminData) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/signup/admin`, adminData);

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return res.data;
    } catch (error) {
      console.error(
        "Erro ao cadastrar admin:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  },

  getSchoolByName: async (name) => {
    const { data } = await axiosInstance.get(
      `/schools/name/${encodeURIComponent(name)}`
    );
    return { data };
  },

  getTagsBySchool: async (schoolId) => {
    const res = await axiosInstance.get(`/tags/school/${schoolId}`);
    return res.data;
  },

  getPositiveTagsBySchool: async (schoolId) => {
    const res = await axiosInstance.get(`/tags/school/${schoolId}/positive`);
    return res.data;
  },

  getNegativeTagsBySchool: async (schoolId) => {
    const res = await axiosInstance.get(`/tags/school/${schoolId}/negative`);
    return res.data;
  },

  createTag: async (schoolId, tagData) => {
    const res = await axiosInstance.post(`/tags/school/${schoolId}`, tagData);
    return res.data;
  },

  deleteTag: async (tagId) => {
    await axiosInstance.delete(`/tags/${tagId}`);
  },

  //metodos de feedback da escola
  getSchoolWithFeedback: async (schoolId) => {
    const res = await axiosInstance.get(`/schools/${schoolId}/feedback`);
    return res.data;
  },

  getAllSchoolsWithFeedback: async () => {
    const res = await axiosInstance.get("/schools/feedback");
    return res.data;
  },

  createFeedback: async (feedbackData) => {
    const res = await axiosInstance.post("/feedback", feedbackData);
    return res.data;
  },

  // Get feedback by student (if needed)
  getFeedbackByStudent: async (studentId) => {
    const res = await axiosInstance.get(`/feedback/student/${studentId}`);
    return res.data;
  },

  // Get feedback by school (if needed)
  getFeedbackBySchool: async (schoolId) => {
    const res = await axiosInstance.get(`/feedback/school/${schoolId}`);
    return res.data;
  },
  // Get current student's feedback
  getMyFeedback: async () => {
    const res = await axiosInstance.get("/feedback/my-feedback");
    return res.data;
  },
};
