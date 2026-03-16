import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('stackhunt_user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  getProfile: () => api.get('/auth/profile'),
};

export const bountyAPI = {
  getBountyById: (id) => api.get(`/bounties/${id}`),
  getActive: () => api.get('/bounties/active'),
  getCompanyBounties: () => api.get('/bounties/company'),
  search: (query) => api.get(`/bounties?search=${query}`),
};

export const leaderboardAPI = {
  getTop: () => api.get('/leaderboard'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getCompanyStats: () => api.get('/dashboard/company-stats'),
  getMaintainerStats: () => api.get('/dashboard/maintainer-stats'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}`),
};

export const submissionAPI = {
  getMySubmissions: () => api.get('/submissions/me'),
  getSubmissionByBounty: (bountyId) => api.get(`/submissions/bounty/${bountyId}`),
  getAllForReview: () => api.get('/submissions/review'),
  startWork: (bountyId) => api.post('/submissions/start', { bountyId }),
  submitSolution: (data) => api.post('/submissions', data),
  reviewSubmission: (data) => api.put('/submissions/review', data),
};

export default api;
