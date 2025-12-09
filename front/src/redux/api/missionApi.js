import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../../utils/axios';

const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) => async ({ url, method, data, params, headers }) => {
  try {
    const result = await axiosInstance({ url: baseUrl + url, method, data, params, headers });
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

export const missionApi = createApi({
  reducerPath: 'missionApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/missions' }),
  tagTypes: ['Mission', 'Missions'],
  endpoints: (builder) => ({
    // Create mission
    createMission: builder.mutation({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['Missions'],
    }),

    // Get single mission
    getMission: builder.query({
      query: (id) => ({ url: `/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Mission', id }],
    }),

    // Update mission
    updateMission: builder.mutation({
      query: ({ id, data }) => ({ url: `/${id}`, method: 'PUT', data }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Mission', id },
        'Missions',
      ],
    }),

    // Delete mission
    deleteMission: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Missions'],
    }),

    // Handle application (accept/reject)
    handleApplication: builder.mutation({
      query: ({ missionId, volunteerId, status }) => ({
        url: `/${missionId}/applicants/${volunteerId}`,
        method: 'PUT',
        data: { status },
      }),
      invalidatesTags: (result, error, { missionId }) => [
        { type: 'Mission', id: missionId },
      ],
    }),

    // Close mission
    closeMission: builder.mutation({
      query: (id) => ({ url: `/${id}/close`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Mission', id },
        'Missions',
      ],
    }),
  }),
});

export const {
  useCreateMissionMutation,
  useGetMissionQuery,
  useUpdateMissionMutation,
  useDeleteMissionMutation,
  useHandleApplicationMutation,
  useCloseMissionMutation,
} = missionApi;
