import App from "../App";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import SigninPage from "../pages/SigninPage";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/signin", element: <SigninPage /> },
    ],
  },
];

export default routes;
