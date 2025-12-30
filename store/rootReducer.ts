import { combineReducers } from "redux";
import blogReducer from "./blog/reducer";
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
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
