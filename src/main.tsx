import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { PopupProvider } from "./context/PopupContext.tsx";
import { AlertProvider } from "./context/AlertContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { LocationProvider } from "./context/LocationContext.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
import { PaginationProvider } from "./context/PaginationContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  //   <ThemeProvider>
  //     <AppWrapper>
  //       <App />
  //     </AppWrapper>
  //   </ThemeProvider>
  // </StrictMode>,
  <ThemeProvider>
    <BrowserRouter>
      <AppWrapper>
        <SocketProvider>
          <LoadingProvider>
            <ToastProvider>
              <LocationProvider>
                <AuthProvider>
                  <NotificationProvider>
                    <PopupProvider>
                      <AlertProvider>
                        <PaginationProvider>
                          <App />
                        </PaginationProvider>


                      </AlertProvider>
                    </PopupProvider>
                  </NotificationProvider>
                </AuthProvider>
              </LocationProvider>
            </ToastProvider>
          </LoadingProvider>
        </SocketProvider>

      </AppWrapper>
    </BrowserRouter>
  </ThemeProvider>
);
