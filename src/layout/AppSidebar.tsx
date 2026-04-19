import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  ModuleIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  EventIcon,
  DoorIcon,
  GroupIcon,
  SettingIcon,
  ReportIcon,
  CardIcon,
  AreaIcon,
  LocationIcon,
  TriggerIcon,
  OperatorIcon,
  NotiIcon,
  ControlIcon,
  MonitorIcon,
  OnIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";


type NavItem = {
  id?: number;
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};


const navItems: NavItem[] = [

  {
    id: 1,
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/"
  },
  {
    id: 2,
    name: "Events",
    icon: <EventIcon />,
    path: "/event"
  },
  {
    id: 3,
    name: "Locations",
    icon: <LocationIcon />,
    subItems: [{ name: "Location", path: "/location", }, { name: "Company", path: "/company", },{ name: "Department", path: "/department", },{ name: "Position", path: "/position", }],
  },
  {
    id: 4,
    name: "Alerts",
    icon: <NotiIcon />,
    path: "/"
  },
  {
    id: 5,
    name: "Operators",
    icon: <OperatorIcon />,
    subItems: [{ name: "Operator", path: "/operator" }, { name: "Role", path: "/role" }],
  },
  {
    id: 6,
    name: "Devices",
    icon: <ModuleIcon />,
    subItems: [{ name: "Controller", path: "/hardware", }, { name: "Module", path: "/module", },{ name: "Lift Controller", path: "/lift", },{ name: "Face Reader", path: "/face", }],
  },{
    id: 7,
    name:"Control Point",
    icon:<ControlIcon />,
    path:"/control"
  },{
    id:8,
    name:"Monitor Point",
    icon:<MonitorIcon/>,
    path:"/monitor"
  },{ 
    id:9,
    name: "Monitor Point Group",
    icon:<GroupIcon/>, 
    path: "/monitorgroup", },
  {
    id: 10,
    icon: <DoorIcon />,
    name: "ACR",
    subItems: [{ name: "Door", path: "/door", }, { name: "Lift", path: "/lift", },{ name: "HL", path: "/hl", },{name:"Time Attendance",path:"/ta"},{name:"Guard Tour",path:"/guard"}],
  }, {
    id: 11,
    icon: <CardIcon />,
    name: "Users",
    path: "/cardholder",
  }, {
    id: 12,
    icon: <GroupIcon />,
    name: "Access Level",
    path: "/level",
  }, {
    id: 13,
    icon: <AreaIcon />,
    name: "Access Area",
    path: "/area",
  },
  {
    id: 14,
    icon: <CalenderIcon />,
    name: "Time",
    subItems: [{ name: "Time Zone", path: "/timezone", }, { name: "Holiday", path: "/holiday", }, { name: "Interval", path: "/interval", }],
  },
  {
    id: 15,
    icon: <TriggerIcon />,
    name: "Trigger & Procedure",
    subItems: [{ name: "Trigger", path: "/trigger", }, { name: "Procedure", path: "/procedure", }],
  },{
    id:16,
    name:"Map",
    icon:<OnIcon/>,
    path:"/map"
  },
  {
    id: 17,
    icon: <ReportIcon />,
    name: "Reports",
    subItems: [{ name: "Transaction", path: "/report", }, { name: "Audit Trail", path: "/audit", }, { name: "Time Attendance", path: "/attendance", }],
  },
  {
    id: 18,
    icon: <SettingIcon />,
    name: "Settings",
    subItems: [{ name: "Card Format", path: "/cardformat", }, { name: "Reader LED", path: "/led", },{name:"Password Rule",path:"/pass"},{ name: "Send Command", path: "/command", }, { name: "Status", path: "/status", }],
  }
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", },
      { name: "Bar Chart", path: "/bar-chart", },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", },
      { name: "Avatar", path: "/avatars", },
      { name: "Badge", path: "/badge", },
      { name: "Buttons", path: "/buttons", },
      { name: "Images", path: "/images", },
      { name: "Videos", path: "/videos", },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", },
      { name: "Sign Up", path: "/signup", },
    ],
  }
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const {isAllowedPermission} = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );



  useEffect(() => {

    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            // <button
            //   onClick={() => handleSubmenuToggle(index, menuType)}
            //   className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
            //       ? "menu-item-active"
            //       : "menu-item-inactive"
            //     } cursor-pointer ${!isExpanded && !isHovered
            //       ? "lg:justify-center"
            //       : "lg:justify-start"
            //     }`}
            // >
            //   <span
            //     className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
            //         ? "menu-item-icon-active"
            //         : "menu-item-icon-inactive"
            //       }`}
            //   >
            //     {nav.icon}
            //   </span>
            //   {(isExpanded || isHovered || isMobileOpen) && (
            //     <span className="menu-item-text">{nav.name}</span>
            //   )}
            //   {(isExpanded || isHovered || isMobileOpen) && (
            //     <ChevronDownIcon
            //       className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
            //           openSubmenu?.index === index
            //           ? "rotate-180 text-brand-500"
            //           : ""
            //         }`}
            //     />
            //   )}
            // </button>
            <button
              onClick={() => {
                if (isAllowedPermission(nav.id ?? 0)) return;
                handleSubmenuToggle(index, menuType);
              }}
              disabled={isAllowedPermission(nav.id ?? 0)}
              className={`menu-item group flex items-center gap-2 ${isAllowedPermission(nav.id ?? 0)
                  ? "opacity-50 cursor-not-allowed"
                  : openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive cursor-pointer hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-sidebar-hover-text)]"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size ${isAllowedPermission(nav.id ?? 0)
                    ? "text-gray-400 dark:text-gray-500"
                    : openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>

              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text text-inherit">
                  {nav.name}
                </span>
              )}

              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${isAllowedPermission(nav.id ?? 0)
                      ? "text-gray-400 dark:text-gray-500"
                      : openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? "rotate-180 text-[var(--app-sidebar-active-text)]"
                        : "text-[var(--app-sidebar-muted)]"
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              // <Link
              //   to={nav.path}
              //   className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
              //     }`}
              // >
              //   <span
              //     className={`menu-item-icon-size ${isActive(nav.path)
              //         ? "menu-item-icon-active"
              //         : "menu-item-icon-inactive"
              //       }`}
              //   >
              //     {nav.icon}
              //   </span>
              //   {(isExpanded || isHovered || isMobileOpen) && (
              //     <span className="menu-item-text">{nav.name}</span>
              //   )}
              // </Link>
                <Link
                  to={isAllowedPermission(nav.id ?? 0) ? "#" : nav.path ?? ""}
                  onClick={(e) => {
                    if (isAllowedPermission(nav.id ?? 0)) e.preventDefault();
                  }}
                  className={`menu-item group flex items-center gap-2 ${isAllowedPermission(nav.id ?? 0)
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : isActive(nav.path ?? "")
                        ? "menu-item-active"
                        : "menu-item-inactive hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-sidebar-hover-text)]"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size ${isAllowedPermission(nav.id ?? 0)
                        ? "text-gray-400 dark:text-gray-500"
                        : isActive(nav.path ?? "")
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text text-inherit">
                      {nav.name}
                    </span>
                  )}
                </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ml-8 mt-2 space-y-1 border-l border-[var(--app-sidebar-border)] pl-4">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                        } hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-sidebar-hover-text)]`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-[var(--app-sidebar-border)] bg-[var(--app-sidebar-bg)] px-4 text-[var(--app-sidebar-text)] shadow-theme-lg backdrop-blur-xl transition-all duration-300 ease-in-out lg:mt-0
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-6 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <div className={`w-full rounded-2xl border border-[var(--app-sidebar-border)] bg-[var(--app-sidebar-surface)] p-3 shadow-theme-sm ${!isExpanded && !isHovered ? "lg:w-auto lg:rounded-xl lg:p-2.5" : ""}`}>
          <Link to="/" className={`flex items-center gap-3 ${!isExpanded && !isHovered ? "lg:justify-center" : ""}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/12 text-brand-500 shadow-theme-xs">
              <img
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={22}
                height={22}
              />
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-[0.01em] text-[var(--app-sidebar-text)]">
                  Aero Console
                </span>
                <span className="block truncate text-[11px] uppercase tracking-[0.14em] text-[var(--app-sidebar-muted)]">
                  Cloud Management
                </span>
              </span>
            )}
          </Link>
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-[var(--app-sidebar-border)] bg-[var(--app-sidebar-section-bg)] p-3">
              <h2
                className={`mb-4 flex text-[11px] font-semibold uppercase leading-[20px] tracking-[0.14em] text-[var(--app-sidebar-muted)] ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Services"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="rounded-2xl border border-[var(--app-sidebar-border)] bg-[var(--app-sidebar-section-bg)] p-3">
              <h2
                className={`mb-4 flex text-[11px] font-semibold uppercase leading-[20px] tracking-[0.14em] text-[var(--app-sidebar-muted)] ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Tools"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
