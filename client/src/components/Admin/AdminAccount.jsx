import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Dashboard from "./Dashboard";
import { usePage } from "../Context/SelectedPageContext";
import AllUsers from "./Tables/AllUsers";
import { AllDestinations } from "./Tables/AllDestinations";
import { AllActivities } from "./Tables/AllActivities";
import { AllPackages } from "./Tables/AllPackages";
import { AllHousing } from "./Tables/AllHousing";
import UpdateActivity from "./Forms/UpdateActivity";
import AddPackage from "./Forms/AddPackage";
import UpdatePackage from "./Forms/UpdatePackage";
import { useAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AllFlights from "./Tables/AllFlights";
import AddFlight from "./Forms/AddFlight";
import UpdateFlight from "./Forms/UpdateFlight";
import UpdateHouse from "./Forms/UpdateHouse";
import AddHouse from "./Forms/AddHous";
import AddDestination from "./Forms/AddDestination";
import UpdateDestination from "./Forms/UpdateDestination";
import { useCookies } from "react-cookie";
import AddActivity from "./Forms/AddActivity";
import Contact from "./Tables/Contact";
import Profile from "../Users/Profile";

const AdminAccount = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const [user, setUser] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["isAdmin"]);
  const isAdmin = cookies["isAdmin"];
  const { page, onSelectPage, selectedId, onSelectedId } = usePage();
  const history = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can't access this page.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
        },
      });
      history("/");
    }
  }, []);
  return (
    <div>
      <SideBar />
      <div className="">
        <div className={`${page === "dashboard" ? "block" : "hidden"}`}>
          <Dashboard />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div
            className={`${
              page === "profile" ? "block" : "hidden"
            } lg:w-5/6 w-full self-end`}
          >
            <Profile />
          </div>
        </div>
        <div
          className={`${page === "users" ? "block" : "hidden"} lg:w-3/4 p-5`}
        >
          <AllUsers />
        </div>
        <div
          className={`${
            page === "destinations" ? "block" : "hidden"
          } lg:w-3/4 p-5`}
        >
          <AllDestinations />
        </div>
        <div
          className={`${
            page === "activities" ? "block" : "hidden"
          } lg:w-3/4 p-5`}
        >
          <AllActivities />
        </div>
        <div
          className={`${page === "packages" ? "block" : "hidden"} lg:w-3/4 p-5`}
        >
          <AllPackages />
        </div>
        <div
          className={`${
            page === "accommodations" ? "block" : "hidden"
          } w-3/4 p-5`}
        >
          <AllHousing />
        </div>
        <div
          className={`${page === "flights" ? "block" : "hidden"} lg:w-3/4 p-5`}
        >
          <AllFlights />
        </div>
        <div
          className={`${page === "messages" ? "block" : "hidden"} lg:w-3/4 p-5`}
        >
          <Contact />
        </div>

        {/* crud */}
        <div className={`${page === "addActivity" ? "block" : "hidden"}`}>
          <AddActivity />
        </div>
        <div className={`${page === "updateActivity" ? "block" : "hidden"}`}>
          <UpdateActivity id={selectedId} />
        </div>
        <div className={`${page === "addPackage" ? "block" : "hidden"}`}>
          <AddPackage />
        </div>
        <div className={`${page === "updatePackage" ? "block" : "hidden"}`}>
          <UpdatePackage id={selectedId} />
        </div>
        <div className={`${page === "addFlight" ? "block" : "hidden"}`}>
          <AddFlight />
        </div>
        <div className={`${page === "updateFlight" ? "block" : "hidden"}`}>
          <UpdateFlight id={selectedId} />
        </div>
        <div className={`${page === "addHouse" ? "block" : "hidden"}`}>
          <AddHouse />
        </div>
        <div className={`${page === "updateHouse" ? "block" : "hidden"}`}>
          <UpdateHouse id={selectedId} />
        </div>
        <div className={`${page === "addDestination" ? "block" : "hidden"}`}>
          <AddDestination />
        </div>
        <div className={`${page === "updateDestination" ? "block" : "hidden"}`}>
          <UpdateDestination id={selectedId} />
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
