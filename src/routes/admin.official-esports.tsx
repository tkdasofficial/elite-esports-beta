import { createFileRoute } from "@tanstack/react-router";
import { AdminEsportsPanel } from "@/admin/official-esports";

export const Route = createFileRoute("/admin/official-esports")({
  component: AdminEsportsPanel,
});
