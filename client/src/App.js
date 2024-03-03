import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Image from "./pages/Image"
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/image",
    element: <Image/>
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router = {router}></RouterProvider>
    </div>
  );
}

export default App;
