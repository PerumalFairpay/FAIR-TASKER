import { all, fork } from "redux-saga/effects";
import authSaga from "./auth/saga";
import departmentSaga from "./department/saga";
import roleSaga from "./role/saga";
import employeeSaga from "./employee/saga";
import expenseCategorySaga from "./expenseCategory/saga";
import expenseSaga from "./expense/saga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(departmentSaga),
    fork(roleSaga),
    fork(employeeSaga),
    fork(expenseCategorySaga),
    fork(expenseSaga),
  ]);
}