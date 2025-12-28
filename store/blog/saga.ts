import { takeEvery, put, call } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
    getBlogsSuccess,
    getBlogsFailure,
    getBlogSuccess,
    getBlogFailure,
    createBlogSuccess,
    createBlogFailure,
    updateBlogSuccess,
    updateBlogFailure,
    deleteBlogSuccess,
    deleteBlogFailure
} from "./action";
import {
    GET_BLOGS_REQUEST,
    GET_BLOG_REQUEST,
    CREATE_BLOG_REQUEST,
    UPDATE_BLOG_REQUEST,
    DELETE_BLOG_REQUEST
} from "./actionType";

import api from "../api";
function getBlogsApi(params: { page: number; limit: number; search?: string }) {
    return api.get("blogs", { params });
}

function getBlogApi(payload: { blog_id: string }) {
    return api.get(`blogs/${payload.blog_id}`);
}

function createBlogApi(payload: any) {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
        if (key === 'tags' && Array.isArray(payload[key])) {
            payload[key].forEach((tag: string) => formData.append('tags', tag));
        } else {
            formData.append(key, payload[key]);
        }
    });

    return api.post("blogs", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function updateBlogApi(payload: { blog_id: string;[key: string]: any }) {
    const { blog_id, ...data } = payload;
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'tags' && Array.isArray(data[key])) {
            data[key].forEach((tag: string) => formData.append('tags', tag));
        } else {
            formData.append(key, data[key]);
        }
    });

    return api.put(`blogs/${blog_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function deleteBlogApi(payload: { blog_id: string }) {
    return api.delete(`blogs/${payload.blog_id}`);
}

// Saga handlers
function* onGetBlogs({ payload }: { type: string; payload: any }): SagaIterator {
    try {
        const response = yield call(getBlogsApi, payload);
        if (response.data.success) {
            yield put(getBlogsSuccess(response.data));
        } else {
            yield put(getBlogsFailure(response.data.message || "Failed to fetch blogs"));
        }
    } catch (error: any) {
        yield put(getBlogsFailure(error.response?.data?.message || "Failed to fetch blogs"));
    }
}

function* onGetBlog({ payload }: { type: string; payload: any }): SagaIterator {
    try {
        const response = yield call(getBlogApi, payload);
        if (response.data.success) {
            yield put(getBlogSuccess(response.data));
        } else {
            yield put(getBlogFailure(response.data.message || "Failed to fetch blog"));
        }
    } catch (error: any) {
        yield put(getBlogFailure(error.response?.data?.message || "Failed to fetch blog"));
    }
}

function* onCreateBlog({ payload }: { type: string; payload: any }): SagaIterator {
    try {
        const response = yield call(createBlogApi, payload);
        if (response.data.success) {
            yield put(createBlogSuccess(response.data));
        } else {
            yield put(createBlogFailure(response.data.message || "Failed to create blog"));
        }
    } catch (error: any) {
        yield put(createBlogFailure(error.response?.data?.message || "Failed to create blog"));
    }
}

function* onUpdateBlog({ payload }: { type: string; payload: any }): SagaIterator {
    try {
        const response = yield call(updateBlogApi, payload);
        if (response.data.success) {
            yield put(updateBlogSuccess(response.data));
        } else {
            yield put(updateBlogFailure(response.data.message || "Failed to update blog"));
        }
    } catch (error: any) {
        yield put(updateBlogFailure(error.response?.data?.message || "Failed to update blog"));
    }
}

function* onDeleteBlog({ payload }: { type: string; payload: any }): SagaIterator {
    try {
        const response = yield call(deleteBlogApi, payload);
        if (response.data.success) {
            // Since API returns data: null on delete, we inject the ID to help the reducer
            yield put(deleteBlogSuccess({ ...response.data, data: { id: payload.blog_id } }));
        } else {
            yield put(deleteBlogFailure(response.data.message || "Failed to delete blog"));
        }
    } catch (error: any) {
        yield put(deleteBlogFailure(error.response?.data?.message || "Failed to delete blog"));
    }
}

// Export saga
export default function* blogSaga(): SagaIterator {
    yield takeEvery(GET_BLOGS_REQUEST, onGetBlogs);
    yield takeEvery(GET_BLOG_REQUEST, onGetBlog);
    yield takeEvery(CREATE_BLOG_REQUEST, onCreateBlog);
    yield takeEvery(UPDATE_BLOG_REQUEST, onUpdateBlog);
    yield takeEvery(DELETE_BLOG_REQUEST, onDeleteBlog);
}
