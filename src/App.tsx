import { BrowserRouter as Router, Routes, Route } from "react-router";
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
import Control from "./pages/Control/Control";
import Monitor from "./pages/Monitor/Monitor";
import Hardware from "./pages/Device/Hardware";
import PopupExample from "./pages/UiElements/PopupExample";
import AccessGroup from "./pages/AccessGroup/AccessGroup";
import Door from "./pages/Door/Door";
import Credential from "./pages/Credential/Credential";
import TimeZone from "./pages/TimeZone/TimeZone";
import CardFormat from "./pages/CardFormat/CardFormat";
import Alert from "./components/ui/alert/Alert";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { HubEndPoint } from "./constants/constant";
import { VerifyScpConfigDto } from "./constants/types";

//

const server = import.meta.env.VITE_SERVER_IP;

export default function App() {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  let tag = "";
  const [message, setMessage] = useState<string>("");
  const handleClick = () => {
    setIsShow(false);
    setMessage("")
  }
  useEffect(() => {
    const cmndConnection = new signalR.HubConnectionBuilder()
      .withUrl(server + HubEndPoint.CMND_HUB)
      .withAutomaticReconnect()
      .build();

    cmndConnection.start().then(() => {
      console.log("Connected to SignalR event hub");
    }).catch(e => {
      console.log(e);
    });

    cmndConnection.on(
      "CmndStatus",
      (CmndStatus: number, TagNumber: number, NakReason: string, NakDescriptionCode: number) => {
        console.log(CmndStatus)
        console.log(TagNumber)
        console.log(NakReason)
        console.log(NakDescriptionCode)

        if (CmndStatus == 1) {
          setIsSuccess(true);
        } else {
          setIsSuccess(false);
        }
        tag = TagNumber.toString();
        setIsShow(true);
        setMessage("tag (" + tag + ")" + " " + message);

      }
    );

    cmndConnection.on(
      "VerifyConfig", (data: VerifyScpConfigDto) => {
        console.log(data);
      }
    )

    return () => {
      cmndConnection.stop();
    };
  }, [])
  return (
    <>

      <Router>
        {isShow &&
          <div onClick={handleClick} className="transition-opacity duration-500 opacity-100 hover:opacity-0">
            <Alert
              isFixed={true}
              variant={isSuccess ? "success" : "error"}
              title={isSuccess ? "Command Success" : "Command Error"}
              message={message}
              showLink={false}
            />

          </div>
        }


        <ScrollToTop />


        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {/* ACS */}
            <Route path="/hardware" element={<Hardware />} />
            <Route path="/module" element={<Module />} />
            <Route path="/event" element={<Event />} />
            <Route path="/control" element={<Control />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/popup" element={<PopupExample />} />
            <Route path="/door" element={<Door />} />
            <Route path="/group" element={<AccessGroup />} />
            <Route path="/timezone" element={<TimeZone />} />
            <Route path="/card" element={<Credential />} />
            <Route path="/card-format" element={<CardFormat />} />

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
      </Router>
    </>
  );
}
