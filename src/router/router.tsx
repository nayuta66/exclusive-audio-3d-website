import { useCallback, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";

const Router = () => {
  
  const formatRoutes = useCallback((routes: any) => {
    return routes.map((route: any, index: any) => {
      if (route.children && route.children.length > 0) {
        return <Route
          key={index}
          path={route.path}
          element={<Suspense fallback={<div>loading</div>}>
            <route.element></route.element>
          </Suspense>}
        >
          {formatRoutes(route.children)}
        </Route>
      } else return <Route
        key={index}
        path={route.path}
        element={<Suspense fallback={<div>loading</div>}>
          <route.element></route.element>
        </Suspense>} />
    })
  }, []);

  return <BrowserRouter>
    <Routes>
      {formatRoutes(routes)}
    </Routes>
  </BrowserRouter >
}

export default Router;
