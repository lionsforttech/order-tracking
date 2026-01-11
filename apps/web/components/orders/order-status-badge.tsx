import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/orders";

/**
 * Visual status indicator for orders
 * Filament-style colored badges
 */
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variants: Record<
    OrderStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
  > = {
    DRAFT: { label: "Draft", variant: "outline" },
    PLACED: { label: "Placed", variant: "secondary" },
    DISPATCHED: { label: "Dispatched", variant: "default" },
    IN_TRANSIT: { label: "In Transit", variant: "default" },
    DELIVERED: { label: "Delivered", variant: "secondary" },
    CANCELED: { label: "Canceled", variant: "destructive" },
  };

  const config = variants[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
