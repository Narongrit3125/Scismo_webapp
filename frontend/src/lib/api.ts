import axios from 'axios';
import { Content, Project, Member, Position, Document } from '@/types';

// Update to use Next.js API routes instead of Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic API response interface
interface APIResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

// Content API
export const contentAPI = {
  getAll: () => api.get<APIResponse<Content[]>>('/content'),
  getNews: () => api.get<APIResponse<Content[]>>('/news'),
  getActivities: () => api.get<APIResponse<Content[]>>('/activities'),
  getById: (id: number) => api.get<APIResponse<Content>>(`/content?id=${id}`),
};

// Project API
export const projectAPI = {
  getAll: () => api.get<APIResponse<Project[]>>('/projects'),
  getByCategory: (category: string) => api.get<APIResponse<Project[]>>(`/projects?category=${category}`),
  getByStatus: (status: string) => api.get<APIResponse<Project[]>>(`/projects?status=${status}`),
  getById: (id: string) => api.get<APIResponse<Project>>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<APIResponse<Project>>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put<APIResponse<Project>>(`/projects/${id}`, data),
  delete: (id: string) => api.delete<APIResponse<void>>(`/projects/${id}`),
};

// Member API
export const memberAPI = {
  getAll: () => api.get<APIResponse<Member[]>>('/members'),
  getByYear: (year: number) => api.get<APIResponse<Member[]>>(`/members?year=${year}`),
  getByPosition: (position: string) => api.get<APIResponse<Member[]>>(`/members?position=${position}`),
  getById: (id: number) => api.get<APIResponse<Member>>(`/members?id=${id}`),
};

// Position API
export const positionAPI = {
  getAll: () => api.get<APIResponse<Position[]>>('/positions'),
  getByType: (type: string) => api.get<APIResponse<Position[]>>(`/positions?type=${type}`),
};

// Document API
export const documentAPI = {
  getAll: () => api.get<APIResponse<Document[]>>('/documents?public=true'),
  getByCategory: (category: string) => api.get<APIResponse<Document[]>>(`/documents?category=${category}&public=true`),
  getPublic: () => api.get<APIResponse<Document[]>>('/documents?public=true'),
  getById: (id: number) => api.get<APIResponse<Document>>(`/documents?id=${id}`),
};

// Forms API
export const formsAPI = {
  getAll: () => api.get<APIResponse<any[]>>('/forms'),
  getByType: (type: string) => api.get<APIResponse<any[]>>(`/forms?type=${type}`),
  submit: (data: any) => api.post<APIResponse<any>>('/forms', data),
};

// Donations API
export const donationsAPI = {
  getAll: () => api.get<APIResponse<any[]>>('/donations'),
  getByStatus: (status: string) => api.get<APIResponse<any[]>>(`/donations?status=${status}`),
  getDonationRecords: (donationId?: number) => api.get<APIResponse<any[]>>(`/donations?records=true${donationId ? `&donationId=${donationId}` : ''}`),
  donate: (data: any) => api.post<APIResponse<any>>('/donations', data),
};

// Contacts API
export const contactsAPI = {
  getAll: () => api.get<APIResponse<any[]>>('/contacts'),
  send: (data: any) => api.post<APIResponse<any>>('/contacts', data),
  updateStatus: (id: number, status: string) => api.patch<APIResponse<any>>('/contacts', { id, status }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get<APIResponse<any[]>>('/users'),
  getByRole: (role: string) => api.get<APIResponse<any[]>>(`/users?role=${role}`),
  getById: (id: number) => api.get<APIResponse<any>>(`/users?id=${id}`),
};

export default api;