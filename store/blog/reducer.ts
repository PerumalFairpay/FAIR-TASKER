import {
    CREATE_BLOG_REQUEST, CREATE_BLOG_SUCCESS, CREATE_BLOG_FAILURE,
    GET_BLOGS_REQUEST, GET_BLOGS_SUCCESS, GET_BLOGS_FAILURE,
    GET_BLOG_REQUEST, GET_BLOG_SUCCESS, GET_BLOG_FAILURE,
    UPDATE_BLOG_REQUEST, UPDATE_BLOG_SUCCESS, UPDATE_BLOG_FAILURE,
    DELETE_BLOG_REQUEST, DELETE_BLOG_SUCCESS, DELETE_BLOG_FAILURE,
    CLEAR_BLOG_DETAILS, CLEAR_BLOG_ERRORS
} from "./actionType";


const initialState = {
    loading: false,
    blogs: [],
    blog: null,
    meta: {
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0
    },
    error: null,
    success: false,
    message: null,

    // Specific states for UI
    getBlogsLoading: false,
    getBlogLoading: false,
    createBlogLoading: false,
    createBlogSuccess: false,
    createBlogError: null,
    updateBlogLoading: false,
    updateBlogSuccess: false,
    updateBlogError: null,
    deleteBlogLoading: false,
    deleteBlogSuccess: false,
    deleteBlogError: null,
};

const blogReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CREATE_BLOG_REQUEST:
            return { ...state, createBlogLoading: true, createBlogSuccess: false, createBlogError: null };
        case GET_BLOGS_REQUEST:
            return { ...state, getBlogsLoading: true, error: null };
        case GET_BLOG_REQUEST:
            return { ...state, getBlogLoading: true, error: null };
        case UPDATE_BLOG_REQUEST:
            return { ...state, updateBlogLoading: true, updateBlogSuccess: false, updateBlogError: null };
        case DELETE_BLOG_REQUEST:
            return { ...state, deleteBlogLoading: true, deleteBlogSuccess: false, deleteBlogError: null };

        case CREATE_BLOG_SUCCESS:
            return {
                ...state,
                createBlogLoading: false,
                createBlogSuccess: true,
                message: action.payload.message,
                blogs: [action.payload.data, ...state.blogs]
            };
        case GET_BLOGS_SUCCESS:
            return {
                ...state,
                getBlogsLoading: false,
                blogs: action.payload.data,
                meta: action.payload.meta,
                error: null,
            };
        case GET_BLOG_SUCCESS:
            return {
                ...state,
                getBlogLoading: false,
                blog: action.payload.data,
                error: null,
            };
        case UPDATE_BLOG_SUCCESS:
            return {
                ...state,
                updateBlogLoading: false,
                updateBlogSuccess: true,
                message: action.payload.message,
                blogs: state.blogs.map((b: any) =>
                    b.id === action.payload.data.id ? action.payload.data : b
                ),
                blog: action.payload.data
            };
        case DELETE_BLOG_SUCCESS:
            return {
                ...state,
                deleteBlogLoading: false,
                deleteBlogSuccess: true,
                message: action.payload.message,
                blogs: state.blogs.filter((b: any) => b.id !== action.payload.id),
            };

        case CREATE_BLOG_FAILURE:
            return { ...state, createBlogLoading: false, createBlogError: action.payload, createBlogSuccess: false };
        case GET_BLOGS_FAILURE:
            return { ...state, getBlogsLoading: false, error: action.payload };
        case GET_BLOG_FAILURE:
            return { ...state, getBlogLoading: false, error: action.payload };
        case UPDATE_BLOG_FAILURE:
            return { ...state, updateBlogLoading: false, updateBlogError: action.payload, updateBlogSuccess: false };
        case DELETE_BLOG_FAILURE:
            return { ...state, deleteBlogLoading: false, deleteBlogError: action.payload, deleteBlogSuccess: false };

        case CLEAR_BLOG_ERRORS:
            return {
                ...state,
                createBlogError: null,
                updateBlogError: null,
                deleteBlogError: null,
                error: null,
            };
        case CLEAR_BLOG_DETAILS:

            return {
                ...state,
                blog: null,
                error: null,
                success: false,
                message: null,
                createBlogSuccess: false,
                updateBlogSuccess: false,
                deleteBlogSuccess: false,
            };
        default:
            return state;
    }
};

export default blogReducer;
