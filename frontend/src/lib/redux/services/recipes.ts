import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AddCommentRequestBody,
  AddRecipeRequestBody,
  ExtendedRecipe,
  GetRecipesQueryParams,
} from '../../../types/types';
import type { paths } from '../../../types/backend/backend';

export const BASE_URL = process.env.REACT_APP_API_URL;

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  tagTypes: ['Recipes', 'Comments'],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getRecipes: builder.query<ExtendedRecipe[], GetRecipesQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?._page) queryParams.append('_page', params._page.toString());
        if (params?._limit)
          queryParams.append('_limit', params._limit.toString());
        if (params?.q) queryParams.append('q', params.q);
        if (params?.cuisineId)
          queryParams.append('cuisineId', params.cuisineId);
        if (params?.dietId) queryParams.append('dietId', params.dietId);
        if (params?.difficultyId)
          queryParams.append('difficultyId', params.difficultyId);
        if (params?._expand) {
          params._expand.forEach((expand) =>
            queryParams.append('_expand', expand)
          );
        }
        return {
          url: `/recipes?${queryParams}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Recipes' as const, id })),
              { type: 'Recipes', id: 'RECIPES_LIST' },
            ]
          : [{ type: 'Recipes', id: 'RECIPES_LIST' }],
    }),
    addRecipe: builder.mutation<null, AddRecipeRequestBody>({
      query: (newRecipe) => {
        const formData = new FormData();
        Object.keys(newRecipe).forEach((key) => {
          const value = newRecipe[key as keyof AddRecipeRequestBody];
          if (value !== undefined) {
            if (Array.isArray(value)) {
              formData.append(key, value.join(',')); // for ingredients (array)
            } else {
              formData.append(key, value);
            }
          }
        });
        return {
          url: '/recipes',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Recipes', id: 'RECIPES_LIST' }],
    }),
    getRecipeById: builder.query<
      paths['/recipes/{id}']['get']['responses']['200']['content']['application/json'],
      {
        id: paths['/recipes/{id}']['get']['parameters']['path']['id'];
        query: paths['/recipes/{id}']['get']['parameters']['query'];
      }
    >({
      query: ({ id, query }) => {
        const params = new URLSearchParams();
        if (query?._expand)
          query._expand.forEach((el) => el && params.append('_expand', el));

        return {
          url: `/recipes/${id}`,
          params,
        };
      },
    }),
    addComment: builder.mutation<
      null,
      {
        id: paths['/recipes/{id}/comments']['post']['parameters']['path']['id'];
        requestBody: AddCommentRequestBody;
      }
    >({
      query: ({ id, requestBody }) => {
        const body: AddCommentRequestBody = {};
        if (requestBody.date) body.date = requestBody.date;
        if (requestBody.comment) body.comment = requestBody.comment;
        if (requestBody.rating) body.rating = requestBody.rating;

        return {
          url: `/recipes/${id}/comments`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [{ type: 'Comments', id: 'COMMENTS_LIST' }],
    }),
    getCommentsByRecipeId: builder.query<
      paths['/recipes/{id}/comments']['get']['responses']['200']['content']['application/json'],
      paths['/recipes/{id}/comments']['get']['parameters']['path']['id']
    >({
      query: (id) => ({
        url: `/recipes/${id}/comments`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Comments' as const, id })),
              { type: 'Comments', id: 'COMMENTS_LIST' },
            ]
          : [{ type: 'Comments', id: 'COMMENTS _LIST' }],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useAddRecipeMutation,
  useGetRecipeByIdQuery,
  useAddCommentMutation,
  useGetCommentsByRecipeIdQuery,
  usePrefetch: usePrefetchRecipes,
} = recipesApi;
