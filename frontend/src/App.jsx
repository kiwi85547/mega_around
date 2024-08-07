import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "./Home.jsx";
import { MainProduct } from "./MainProduct.jsx";
import { SignUpCustomer } from "./user/SignUpCustomer.jsx";
import { SignUpBranch } from "./user/SignupBranch.jsx";
import { SignUp } from "./user/SignUp.jsx";
import { Login } from "./user/Login.jsx";
import { LoginBranch } from "./user/LoginBranch.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import { ProductUpload } from "./product/ProductUpload.jsx";
import { ProductList } from "./product/ProductList.jsx";
import Stamp from "./event/Stamp.jsx";
import { theme } from "./component/css/Theme.jsx";
import { Order } from "./order/Order.jsx";
import { OrderList } from "./order/OrderList.jsx";
import { OrderDetail } from "./order/OrderDetail.jsx";
import { ProductUpdate } from "./product/ProductUpdate.jsx";
import { OrderProvider } from "./order/component/OrderProvider.jsx";
import { BranchPage } from "./order/BranchPage.jsx";
import { Coupon } from "./event/Coupon.jsx";
import axios from "axios";
import { MyPageCustomer } from "./user/MyPageCustomer.jsx";
import { MyPageBranch } from "./user/MyPageBranch.jsx";
import { EditCustomer } from "./user/EditCustomer.jsx";
import { EditBranch } from "./user/EditBranch.jsx";
import { BranchList } from "./branch/BranchList.jsx";
import { FindCustomerPassword } from "./user/FindCustomerPassword.jsx";
import { FindCustomerEmail } from "./user/FindCustomerEmail.jsx";
import { FindBranchPassword } from "./user/FindBranchPassword.jsx";
import { FindBranchEmail } from "./user/FindBranchEmail.jsx";
import "./fonts.css";
import { CartProductComp } from "./cart/component/CartProductComp.jsx";
import { MyPageAdmin } from "./user/MyPageAdmin.jsx";
import { OauthSuccess } from "./user/OauthSuccess.jsx";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      // product
      { index: true, element: <MainProduct /> },
      { path: "product", element: <ProductUpload /> },
      { path: "product/list", element: <ProductList /> },
      { path: "product/:productId", element: <ProductUpdate /> },
      // branchSelect
      { path: "branch/list", element: <BranchList /> },
      // event
      { path: "/stamp", element: <Stamp /> },
      { path: "/coupon", element: <Coupon /> },
      // order
      { path: "/order", element: <Order /> },
      { path: "/order/list", element: <OrderList /> },
      { path: "/order/:id", element: <OrderDetail /> },
      // cart
      { path: "cart", element: <CartProductComp /> },
      // branch_order
      { path: "branch/order/:id", element: <BranchPage /> },

      // user
      { path: "signup", element: <SignUp /> },
      { path: "signup/customer", element: <SignUpCustomer /> },
      { path: "signup/branch", element: <SignUpBranch /> },
      { path: "login", element: <Login /> },
      { path: "login/branch", element: <LoginBranch /> },
      { path: "mypage/customer/:id", element: <MyPageCustomer /> },
      { path: "mypage/branch/:id", element: <MyPageBranch /> },
      { path: "mypage/customer/edit/:id", element: <EditCustomer /> },
      { path: "mypage/branch/edit/:id", element: <EditBranch /> },
      { path: "mypage/admin", element: <MyPageAdmin /> },
      { path: "find-customerEmail", element: <FindCustomerEmail /> },
      { path: "find-customerPassword", element: <FindCustomerPassword /> },
      { path: "find-branchEmail", element: <FindBranchEmail /> },
      { path: "find-branchPassword", element: <FindBranchPassword /> },
      { path: "auth", element: <OauthSuccess /> },
    ],
  },
]);

function App() {
  return (
    <>
      <LoginProvider>
        <OrderProvider>
          <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
          </ChakraProvider>
        </OrderProvider>
      </LoginProvider>
    </>
  );
}

export default App;
