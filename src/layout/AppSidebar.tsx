import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {

  ChevronDownIcon,
  HorizontaLDots,

} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import {
  LayoutDashboard,
  Store,
  Scissors,
  CalendarCheck,
  CreditCard,
  BarChart3,
  Settings,
  List,
  Plus,
  ClipboardList,
  Receipt,
  TrendingUp,
  Users,
  User,
  UserCog,
  Clock,
  History,
  Wallet,
  PieChart,
  Search,
  CalendarDays,
  CheckCircle,
  BookOpen,
  UserCircle,
} from "lucide-react";


import {
  useAuthContext,
} from "~/context/AuthContext";

type SubItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  roles: string[]; // Array of roles that can access this item
  pro?: boolean;
  new?: boolean;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  roles: string[]; // Array of roles that can access this item
  path?: string;
  subItems?: SubItem[];
};



const navItems: NavItem[] = [

  // ─────────────────────────────────────────
  // ADMIN
  // ─────────────────────────────────────────

  {
    name: "Dashboard",
    icon: <LayoutDashboard />,
    roles: ["admin"],
    path: "/dashboard",
  },
  {
    name: "Salon Management",
    icon: <Store />,
    roles: ["admin"],
    subItems: [
      {
        name: "All Salons",
        icon: <List />,
        roles: ["admin"],
        path: "/salons",
      },
      {
        name: "Add Salon",
        icon: <Plus />,
        roles: ["admin"],
        path: "/salons/create",
      },
    ],
  },
  {
    name: "Service Management",
    icon: <Scissors />,
    roles: ["admin"],
    subItems: [
      {
        name: "Services Master",
        icon: <ClipboardList />,
        roles: ["admin"],
        path: "/services",
      },
      {
        name: "Add Service",
        icon: <Plus />,
        roles: ["admin"],
        path: "/services/create",
      },
    ],
  },
  {
    name: "Booking Management",
    icon: <CalendarCheck />,
    roles: ["admin"],
    path: "/bookings",
  },
  {
    name: "Transactions & Payments",
    icon: <CreditCard />,
    roles: ["admin"],
    subItems: [
      {
        name: "Transactions",
        icon: <Receipt />,
        roles: ["admin"],
        path: "/transactions",
      },
      {
        name: "Revenue Overview",
        icon: <TrendingUp />,
        roles: ["admin"],
        path: "/transactions/revenue",
      },
    ],
  },
  {
    name: "Reports & Analytics",
    icon: <BarChart3 />,
    roles: ["admin"],
    subItems: [
      {
        name: "Salon Report",
        icon: <Store />,
        roles: ["admin"],
        path: "/reports/salons",
      },
      {
        name: "Service Report",
        icon: <Scissors />,
        roles: ["admin"],
        path: "/reports/services",
      },
      {
        name: "Customer Report",
        icon: <Users />,
        roles: ["admin"],
        path: "/reports/customers",
      },
    ],
  },
  {
    name: "Settings",
    icon: <Settings />,
    roles: ["admin"],
    path: "/settings",
  },

  // ─────────────────────────────────────────
  // OWNER
  // ─────────────────────────────────────────

  {
    name: "Dashboard",
    icon: <LayoutDashboard />,
    roles: ["owner"],
    path: "/owner/dashboard",
  },
  {
    name: "Services & Pricing",
    icon: <Scissors />,
    roles: ["owner"],
    path: "/salon-services",
  },
  {
    name: "Staff Management",
    icon: <UserCog />,
    roles: ["owner"],
    subItems: [
      {
        name: "Barber List",
        icon: <List />,
        roles: ["owner"],
        path: "/barbers",
      },
      {
        name: "Add Barber",
        icon: <Plus />,
        roles: ["owner"],
        path: "/barbers/create",
      },

    ],
  },
  {
    name: "Appointments",
    icon: <CalendarCheck />,
    roles: ["owner"],
    subItems: [
      {
        name: "Appointment List",
        icon: <List />,
        roles: ["owner"],
        path: "/owner/appointments",
      },
      {
        name: "Appointment Detail",
        icon: <BookOpen />,
        roles: ["owner"],
        path: "/owner/appointments/detail",
      },
      {
        name: "Appointment History",
        icon: <History />,
        roles: ["owner"],
        path: "/owner/appointments/history",
      },
    ],
  },
  {
    name: "Payments & Commission",
    icon: <Wallet />,
    roles: ["owner"],
    subItems: [
      {
        name: "Payment History",
        icon: <Receipt />,
        roles: ["owner"],
        path: "/owner/payments",
      },
      {
        name: "Earnings Dashboard",
        icon: <TrendingUp />,
        roles: ["owner"],
        path: "/owner/payments/earnings",
      },
      {
        name: "Commission Breakdown",
        icon: <PieChart />,
        roles: ["owner"],
        path: "/owner/payments/commission",
      },
    ],
  },

  // ─────────────────────────────────────────
  // CUSTOMER
  // ─────────────────────────────────────────

  {
    name: "Explore Salons",
    icon: <Search />,
    roles: ["customer"],
    subItems: [
      {
        name: "Home / Explore",
        icon: <LayoutDashboard />,
        roles: ["customer"],
        path: "/explore",
      },
      {
        name: "Salon Listing",
        icon: <List />,
        roles: ["customer"],
        path: "/explore/salons",
      },
      {
        name: "Salon Detail",
        icon: <Store />,
        roles: ["customer"],
        path: "/explore/salons/detail",
      },
    ],
  },
  {
    name: "Book Appointment",
    icon: <CalendarDays />,
    roles: ["customer"],
    subItems: [
      {
        name: "Select Services",
        icon: <Scissors />,
        roles: ["customer"],
        path: "/book/services",
      },
      {
        name: "Select Barber",
        icon: <UserCog />,
        roles: ["customer"],
        path: "/book/barber",
      },
      {
        name: "Select Slot",
        icon: <Clock />,
        roles: ["customer"],
        path: "/book/slots",
      },
      {
        name: "Payment",
        icon: <CreditCard />,
        roles: ["customer"],
        path: "/book/payment",
      },
      {
        name: "Confirmation",
        icon: <CheckCircle />,
        roles: ["customer"],
        path: "/book/confirmation",
      },
    ],
  },
  {
    name: "My Bookings",
    icon: <BookOpen />,
    roles: ["customer"],
    subItems: [
      {
        name: "Upcoming",
        icon: <CalendarCheck />,
        roles: ["customer"],
        path: "/bookings/upcoming",
      },
      {
        name: "History",
        icon: <History />,
        roles: ["customer"],
        path: "/bookings/history",
      },
    ],
  },
  {
    name: "Profile",
    icon: <UserCircle />,
    roles: ["customer"],
    subItems: [
      {
        name: "View Profile",
        icon: <User />,
        roles: ["customer"],
        path: "/profile",
      },
      {
        name: "Edit Profile",
        icon: <Settings />,
        roles: ["customer"],
        path: "/profile/edit",
      },
    ],
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {

  const {
    user,
  } = useAuthContext();

  const currentRole =
    user?.role;


  const filteredNavItems =
    navItems

      .map((item) => ({

        ...item,

        subItems:
          item.subItems?.filter(
            (subItem) =>

              subItem.roles?.includes(
                currentRole as any
              )
          ),
      }))

      .filter((item) => {

        //
        // MAIN ITEM ACCESS
        //

        const hasMainAccess =
          item.roles?.includes(
            currentRole as any
          );

        //
        // SUBITEM ACCESS
        //

        const hasSubItems =
          item.subItems &&
          item.subItems.length > 0;

        return (
          hasMainAccess ||
          hasSubItems
        );
      });

  console.log('---', filteredNavItems);


  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

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
      const items = menuType === "main" ? filteredNavItems : othersItems;
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
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
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
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      <span
                        className={`menu-item-icon-size ${isActive(subItem.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                          }`}
                      >
                        {subItem.icon}
                      </span>
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
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
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
