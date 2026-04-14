import Table from "@/components/ui/Table";

export default async function UserTable() {
  const res = await fetch("http://localhost:3000/api/users", {
    cache: "no-store",
  });
  const data = await res.json();
  const users = data.data || [];

  const rows = users.map((user) => [
    user.user_id,
    user.username,
    user.created_at || "-",
  ]);

  return <Table headers={["ID", "Username", "Created At"]} rows={rows} />;
}