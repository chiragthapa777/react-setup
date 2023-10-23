import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster"



export default function App() {
  return (
    <>
    <Toaster />
      <Navbar />
      <Outlet/>
    </>
  )
}
