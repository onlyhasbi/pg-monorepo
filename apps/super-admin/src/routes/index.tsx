import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminDashboard } from "../components/AdminDashboard";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth?.adminToken) {
      throw redirect({ to: "/signin" });
    }
  },
  component: AdminDashboard,
});
