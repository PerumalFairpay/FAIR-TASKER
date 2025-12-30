import { combineReducers } from "redux";
import blogReducer from "./blog/reducer";
import authReducer from "./auth/reducer";
import settingsReducer from "./settings/reducer";
import departmentReducer from "./department/reducer";



const rootReducer = combineReducers({
      Blog: blogReducer,
      Auth: authReducer,
      Settings: settingsReducer,
      Department: departmentReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
