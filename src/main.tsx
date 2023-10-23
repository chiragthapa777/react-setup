import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AboutPage from "./page/about/AboutPage";
import ErrorPage from "./page/ErrorPage";
import FormPage from "./page/form/Form";
import Login from "./page/login/Login";
import ProfilePage from "./page/profile/ProfilePage";
import { ThemeProvider } from "./context/theme-provider";

const LazyHome = lazy(() => import("./page/home/HomePage"));
const LazyApp = lazy(() => import("./App"));

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense>
				<LazyApp />
			</Suspense>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				index: true, // same as path:"/"
				element: (
					<Suspense>
						<LazyHome />
					</Suspense>
				),
				// element:<HomePage />
			},
			{
				path: "/about",
				element: <AboutPage />,
			},
			{
				path: "/profile/:profileId",
				element: <ProfilePage />,
			},
			{
				path: "/form",
				element: <FormPage />,
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	// <React.StrictMode>
	 <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
	  <RouterProvider router={router} />
    </ThemeProvider>
	// </React.StrictMode>
);
