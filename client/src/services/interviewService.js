import { request } from './api.js';

export const interviewService = {
  async createInterview(config) {
    return request('/interviews', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },

  async getInterviews(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.role) searchParams.append('role', params.role);
    if (params.interviewType) searchParams.append('interviewType', params.interviewType);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    return request(`/interviews${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  async getInterviewById(id) {
    return request(`/interviews/${id}`, {
      method: 'GET',
    });
  },

  async submitAnswer(interviewId, { candidateAnswer, durationSeconds }) {
    return request(`/interviews/${interviewId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ candidateAnswer, durationSeconds }),
    });
  },

  async getNextQuestion(interviewId) {
    return request(`/interviews/${interviewId}/next-question`, {
      method: 'POST',
    });
  },

  async finishInterview(interviewId) {
    return request(`/interviews/${interviewId}/finish`, {
      method: 'POST',
    });
  },

  async deleteInterview(interviewId) {
    return request(`/interviews/${interviewId}`, {
      method: 'DELETE',
    });
  },

  async getDashboardStats() {
    return request('/dashboard/stats', {
      method: 'GET',
    });
  },
};
