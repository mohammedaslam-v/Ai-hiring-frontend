
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { supabase } from "@/integrations/supabase/client"; // Supabase removed - using mock data
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AuditLog {
  id: string;
  created_at: string;
  actor: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: any | null;
}

const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // const { data, error } = await supabase
        //   .from('admin_audit_logs')
        //   .select('*')
        //   .order('created_at', { ascending: false })
        //   .limit(50);
          
        // if (error) {
        //   console.error('Error fetching audit logs:', error);
        //   setError('Failed to load audit logs');
        //   setLogs([]);
        // } else {
        //   setLogs(data || []);
        // }
        // Mock data for now
        setLogs([
          { id: '1', created_at: '2023-10-27T10:00:00Z', actor: 'admin', action: 'Created user', entity_type: 'User', entity_id: '123', metadata: { username: 'testuser' } },
          { id: '2', created_at: '2023-10-27T10:05:00Z', actor: 'admin', action: 'Updated user', entity_type: 'User', entity_id: '123', metadata: { username: 'testuser' } },
          { id: '3', created_at: '2023-10-27T10:10:00Z', actor: 'admin', action: 'Deleted user', entity_type: 'User', entity_id: '123', metadata: null },
          { id: '4', created_at: '2023-10-27T10:15:00Z', actor: 'admin', action: 'Created role', entity_type: 'Role', entity_id: '456', metadata: { name: 'Editor' } },
          { id: '5', created_at: '2023-10-27T10:20:00Z', actor: 'admin', action: 'Updated role', entity_type: 'Role', entity_id: '456', metadata: { name: 'Editor' } },
          { id: '6', created_at: '2023-10-27T10:25:00Z', actor: 'admin', action: 'Deleted role', entity_type: 'Role', entity_id: '456', metadata: null },
        ]);
      } catch (err) {
        console.error('Unexpected error fetching audit logs:', err);
        setError('An unexpected error occurred');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  return (
    <Card className="border-bambinos-blue/20">
      <CardHeader>
        <CardTitle className="text-bambinos-blue text-xl">Recent Admin Activity</CardTitle>
        <CardDescription>Last 50 actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-bambinos-blue/20 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">Loading activity...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500 py-6">{error}</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">No activity yet</TableCell>
                </TableRow>
              ) : logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{new Date(l.created_at).toLocaleString()}</TableCell>
                  <TableCell>{l.actor || 'admin'}</TableCell>
                  <TableCell>{l.action}</TableCell>
                  <TableCell>{l.entity_type} {l.entity_id ? `(${l.entity_id})` : ''}</TableCell>
                  <TableCell className="max-w-[320px] truncate" title={JSON.stringify(l.metadata)}>
                    {l.metadata ? JSON.stringify(l.metadata) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;
