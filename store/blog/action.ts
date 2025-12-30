import {
    CREATE_BLOG_REQUEST, CREATE_BLOG_SUCCESS, CREATE_BLOG_FAILURE,
    GET_BLOGS_REQUEST, GET_BLOGS_SUCCESS, GET_BLOGS_FAILURE,
    GET_BLOG_REQUEST, GET_BLOG_SUCCESS, GET_BLOG_FAILURE,
    UPDATE_BLOG_REQUEST, UPDATE_BLOG_SUCCESS, UPDATE_BLOG_FAILURE,
    DELETE_BLOG_REQUEST, DELETE_BLOG_SUCCESS, DELETE_BLOG_FAILURE,
    CLEAR_BLOG_DETAILS, CLEAR_BLOG_ERRORS
} from "./actionType";


// Create Blog
export const createBlogRequest = (payload: FormData) => ({
    type: CREATE_BLOG_REQUEST,
    payload,
});
export const createBlogSuccess = (response: any) => ({
    type: CREATE_BLOG_SUCCESS,
    payload: response,
});
export const createBlogFailure = (error: any) => ({
    type: CREATE_BLOG_FAILURE,
    payload: error,
});

// Get All Blogs
export const getBlogsRequest = (page?: number, limit?: number, search?: string) => ({
    type: GET_BLOGS_REQUEST,
    payload: { page, limit, search }
});
export const getBlogsSuccess = (response: any) => ({
    type: GET_BLOGS_SUCCESS,
    payload: response,
});
export const getBlogsFailure = (error: any) => ({
    type: GET_BLOGS_FAILURE,
    payload: error,
});

// Get Single Blog
export const getBlogRequest = (id: string) => ({
    type: GET_BLOG_REQUEST,
    payload: id,
});
export const getBlogSuccess = (response: any) => ({
    type: GET_BLOG_SUCCESS,
    payload: response,
});
export const getBlogFailure = (error: any) => ({
    type: GET_BLOG_FAILURE,
    payload: error,
});

// Update Blog
export const updateBlogRequest = (id: string, payload: FormData) => ({
    type: UPDATE_BLOG_REQUEST,
    payload: { id, payload },
});
export const updateBlogSuccess = (response: any) => ({
    type: UPDATE_BLOG_SUCCESS,
    payload: response,
});
export const updateBlogFailure = (error: any) => ({
    type: UPDATE_BLOG_FAILURE,
    payload: error,
});

// Delete Blog
export const deleteBlogRequest = (id: string) => ({
    type: DELETE_BLOG_REQUEST,
    payload: id,
});
export const deleteBlogSuccess = (response: any) => ({
    type: DELETE_BLOG_SUCCESS,
    payload: response,
});
export const deleteBlogFailure = (error: any) => ({
    type: DELETE_BLOG_FAILURE,
    payload: error,
});

// Clear Details
export const clearBlogDetails = () => ({
    type: CLEAR_BLOG_DETAILS,
});

export const clearBlogErrors = () => ({
    type: CLEAR_BLOG_ERRORS,
});

