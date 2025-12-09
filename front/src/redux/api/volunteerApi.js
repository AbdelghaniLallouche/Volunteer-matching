import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../../utils/axios';

const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) => async ({ url, method, data, params, baseUrl: customBaseUrl }) => {
  try {
    const finalBaseUrl = customBaseUrl || baseUrl;
    const result = await axiosInstance({ url: finalBaseUrl + url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      },
    };
  }
};

export const volunteerApi = createApi({
  reducerPath: 'volunteerApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/volunteers' }),
  tagTypes: ['Volunteer', 'History', 'Applications'],
  endpoints: (builder) => ({
    // Get volunteer profile
    getProfile: builder.query({
      query: () => ({ url: '/profile', method: 'GET' }),
      providesTags: ['Volunteer'],
    }),

    // Update volunteer profile
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/profile', method: 'PUT', data }),
      invalidatesTags: ['Volunteer'],
    }),

    // Get volunteer history
    getHistory: builder.query({
      query: () => ({ url: '/history', method: 'GET' }),
      providesTags: ['History'],
    }),

    // Get volunteer applications
    getApplications: builder.query({
      query: () => ({ url: '/applications', method: 'GET' }),
      providesTags: ['Applications'],
    }),

    // Get recommended missions
    getRecommendedMissions: builder.query({
      query: () => ({ url: '/recommended', method: 'GET', baseUrl: '/missions' }),
      providesTags: ['Missions'],
    }),

    // Search missions
    searchMissions: builder.query({
      query: (params) => ({ url: '', method: 'GET', params, baseUrl: '/missions' }),
      providesTags: ['Missions'],
    }),

    // Apply to mission
    applyToMission: builder.mutation({
      query: (missionId) => ({ url: `/${missionId}/apply`, method: 'POST', baseUrl: '/missions' }),
      invalidatesTags: ['Applications', 'Missions'],
    }),

    // Withdraw application
    withdrawApplication: builder.mutation({
      query: (missionId) => ({ url: `/${missionId}/withdraw`, method: 'DELETE', baseUrl: '/missions' }),
      invalidatesTags: ['Applications', 'Missions'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetHistoryQuery,
  useGetApplicationsQuery,
  useGetRecommendedMissionsQuery,
  useSearchMissionsQuery,
  useApplyToMissionMutation,
  useWithdrawApplicationMutation,
} = volunteerApi;
