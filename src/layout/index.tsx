import { Outlet } from "react-router-dom";
import "./index.less";

const Layout = () => {
    return <div className="container">
        <Outlet />
    </div>
}

export default Layout;