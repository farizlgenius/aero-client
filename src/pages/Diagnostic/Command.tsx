import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import ConsoleUI from "../UiElements/ConsoleUI"
import { send } from "../../api/api";
import Helper from "../../utility/Helper";
import { useToast } from "../../context/ToastContext";

export const Command = () => {
      const { toggleToast, updateToast } = useToast();
      const [command, setCommand] = useState<string>("");
      const [isSending, setIsSending] = useState<boolean>(false);

      const sendCommand = async () => {
            if (!command.trim() || isSending) return;

            setIsSending(true);
            const toastId = toggleToast("pending", "Sending command to server...");
            const res = await send.post("/api/diagnostic/command", { command: command });
            if(Helper.handleToastByResCode(res,"Command Sent Successfully",toggleToast, updateToast, toastId)){
                  console.log("Command Sent")
                  setCommand("");
            }
            setIsSending(false);
      }

      return (
            <>
                  <PageBreadcrumb pageTitle="Send Command" />

                  <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                              <div className="grid grid-cols-3 p-10 gap-4 rounded-xl border border-gray-200 p-6 dark:border-gray-800 border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] " >

                                    <div className="flex flex-col gap-2 col-span-2">
                                          <Label>ASCII Command</Label>
                                          <div >
                                                <TextArea value={command} onChange={(e) => setCommand(e)} />
                                          </div>

                                    </div>
                                    <div className="flex items-center justify-center gap-5 ">

                                          <Button onClick={() => sendCommand()} name="generate" className="w-1/3" disabled={isSending || !command.trim()}>
                                                {isSending ? "Sending..." : "Send"}
                                          </Button>
                                          <Button onClick={() => setCommand("")} name="clear" className="w-1/3" disabled={isSending} >Clear</Button>
                                    </div>
                              </div>
                        </div>
                        <div className="flex flex-col gap-2">
                               <ConsoleUI />
                              {/* <div className="grid grid-cols-3 p-10 gap-4 rounded-xl border border-gray-200 p-6 dark:border-gray-800 border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] " >
                                    <div className="col-span-3">
                                          <ConsoleUI />
                                    </div>
                              </div> */}
                        </div>
                  </div>


            </>)
}
