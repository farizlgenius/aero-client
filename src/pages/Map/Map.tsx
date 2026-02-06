import { SetStateAction, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { OnIcon } from "../../icons";
import { FormContent } from "../../model/Form/FormContent";
import { BaseForm } from "../UiElements/BaseForm";
import { MapForm } from "./MapForm";
import { FormType } from "../../model/Form/FormProp";
import { MapDto } from "../../model/Map/MapDto";
import { BaseTable } from "../UiElements/BaseTable";
import { FeatureId } from "../../enum/FeatureId";
import { useAuth } from "../../context/AuthContext";
import { usePopup } from "../../context/PopupContext";
import { send } from "../../api/api";
import { MapEndpoint } from "../../endpoint/MapEndpoint";
import { useLocation } from "../../context/LocationContext";
import Helper from "../../utility/Helper";
import { HolidayToast, MapToast } from "../../model/ToastMessage";
import { useToast } from "../../context/ToastContext";

export const Map = () => {
      const defaultDto: MapDto = {
            componentId:0
      }
      const { toggleToast } = useToast();
      const { filterPermission } = useAuth();
      const { setCreate, setUpdate, setRemove, setConfirmCreate, setConfirmRemove, setConfirmUpdate, setInfo, setMessage } = usePopup();
      const [refresh, setRefresh] = useState(false);
      const { locationId } = useLocation();
      const toggleRefresh = () => setRefresh(!refresh);
      const [mapDto, setMapDto] = useState<MapDto>(defaultDto);
      const [formType, setFormType] = useState<FormType>(FormType.CREATE);
      const [selectedObjects, setSelectedObjects] = useState<MapDto[]>([]);
      const [form, setForm] = useState<boolean>(false);

      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            switch (e.currentTarget.name) {
                  case "add":
                        setFormType(FormType.CREATE);
                        setForm(true);
                        break;
                  case "delete":
                        if (selectedObjects.length == 0) {
                              setMessage("Please select object")
                              setInfo(true);
                        }
                        setConfirmRemove(() => async () => {
                              var data: number[] = [];
                              selectedObjects.map(async (a: MapDto) => {
                                    data.push(a.componentId)
                              })
                              var res = await send.post(MapEndpoint.DELETE_RANGE, data)
                              if (Helper.handleToastByResCode(res, MapToast.DELETE_RANGE, toggleToast)) {
                                    setSelectedObjects([])
                                    toggleRefresh();
                              }
                        })
                        setRemove(true);
                        break;
                  case "create":
                        setConfirmCreate(() => async () => {
                              const res = await send.post(MapEndpoint.CREATE, mapDto);
                              if (Helper.handleToastByResCode(res, HolidayToast.CREATE, toggleToast)) {
                                    setMapDto(defaultDto);
                                    setForm(false);
                                    toggleRefresh();
                              }
                        })
                        setCreate(true);
                        break;
                  case "update":
                        setConfirmUpdate(() => async () => {
                              const res = await send.put(MapEndpoint.UPDATE, mapDto);
                              if (Helper.handleToastByResCode(res, HolidayToast.UPDATE, toggleToast)) {
                                    setMapDto(defaultDto)
                                    setForm(false);
                                    toggleRefresh();
                              }
                        })
                        setUpdate(true)
                        break;
                  case "cancle":
                  case "close":
                        setForm(false);
                        break;
                  default:
                        break;
            }
      }
      const handleEdit = (data: MapDto) => {
            setFormType(FormType.UPDATE)
            setMapDto(data)
            setForm(true);
      }
      const handleRemove = (data: MapDto) => {
            setConfirmRemove(() => async () => {
                  const res = await send.delete(MapEndpoint.DELETE(data.componentId))
                  if (Helper.handleToastByResCode(res, MapToast.DELETE, toggleToast))
                        toggleRefresh();
            })
            setRemove(true);
      }
      const handleInfo = (data: MapDto) => {
            setFormType(FormType.INFO);
            setMapDto(data)
            setForm(true);
      }
      const fetchData = async () => {
            const res = await send.get(MapEndpoint.GET(locationId));
            if (res && res.data.data) {
                  console.log(res.data.data);
                  setMapDto(res.data.data);
            }
      }
      useEffect(() => {
            fetchData();
      }, [refresh]);
      const content: FormContent[] = [
            {
                  label: "Maps",
                  icon: <OnIcon />,
                  content: <MapForm type={formType} setDto={setMapDto} handleClick={handleClick} dto={mapDto} />
            }
      ];
      return (<>
            <PageBreadcrumb pageTitle="Maps" />
            {
                  form ?
                        <BaseForm tabContent={content} />
                        :
                        <BaseTable<MapDto> data={[]} onInfo={handleInfo} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClick} select={selectedObjects} setSelect={setSelectedObjects} permission={filterPermission(FeatureId.MAP)} />

            }

      </>);
}