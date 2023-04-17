import './App.less';
import { useEffect, useCallback, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "@/data/route";

const App = () => {

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

  useEffect(() => {
    console.log(formatRoutes(routes));
  }, [formatRoutes]);

  return <BrowserRouter>
    <div id='App'>
      <Routes>
        {formatRoutes(routes)}
      </Routes>
    </div>
  </BrowserRouter >
}

export default App;
