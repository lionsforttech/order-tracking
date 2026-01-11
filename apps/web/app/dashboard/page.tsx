import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>In Transit</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Delivered</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
      </div>
    </div>
  );
}