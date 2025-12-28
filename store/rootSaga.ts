import { all } from "redux-saga/effects";
import blogSaga from "./blog/saga";
import authSaga from "./auth/saga";
import settingsSaga from "./settings/saga";

export default function* rootSaga() {
  yield all([
    blogSaga(),
    authSaga(),
    settingsSaga(),
  ]);
}