import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-teal-700" />
        <h1 className="text-3xl font-bold tracking-tight text-teal-900">Admin Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Templates</div>
            <p className="text-xs text-muted-foreground">
              Setup JSA template for user generation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
