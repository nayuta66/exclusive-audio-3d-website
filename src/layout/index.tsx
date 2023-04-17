import React from "react";
import { Outlet } from "react-router-dom";
import "./index.less";

export default React.memo(() => {
    return <div className="container">
        <Outlet />
    </div>
});