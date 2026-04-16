"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "/icon/dashboard.gif",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: "/icon/user.gif",
  },
  {
    href: "/admin/face-status",
    label: "Face Status",
    icon: "/icon/check.gif",
  },
  {
    href: "/admin/login-logs",
    label: "Login Logs",
    icon: "/icon/login.gif",
  },
  {
    href: "/admin/stats",
    label: "Stats",
    icon: "/icon/tasks.gif",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-neutral-200 bg-white lg:min-h-screen lg:w-[280px] lg:border-b-0 lg:border-r">
      <div className="p-4 sm:p-5">
        <div className="rounded-2xl bg-neutral-900 px-4 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <img
                src="/icon/personnel.gif"
                alt="admin"
                className="h-7 w-7 object-contain"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold">Admin Panel</h2>
              <p className="text-xs text-neutral-300">
                Facial Authentication System
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-5 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-50 text-green-800 ring-1 ring-green-100"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isActive ? "bg-white" : "bg-neutral-100"
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-5 w-5 object-contain"
                  />
                </div>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}