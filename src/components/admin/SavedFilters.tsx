
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Save, Play } from "lucide-react";

import { SavedFiltersProps } from '@/types/admin';

type FilterSnapshot = Omit<SavedFiltersProps, "setSearchTerm"|"setStatusFilter"|"setSubjectFilter"|"setResultFilter"|"setFromDate"|"setToDate">;

const STORAGE_KEY = "adminSavedFilters";

const SavedFilters = (props: SavedFiltersProps) => {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<Record<string, FilterSnapshot>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch (error) {
      console.warn('Failed to load saved filters:', error);
    }
  }, []);

  const persist = (next: Record<string, FilterSnapshot>) => {
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const snapshot: FilterSnapshot = {
      searchTerm: props.searchTerm,
      statusFilter: props.statusFilter,
      subjectFilter: props.subjectFilter,
      resultFilter: props.resultFilter,
      fromDate: props.fromDate,
      toDate: props.toDate,
    };
    const next = { ...saved, [name.trim()]: snapshot };
    persist(next);
    setName("");
  };

  const apply = (snap: FilterSnapshot) => {
    props.setSearchTerm(snap.searchTerm);
    props.setStatusFilter(snap.statusFilter);
    props.setSubjectFilter(snap.subjectFilter);
    props.setResultFilter(snap.resultFilter);
    props.setFromDate(snap.fromDate);
    props.setToDate(snap.toDate);
  };

  const remove = (key: string) => {
    const next = { ...saved };
    delete next[key];
    persist(next);
  };

  return (
    <Card className="border-bambinos-blue/20 mb-4">
      <CardHeader className="py-3">
        <CardTitle className="text-bambinos-blue text-base">Saved Filters</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
          <div className="flex-1 min-w-[220px]">
            <Input placeholder="Filter name (e.g. Passed last week)" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <Button onClick={handleSave} variant="outline" className="border-bambinos-blue text-bambinos-blue hover:bg-bambinos-blue hover:text-white">
            <Save className="h-4 w-4 mr-2" /> Save current
          </Button>
        </div>

        {Object.keys(saved).length > 0 && (
          <div className="mt-3 grid md:grid-cols-3 gap-2">
            {Object.entries(saved).map(([key, snap]) => (
              <div key={key} className="flex items-center justify-between rounded border px-3 py-2">
                <span className="text-sm font-medium truncate pr-2" title={key}>{key}</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-bambinos-blue hover:bg-bambinos-blue hover:text-white" onClick={() => apply(snap)}>
                    <Play className="h-4 w-4 mr-1" /> Apply
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-600 hover:text-white" onClick={() => remove(key)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedFilters;
