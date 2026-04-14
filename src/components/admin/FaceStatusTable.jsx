import Table from "@/components/ui/Table";

export default async function FaceStatusTable() {
  const res = await fetch("http://localhost:3000/api/face/status", {
    cache: "no-store",
  });
  const data = await res.json();
  const items = data.data || [];

  const rows = items.map((item) => [
    item.user_id,
    item.username,
    item.has_face ? "Registered" : "Not Registered",
    item.embedding_count,
  ]);

  return (
    <Table
      headers={["User ID", "Username", "Status", "Embedding Count"]}
      rows={rows}
    />
  );
}