import { all } from "redux-saga/effects";
import blogSaga from "./blog/saga";
import authSaga from "./auth/saga";
import settingsSaga from "./settings/saga";
import departmentSaga from "./department/saga";
import roleSaga from "./role/saga";
import employeeSaga from "./employee/saga";



export default function* rootSaga() {
  yield all([
    blogSaga(),
    authSaga(),
    settingsSaga(),
    departmentSaga(),
    roleSaga(),
    employeeSaga(),

  ]);
}