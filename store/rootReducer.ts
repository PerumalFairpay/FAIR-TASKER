import { combineReducers } from "redux";
import blogReducer from "./blog/reducer";
import authReducer from "./auth/reducer";
import settingsReducer from "./settings/reducer";
import departmentReducer from "./department/reducer";
import roleReducer from "./role/reducer";
import employeeReducer from "./employee/reducer";



const rootReducer = combineReducers({
      Blog: blogReducer,
      Auth: authReducer,
      Settings: settingsReducer,
      Department: departmentReducer,
      Role: roleReducer,
      Employee: employeeReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
