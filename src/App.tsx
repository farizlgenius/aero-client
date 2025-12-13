import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router";
import { SignIn } from "./pages/AuthPages/SignIn";
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
import Transaction from "./pages/Transaction/Transaction";
import ControlPoint from "./pages/ControlPoint/ControlPoint";
import MonitorPoint from "./pages/MonitorPoint/MonitorPoint";
import Hardware from "./pages/Hardware/Hardware";
import PopupExample from "./pages/UiElements/PopupExample";
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
import { Led } from "./pages/Led/Led";
import { Location } from "./pages/Location/Location";
import { Area } from "./pages/Area/Area";
import { License } from "./pages/License/License";
import HttpRequest from "./utility/HttpRequest";
import { HttpMethod } from "./enum/HttpMethod";
import { LicenseEndpoint } from "./endpoint/LicenseEndpoint";
import { LoginDto } from "./model/Auth/LoginDto";
import { Role } from "./pages/Role/Role";
import { Operator } from "./pages/Operator/Operator";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { LocationModal } from "./components/form/location/LocationModal";
import { useLoading } from "./context/LoadingContext";
import { useLocation } from "./context/LocationContext";
import { MonitorGroup } from "./pages/MonitorGroup/MonitorGroup";
import AccessLevel from "./pages/AccessGroup/AccessLevel";
import { Procedure } from "./pages/Procedure/Procedure";
import { Trigger } from "./pages/Trigger/Trigger";


export default function App() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { show,locationId } = useLocation();
  const { showAlertFlag, alertSuccessFlag, alertMessage } = useAlert();
  const { showToast ,ToastContainer } = useToast();
  const { loading, Loading } = useLoading();
  const [isResetShow, setIsResetShow] = useState<boolean>(false);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(false);
  const [license, setLicense] = useState<boolean>(true);
  const [loginDto, setLoginDto] = useState<LoginDto>({
    username: "",
    password: ""
  })


  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.name) {
      case "login":
        const res = await signIn(loginDto.username, loginDto.password);
        console.log(res)
        if (res){
          navigate("/")
        }
        break;
      case "license":
        break;
      default:
        break;
    }
  }
  const toggleIsUploadShow = () => {
    setIsResetShow(false);
    setIsUploadShow(false);
  }
  const [message, setMessage] = useState<string>("");
  {/* License Check */ }
  const checkLicense = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, LicenseEndpoint.GET_LICENSE)
    if (res && res.data.data) {
      console.log(res.data.data)
      //setLicense(true);
    }
  }

  {/* License */ }
  const addLicense = async () => {
    const res = await HttpRequest.send(HttpMethod.POST, LicenseEndpoint.POST_LICENSE,)
    if (res && res.data.data) {
      console.log(res.data.data)
      //setLicense(true);
    }
  }


  useEffect(() => {
    checkLicense();
    if (!license) {
      navigate("/license")
    }

  }, [])

  return (
    <>
      <div>
         { show &&
          <LocationModal/>
         }
        {loading &&
          <Loading />
        }
        {showToast && (
          <>
            {/* <Toast
              type={toastType}
              message={toastMessage}
              duration={300000}
              onClose={() => setShowToast(false)}
            /> */}
            <ToastContainer/>
          </>

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
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>

          }>
            <Route index path="/" element={<Home />} />
            {/* ACS */}
            <Route path="/location" element={<Location />} />
            <Route path="/hardware" element={<Hardware />} />
            <Route path="/module" element={<Module />} />
            <Route path="/event" element={<Transaction />} />
            <Route path="/control" element={<ControlPoint />} />
            <Route path="/monitor" element={<MonitorPoint />} />
            <Route path="/popup" element={<PopupExample />} />
            <Route path="/door" element={<Door />} />
            <Route path="/level" element={<AccessLevel />} />
            <Route path="/area" element={<Area />} />
            <Route path="/timezone" element={<TimeZone />} />
            <Route path="/cardholder" element={<CardHolder />} />
            <Route path="/cardformat" element={<CardFormat />} />
            <Route path="/led" element={<Led />} />
            <Route path="/holiday" element={<Holiday />} />
            <Route path="/interval" element={<Interval />} />
            <Route path="/monitorgroup" element={<MonitorGroup/>} />
            <Route path="/role" element={<Role />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/procedure" element={<Procedure />} />
            <Route path="/trigger" element={<Trigger />} />

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
          <Route path="/login" element={<SignIn handleClick={handleClick} setDto={setLoginDto} />} />
          <Route path="/License" element={<License />} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </>
  );
}
