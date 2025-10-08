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
        <PopupProvider>
          <AlertProvider>
            <App />
          </AlertProvider>
        </PopupProvider>
      </AppWrapper>
    </BrowserRouter>
  </ThemeProvider>
);
