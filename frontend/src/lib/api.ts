import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  register: async (userData: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
}

// Calendar API
export const calendarApi = {
  getEvents: async (start?: string, end?: string) => {
    const response = await api.get('/calendar', { params: { start, end } })
    return response.data
  },
  createEvent: async (event: any) => {
    const response = await api.post('/calendar', event)
    return response.data
  },
  updateEvent: async (id: number, event: any) => {
    const response = await api.put(`/calendar/${id}`, event)
    return response.data
  },
  deleteEvent: async (id: number) => {
    const response = await api.delete(`/calendar/${id}`)
    return response.data
  },
}

// Projects API
export const projectsApi = {
  getProjects: async () => {
    const response = await api.get('/projects')
    return response.data
  },
  createProject: async (project: any) => {
    const response = await api.post('/projects', project)
    return response.data
  },
  updateProject: async (id: number, project: any) => {
    const response = await api.put(`/projects/${id}`, project)
    return response.data
  },
  deleteProject: async (id: number) => {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },
}

// Focus API
export const focusApi = {
  startSession: async (session: any) => {
    const response = await api.post('/focus/start', session)
    return response.data
  },
  endSession: async (id: number) => {
    const response = await api.post(`/focus/${id}/end`)
    return response.data
  },
  getSessions: async () => {
    const response = await api.get('/focus/sessions')
    return response.data
  },
}

export { api }
export default api