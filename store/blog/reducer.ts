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

interface BlogState {
    getBlogsLoading: boolean;
    getBlogLoading: boolean;
    createBlogLoading: boolean;
    updateBlogLoading: boolean;
    deleteBlogLoading: boolean;

    getBlogsError: string | null;
    getBlogError: string | null;
    createBlogError: string | null;
    updateBlogError: string | null;
    deleteBlogError: string | null;

    getBlogsSuccess: string | null;
    getBlogSuccess: string | null;
    createBlogSuccess: string | null;
    updateBlogSuccess: string | null;
    deleteBlogSuccess: string | null;

    blogs: any[];
    blog: any | null;
    meta: any | null;
}

const initialBlogState: BlogState = {
    getBlogsLoading: false,
    getBlogLoading: false,
    createBlogLoading: false,
    updateBlogLoading: false,
    deleteBlogLoading: false,

    getBlogsError: null,
    getBlogError: null,
    createBlogError: null,
    updateBlogError: null,
    deleteBlogError: null,

    getBlogsSuccess: null,
    getBlogSuccess: null,
    createBlogSuccess: null,
    updateBlogSuccess: null,
    deleteBlogSuccess: null,

    blogs: [],
    blog: null,
    meta: null
};

const blogReducer = (state: BlogState = initialBlogState, action: any): BlogState => {
    switch (action.type) {
        // Get Blogs
        case GET_BLOGS_REQUEST:
            return {
                ...state,
                getBlogsLoading: true,
                getBlogsError: null,
                getBlogsSuccess: null,
            };
        case GET_BLOGS_SUCCESS:
            return {
                ...state,
                getBlogsLoading: false,
                getBlogsSuccess: action.payload.message,
                blogs: action.payload.data,
                meta: action.payload.meta
            };
        case GET_BLOGS_FAILURE:
            return {
                ...state,
                getBlogsLoading: false,
                getBlogsError: action.payload,
            };

        // Get Blog
        case GET_BLOG_REQUEST:
            return {
                ...state,
                getBlogLoading: true,
                getBlogError: null,
                getBlogSuccess: null,
            };
        case GET_BLOG_SUCCESS:
            return {
                ...state,
                getBlogLoading: false,
                getBlogSuccess: action.payload.message,
                blog: action.payload.data,
            };
        case GET_BLOG_FAILURE:
            return {
                ...state,
                getBlogLoading: false,
                getBlogError: action.payload,
            };

        // Create Blog
        case CREATE_BLOG_REQUEST:
            return {
                ...state,
                createBlogLoading: true,
                createBlogError: null,
                createBlogSuccess: null,
            };
        case CREATE_BLOG_SUCCESS:
            return {
                ...state,
                createBlogLoading: false,
                createBlogSuccess: action.payload.message,
                blogs: [action.payload.data, ...state.blogs],
            };
        case CREATE_BLOG_FAILURE:
            return {
                ...state,
                createBlogLoading: false,
                createBlogError: action.payload,
            };

        // Update Blog
        case UPDATE_BLOG_REQUEST:
            return {
                ...state,
                updateBlogLoading: true,
                updateBlogError: null,
                updateBlogSuccess: null,
            };
        case UPDATE_BLOG_SUCCESS:
            return {
                ...state,
                updateBlogLoading: false,
                updateBlogSuccess: action.payload.message,
                blog: action.payload.data,
                blogs: state.blogs.map(b => b.id === action.payload.data.id ? action.payload.data : b)
            };
        case UPDATE_BLOG_FAILURE:
            return {
                ...state,
                updateBlogLoading: false,
                updateBlogError: action.payload,
            };

        // Delete Blog
        case DELETE_BLOG_REQUEST:
            return {
                ...state,
                deleteBlogLoading: true,
                deleteBlogError: null,
                deleteBlogSuccess: null,
            };
        case DELETE_BLOG_SUCCESS:
            return {
                ...state,
                deleteBlogLoading: false,
                deleteBlogSuccess: action.payload.message,
                blogs: state.blogs.filter(b => b.id !== action.payload.data?.id),
                blog: state.blog?.id === action.payload.data?.id ? null : state.blog
            };
        case DELETE_BLOG_FAILURE:
            return {
                ...state,
                deleteBlogLoading: false,
                deleteBlogError: action.payload,
            };

        case CLEAR_BLOG_ERRORS:
            return {
                ...state,
                getBlogsError: null,
                getBlogError: null,
                createBlogError: null,
                updateBlogError: null,
                deleteBlogError: null,
                getBlogsSuccess: null,
                getBlogSuccess: null,
                createBlogSuccess: null,
                updateBlogSuccess: null,
                deleteBlogSuccess: null,
            };

        default:
            return state;
    }
};

export default blogReducer;
