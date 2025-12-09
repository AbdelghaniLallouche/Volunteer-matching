import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../../utils/axios';

const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) => async ({ url, method, data, params }) => {
  try {
    const result = await axiosInstance({ url: baseUrl + url, method, data, params });
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

export const associationApi = createApi({
  reducerPath: 'associationApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/associations' }),
  tagTypes: ['Association', 'Missions', 'Dashboard'],
  endpoints: (builder) => ({
    // Get association profile
    getProfile: builder.query({
      query: () => ({ url: '/profile/me', method: 'GET' }),
      providesTags: ['Association'],
    }),

    // Update association profile
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/profile/me', method: 'PUT', data }),
      invalidatesTags: ['Association'],
    }),

    // Get dashboard stats
    getDashboardStats: builder.query({
      query: () => ({ url: '/dashboard/stats', method: 'GET' }),
      providesTags: ['Dashboard'],
    }),

    // Get association missions
    getAssociationMissions: builder.query({
      query: () => ({ url: '/profile/me', method: 'GET' }),
      transformResponse: (response) => response.data.missions,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Missions', id: _id })),
              { type: 'Missions', id: 'LIST' }
            ]
          : [{ type: 'Missions', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetDashboardStatsQuery,
  useGetAssociationMissionsQuery,
} = associationApi;
