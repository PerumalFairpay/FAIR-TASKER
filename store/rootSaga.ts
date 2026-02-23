import { all, fork } from "redux-saga/effects";
import authSaga from "./auth/saga";
import departmentSaga from "./department/saga";
import roleSaga from "./role/saga";
import employeeSaga from "./employee/saga";
import expenseCategorySaga from "./expenseCategory/saga";
import expenseSaga from "./expense/saga";
import documentCategorySaga from "./documentCategory/saga";
import documentSaga from "./document/saga";
import clientSaga from "./client/saga";
import projectSaga from "./project/saga";
import holidaySaga from "./holiday/saga";
import assetCategorySaga from "./assetCategory/saga";
import assetSaga from "./asset/saga";
import blogSaga from "./blog/saga";
import leaveTypeSaga from "./leaveType/saga";
import leaveRequestSaga from "./leaveRequest/saga";
import taskSaga from "./task/saga";
import attendanceSaga from "./attendance/saga";
import permissionSaga from "./permission/saga";
import dashboardSaga from "./dashboard/saga";
import profileSaga from "./profile/saga";
import settingsSaga from "./settings/saga";
import ndaSaga from "./nda/saga";
import payslipSaga from "./payslip/saga";
import payslipComponentSaga from "./payslipComponent/saga";
import feedbackSaga from "./feedback/saga";
import shiftSaga from "./shift/saga";
import milestoneRoadmapSaga from "./milestoneRoadmap/saga";

export default function* rootSaga() {
  yield all([
    fork(shiftSaga),
    fork(authSaga),
    fork(departmentSaga),
    fork(roleSaga),
    fork(employeeSaga),
    fork(expenseCategorySaga),
    fork(expenseSaga),
    fork(documentCategorySaga),
    fork(documentSaga),
    fork(clientSaga),
    fork(projectSaga),
    fork(holidaySaga),
    fork(assetCategorySaga),
    fork(assetSaga),
    fork(blogSaga),
    fork(leaveTypeSaga),
    fork(leaveRequestSaga),
    fork(taskSaga),
    fork(attendanceSaga),
    fork(permissionSaga),
    fork(dashboardSaga),
    fork(profileSaga),
    fork(settingsSaga),
    fork(ndaSaga),
    fork(payslipSaga),
    fork(payslipComponentSaga),
    fork(feedbackSaga),
    fork(milestoneRoadmapSaga),
  ]);
}
