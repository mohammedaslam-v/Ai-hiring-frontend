import React from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, BookOpen } from "lucide-react";

//t
export const getStatusBadge = (status: string): React.ReactElement => {
  const statusMap = {
    no_interview: { label: "No Interview", variant: "secondary" as const, icon: Eye },
    in_progress: { label: "In Progress", variant: "default" as const, icon: BookOpen },
    completed: { label: "Completed", variant: "default" as const, icon: Eye },
    failed: { label: "Failed", variant: "destructive" as const, icon: Eye },
  };

  const config = statusMap[status as keyof typeof statusMap] || {
    label: status,
    variant: "secondary" as const,
    icon: Eye
  };

  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1.5">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
