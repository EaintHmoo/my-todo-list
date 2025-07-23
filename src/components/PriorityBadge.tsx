// UI Components

import { Priority } from "@/model/task";

type PriorityBadgeProps = {
    priority: Priority;
  };
export function PriorityBadge({ priority }:PriorityBadgeProps ) {
    const styles = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}>{priority}</span>;
};