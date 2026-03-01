import http from '../http'

export const tableApi = {
  getAll:       ()            => http.get('/tables'),
  getById:      (id)          => http.get(`/tables/${id}`),
  updateStatus: (id, status)  => http.patch(`/tables/${id}/status`, { status }),
}