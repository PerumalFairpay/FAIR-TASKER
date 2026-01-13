import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    CREATE_BLOG_REQUEST,
    GET_BLOGS_REQUEST,
    GET_BLOG_REQUEST,
    UPDATE_BLOG_REQUEST,
    DELETE_BLOG_REQUEST
} from "./actionType";
import {
    createBlogSuccess, createBlogFailure,
    getBlogsSuccess, getBlogsFailure,
    getBlogSuccess, getBlogFailure,
    updateBlogSuccess, updateBlogFailure,
    deleteBlogSuccess, deleteBlogFailure
} from "./action";
import api from "../api";

// API Functions
function createBlogApi(payload: FormData) {
    return api.post("/blogs/create", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function getBlogsApi(params: { page?: number, limit?: number, search?: string }) {
    const { page = 1, limit = 10, search = "" } = params;
    return api.get(`/blogs/all?page=${page}&limit=${limit}&search=${search}`);
}

function getBlogApi(id: string) {
    return api.get(`/blogs/${id}`);
}

function updateBlogApi(id: string, payload: FormData) {
    return api.put(`/blogs/update/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function deleteBlogApi(id: string) {
    return api.delete(`/blogs/delete/${id}`);
}

// Sagas
function* onCreateBlog({ payload }: any): SagaIterator {
    try {
        const response = yield call(createBlogApi, payload);
        yield put(createBlogSuccess(response.data));
    } catch (error: any) {
        yield put(createBlogFailure(error.response?.data?.message || "Failed to create blog"));
    }
}

function* onGetBlogs({ payload }: any): SagaIterator {
    try {
        const response = yield call(getBlogsApi, payload);
        yield put(getBlogsSuccess(response.data));
    } catch (error: any) {
        yield put(getBlogsFailure(error.response?.data?.message || "Failed to fetch blogs"));
    }
}

function* onGetBlog({ payload }: any): SagaIterator {
    try {
        const response = yield call(getBlogApi, payload);
        yield put(getBlogSuccess(response.data));
    } catch (error: any) {
        yield put(getBlogFailure(error.response?.data?.message || "Failed to fetch blog"));
    }
}

function* onUpdateBlog({ payload }: any): SagaIterator {
    try {
        const { id, payload: data } = payload;
        const response = yield call(updateBlogApi, id, data);
        yield put(updateBlogSuccess(response.data));
    } catch (error: any) {
        yield put(updateBlogFailure(error.response?.data?.message || "Failed to update blog"));
    }
}

function* onDeleteBlog({ payload }: any): SagaIterator {
    try {
        const response = yield call(deleteBlogApi, payload);
        yield put(deleteBlogSuccess({ ...response.data, id: payload }));
    } catch (error: any) {
        yield put(deleteBlogFailure(error.response?.data?.message || "Failed to delete blog"));
    }
}

export default function* blogSaga(): SagaIterator {
    yield takeEvery(CREATE_BLOG_REQUEST, onCreateBlog);
    yield takeEvery(GET_BLOGS_REQUEST, onGetBlogs);
    yield takeEvery(GET_BLOG_REQUEST, onGetBlog);
    yield takeEvery(UPDATE_BLOG_REQUEST, onUpdateBlog);
    yield takeEvery(DELETE_BLOG_REQUEST, onDeleteBlog);
}
