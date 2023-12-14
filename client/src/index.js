import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/Context/AuthContext";
import { PageProvider } from "./components/Context/SelectedPageContext";
import { BookProvider } from "./components/Context/BookingContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="605576318471-9dnqer5ald7ph9ksedd1o3c6k7admp4l.apps.googleusercontent.com">
      <I18nextProvider i18n={i18next}>
        <AuthProvider>
          <PageProvider>
            <BookProvider>
              <App />
            </BookProvider>
          </PageProvider>
        </AuthProvider>
      </I18nextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
