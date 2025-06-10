
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Player from "./Player";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-spotify-dark">
          <Outlet />
        </main>
      </div>
      <Player />
    </div>
  );
};

export default Layout;
