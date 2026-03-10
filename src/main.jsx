import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PageWrapper from "./components/PageWrapper";

// Pages
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import CustomerDashboard from "./pages/CustomerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ErrorPage from "./pages/ErrorPage";

import "./index.css";

// ─── React Query Client ─────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

// ─── Layouts ─────────────────────────────────────────────────────────
const AppLayout = () => (
  <>
    <Navbar />
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  </>
);

const BareLayout = () => <Outlet />;

// ─── Role guards ─────────────────────────────────────────────────────
const CustomerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["customer"]}>{children}</ProtectedRoute>
);
const AgentRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["agent"]}>{children}</ProtectedRoute>
);
const ManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["manager", "admin"]}>
    {children}
  </ProtectedRoute>
);
const AuthRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["customer", "agent", "manager", "admin"]}>
    {children}
  </ProtectedRoute>
);

// ─── Router ──────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // Public — no navbar
  {
    element: <BareLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // Public — with navbar
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/units", element: <Home /> },
      { path: "/properties", element: <Home /> },
      { path: "/units/:id", element: <PropertyDetails /> },
      { path: "/properties/:id", element: <PropertyDetails /> },
      { path: "/property/:id", element: <PropertyDetails /> },
    ],
  },

  // Protected — with navbar
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/checkout/:unitId",
        element: (
          <AuthRoute>
            <CheckoutPage />
          </AuthRoute>
        ),
      },
      {
        path: "/payment/success",
        element: (
          <AuthRoute>
            <PaymentSuccess />
          </AuthRoute>
        ),
      },
      {
        path: "/payment/failed",
        element: (
          <AuthRoute>
            <PaymentFailed />
          </AuthRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <CustomerRoute>
            <CustomerDashboard />
          </CustomerRoute>
        ),
      },
      {
        path: "/agent",
        element: (
          <AgentRoute>
            <AgentDashboard />
          </AgentRoute>
        ),
      },
      {
        path: "/manager",
        element: (
          <ManagerRoute>
            <ManagerDashboard />
          </ManagerRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <ManagerRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
              Reports — coming soon
            </div>
          </ManagerRoute>
        ),
      },
    ],
  },

  // Fallback
  { path: "*", element: <ErrorPage /> },
]);

// ─── Mount ───────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#1f2937",
              color: "#fff",
              fontSize: "14px",
            },
          }}
        />
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>,
);
