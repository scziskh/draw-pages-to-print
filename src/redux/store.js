import { combineReducers, configureStore } from "@reduxjs/toolkit";
import pdfPropsReducer from "./reducers/fileList";

const rootReducer = combineReducers({ pdfPropsReducer });

export const store = configureStore({ reducer: rootReducer });
