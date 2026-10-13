import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Panel de Administración | Tesla Computación",
};

export default function AdminPage() {
  return <AdminApp />;
}
