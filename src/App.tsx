import './App.less';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "@/data/route";

const App = () => {
  return <BrowserRouter>
    <div id='App'>
      <Routes>
        {routes.map((item, index) => {
          return <Route
            key={index}
            path={item.path}
            element={<Suspense fallback={<div>loading</div>}>
              111
            </Suspense>} />
        })}
      </Routes>
    </div>
  </BrowserRouter >
}

export default App;
