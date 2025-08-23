import PaginatedApplicationsTable from "../../components/admin/PaginatedApplicationsTable";

export default function AdminApplicationsPage() {
  return (
    <div style={{padding:16}}>
      <h1 className="text-2xl font-bold mb-4">Applications (Paginated)</h1>
      <div style={{padding:'8px 10px',background:'#D1FAE5',border:'1px solid #A7F3D0',borderRadius:8,marginBottom:12}}>
        DEBUG: /admin/applications is wired up ✅
      </div>
      <PaginatedApplicationsTable />
    </div>
  );
}