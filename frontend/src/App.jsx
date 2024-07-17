import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "./Home.jsx";
import { SignUp } from "./SignUp.jsx";

function MainProduct() {
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <MainProduct /> },

      // user
      { path: "signup", element: <SignUp /> },
    ],
  },
]);

function App() {
  return (
    <>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </>
  );
}

export default App;
