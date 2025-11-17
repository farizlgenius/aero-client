import { useState } from "react"
import { BaseForm } from "../UiElements/BaseForm";

export const Location = () => {
    const [create,setCreate] = useState<boolean>(false);

    return (
    <>
    {create && <BaseForm/>}
    </>
)
}