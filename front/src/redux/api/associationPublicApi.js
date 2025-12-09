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

export const associationPublicApi = createApi({
  reducerPath: 'associationPublicApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/associations' }),
  tagTypes: ['PublicAssociation'],
  endpoints: (builder) => ({
    // Search associations by name
    searchAssociations: builder.query({
      query: (name) => ({ url: '/search', method: 'GET', params: { name } }),
    }),

    // Get single association with missions
    getPublicAssociation: builder.query({
      query: (id) => ({ url: `/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'PublicAssociation', id }],
    }),
  }),
});

export const {
  useSearchAssociationsQuery,
  useGetPublicAssociationQuery,
} = associationPublicApi;
