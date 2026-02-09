import { combineReducers } from "redux";
// import blogReducer from "./blog/reducer";
import authReducer from "./auth/reducer";
import settingsReducer from "./settings/reducer";
import departmentReducer from "./department/reducer";
import roleReducer from "./role/reducer";
import employeeReducer from "./employee/reducer";
import expenseCategoryReducer from "./expenseCategory/reducer";
import expenseReducer from "./expense/reducer";
import documentCategoryReducer from "./documentCategory/reducer";
import documentReducer from "./document/reducer";
import clientReducer from "./client/reducer";
import projectReducer from "./project/reducer";
import holidayReducer from "./holiday/reducer";
import assetCategoryReducer from "./assetCategory/reducer";
import assetReducer from "./asset/reducer";
import blogReducer from "./blog/reducer";
import leaveTypeReducer from "./leaveType/reducer";
import leaveRequestReducer from "./leaveRequest/reducer";
import taskReducer from "./task/reducer";
import attendanceReducer from "./attendance/reducer";
import permissionReducer from "./permission/reducer";
import dashboardReducer from "./dashboard/reducer";
import profileReducer from "./profile/reducer";
import ndaReducer from "./nda/reducer";
import payslipReducer from "./payslip/reducer";

const rootReducer = combineReducers({
  Blog: blogReducer,
  Auth: authReducer,
  Settings: settingsReducer,
  Department: departmentReducer,
  Role: roleReducer,
  Employee: employeeReducer,
  ExpenseCategory: expenseCategoryReducer,
  Expense: expenseReducer,
  DocumentCategory: documentCategoryReducer,
  Document: documentReducer,
  Client: clientReducer,
  Project: projectReducer,
  Holiday: holidayReducer,
  AssetCategory: assetCategoryReducer,
  Asset: assetReducer,
  LeaveType: leaveTypeReducer,
  LeaveRequest: leaveRequestReducer,
  Task: taskReducer,
  Attendance: attendanceReducer,
  Permission: permissionReducer,
  Dashboard: dashboardReducer,
  Profile: profileReducer,
  NDA: ndaReducer,
  Payslip: payslipReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
