import App from "../App";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SignupPage from "../pages/SignupPage";
import SigninPage from "../pages/SigninPage";
import FriendsPage from "../pages/FriendsPage";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/friends", element: <FriendsPage /> },
    ],
  },
  { path: "/signup", element: <SignupPage /> },
  { path: "/signin", element: <SigninPage /> },
];

export default routes;
