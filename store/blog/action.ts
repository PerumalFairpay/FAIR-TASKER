import {
    GET_BLOGS_REQUEST,
    GET_BLOGS_SUCCESS,
    GET_BLOGS_FAILURE,
    GET_BLOG_REQUEST,
    GET_BLOG_SUCCESS,
    GET_BLOG_FAILURE,
    CREATE_BLOG_REQUEST,
    CREATE_BLOG_SUCCESS,
    CREATE_BLOG_FAILURE,
    UPDATE_BLOG_REQUEST,
    UPDATE_BLOG_SUCCESS,
    UPDATE_BLOG_FAILURE,
    DELETE_BLOG_REQUEST,
    DELETE_BLOG_SUCCESS,
    DELETE_BLOG_FAILURE,
    CLEAR_BLOG_ERRORS
} from "./actionType";

interface APIResponse {
    success: boolean;
    message: string;
    data: any;
    meta?: any;
}

export interface BlogData {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    cover_image?: string;
    category?: string;
    tags?: string[];
    is_published?: boolean;
    author?: {
        id: string;
        name: string;
        avatar?: string;
    };
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

export interface GetBlogsPayload {
    page: number;
    limit: number;
    search?: string;
}

export interface GetBlogPayload {
    blog_id: string;
}

export interface CreateBlogPayload {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string | File;
    category: string;
    tags: string[];
    is_published: boolean;
}

export interface UpdateBlogPayload {
    blog_id: string;
    [key: string]: any;
}

export interface DeleteBlogPayload {
    blog_id: string;
}

// Get Blogs
export const getBlogsRequest = (payload: GetBlogsPayload) => ({
    type: GET_BLOGS_REQUEST,
    payload,
});

export const getBlogsSuccess = (response: APIResponse) => ({
    type: GET_BLOGS_SUCCESS,
    payload: response,
});

export const getBlogsFailure = (error: string) => ({
    type: GET_BLOGS_FAILURE,
    payload: error,
});

// Get Blog
export const getBlogRequest = (payload: GetBlogPayload) => ({
    type: GET_BLOG_REQUEST,
    payload,
});

export const getBlogSuccess = (response: APIResponse) => ({
    type: GET_BLOG_SUCCESS,
    payload: response,
});

export const getBlogFailure = (error: string) => ({
    type: GET_BLOG_FAILURE,
    payload: error,
});

// Create Blog
export const createBlogRequest = (payload: CreateBlogPayload) => ({
    type: CREATE_BLOG_REQUEST,
    payload,
});

export const createBlogSuccess = (response: APIResponse) => ({
    type: CREATE_BLOG_SUCCESS,
    payload: response,
});

export const createBlogFailure = (error: string) => ({
    type: CREATE_BLOG_FAILURE,
    payload: error,
});

// Update Blog
export const updateBlogRequest = (payload: UpdateBlogPayload) => ({
    type: UPDATE_BLOG_REQUEST,
    payload,
});

export const updateBlogSuccess = (response: APIResponse) => ({
    type: UPDATE_BLOG_SUCCESS,
    payload: response,
});

export const updateBlogFailure = (error: string) => ({
    type: UPDATE_BLOG_FAILURE,
    payload: error,
});

// Delete Blog
export const deleteBlogRequest = (payload: DeleteBlogPayload) => ({
    type: DELETE_BLOG_REQUEST,
    payload,
});

export const deleteBlogSuccess = (response: APIResponse) => ({
    type: DELETE_BLOG_SUCCESS,
    payload: response,
});

export const deleteBlogFailure = (error: string) => ({
    type: DELETE_BLOG_FAILURE,
    payload: error,
});

export const clearBlogErrors = () => ({
    type: CLEAR_BLOG_ERRORS
});
