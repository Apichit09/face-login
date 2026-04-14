import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Admin Panel</h3>
      <nav>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/face-status">Face Status</Link>
        <Link href="/admin/login-logs">Login Logs</Link>
        <Link href="/admin/stats">Stats</Link>
      </nav>
    </aside>
  );
}