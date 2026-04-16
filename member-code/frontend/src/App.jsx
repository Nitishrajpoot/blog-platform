import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAdmin, RequireAuth } from "./components/Guard";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MyPostsPage from "./pages/MyPostsPage";
import EditorPage from "./pages/EditorPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/post/:slug", element: <PostPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "/profile", element: <ProfilePage /> },
          { path: "/me/posts", element: <MyPostsPage /> },
          { path: "/me/posts/new", element: <EditorPage mode="create" /> },
          { path: "/me/posts/:id/edit", element: <EditorPage mode="edit" /> },
        ],
      },
      {
        path: "/admin",
        element: <RequireAdmin />,
        children: [{ index: true, element: <AdminDashboard /> }],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
