import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

// ACS
import Module from "./pages/Module/Module";
import Event from "./pages/Event/Event";
import ControlPoint from "./pages/ControlPoint/ControlPoint";
import MonitorPoint from "./pages/MonitorPoint/MonitorPoint";
import Hardware from "./pages/Hardware/Hardware";
import PopupExample from "./pages/UiElements/PopupExample";
import AccessGroup from "./pages/AccessGroup/AccessGroup";
import Door from "./pages/Door/Door";
import CardHolder from "./pages/CardHolder/CardHolder";
import TimeZone from "./pages/TimeZone/TimeZone";
import CardFormat from "./pages/CardFormat/CardFormat";
import Alert from "./components/ui/alert/Alert";
import { useEffect, useState } from "react";
import Holiday from "./pages/Holiday/Holiday";
import Interval from "./pages/Interval/Interval";
import { useAlert } from "./context/AlertContext";
import SignalRService from "./services/SignalRService";
import Toast from "./pages/UiElements/Toast";
import { useToast } from "./context/ToastContext";
import { Area } from "./icons";
import { Led } from "./pages/Led/Led";



export default function App() {
  const navigate = useNavigate();
  const { showAlertFlag, alertSuccessFlag, alertMessage } = useAlert();
  const { showToast,setShowToast,toastMessage,toastType } = useToast();
  const [isResetShow, setIsResetShow] = useState<boolean>(false);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(false);
  const toggleIsUploadShow = () => {
    setIsResetShow(false);
    setIsUploadShow(false);
  }
  const [message, setMessage] = useState<string>("");



  useEffect(() => {
    SignalRService.getConnection();

    return () => {
      SignalRService.stopConnection();
    };
  }, [])

  return (
    <>
      <div>
        {showToast && (
          <Toast
            type={toastType}
            message={toastMessage}
            duration={3000}
            onClose={() => setShowToast(false)}
          />
        )}

        {showAlertFlag &&
          <div className="transition-opacity duration-500 opacity-100 hover:opacity-0">
            <Alert
              isFixed={true}
              variant={alertSuccessFlag ? "success" : "error"}
              title={alertSuccessFlag ? "Command Success" : "Command Error"}
              message={alertMessage ? alertMessage : ""}
              showLink={false}
            />

          </div>

        }

        {isUploadShow &&
          <div onClick={() => navigate("/hardware")} className="cursor-pointer transition-opacity duration-500 opacity-100">
            <Alert
              isFixed={true}
              variant="warning"
              title="Data Mismatch (Sync Require)"
              message={message}
              showLink={false}
              isTop={false}
            />
          </div>
        }

        {isResetShow &&
          <div onClick={() => navigate("/hardware")} className="cursor-pointer transition-opacity duration-500 opacity-100">
            <Alert
              isFixed={true}
              variant="warning"
              title="Reset (Reset Require)"
              message={message}
              showLink={false}
              isTop={false}
            />
          </div>
        }
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {/* ACS */}
            <Route path="/hardware" element={<Hardware onUploadClick={toggleIsUploadShow} />} />
            <Route path="/module" element={<Module />} />
            <Route path="/event" element={<Event />} />
            <Route path="/control" element={<ControlPoint />} />
            <Route path="/monitor" element={<MonitorPoint />} />
            <Route path="/popup" element={<PopupExample />} />
            <Route path="/door" element={<Door />} />
            <Route path="/group" element={<AccessGroup />} />
            <Route path="/area" element={<Area/>}/>
            <Route path="/timezone" element={<TimeZone />} />
            <Route path="/cardholder" element={<CardHolder/>} />
            <Route path="/cardformat" element={<CardFormat />} />
            <Route path="/led" element={<Led/>}/>
            <Route path="/holiday" element={<Holiday />} />
            <Route path="/interval" element={<Interval />} />
            <Route path="/monitorgroup" element={<Interval />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
