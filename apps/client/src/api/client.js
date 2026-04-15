import axios from "axios";

export const apiBaseUrl = "http://localhost:5001/api";
export const apiRoot = apiBaseUrl.replace(/\/api$/, "");

const api = axios.create({
  baseURL: apiBaseUrl
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export const resolveAssetUrl = (assetPath) => {
  if (!assetPath) {
    return "";
  }

  if (assetPath.startsWith("http")) {
    return assetPath;
  }

  return `${apiRoot}${assetPath}`;
};

export default api;