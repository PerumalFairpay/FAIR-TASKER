import { combineReducers } from "redux";
import blogReducer from "./blog/reducer";
import authReducer from "./auth/reducer";

const rootReducer = combineReducers({
      Blog: blogReducer,
      Auth: authReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
