import http from "../http";

export const menuApi = {
  getAll: (params) => http.get("/menus", { params }),
  getById: (id) => http.get(`/menus/${id}`),
  create: (data) => http.post("/menus", data),
  update: (id, data) => http.put(`/menus/${id}`, data),
  delete: (id) => http.delete(`/menus/${id}`),
  getCategories: () => http.get("/menu-categories"),
};
