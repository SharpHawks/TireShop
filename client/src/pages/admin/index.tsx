import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Snowflake,
  BarChart3,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Tire } from "@shared/schema";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: tires = [] } = useQuery<Tire[]>({
    queryKey: ["/api/tires"],
  });

  // Calculate statistics
  const totalTires = tires.length;
  const winterTires = tires.filter(t => t.season === "winter").length;
  const summerTires = tires.filter(t => t.season === "summer").length;
  const outOfStock = tires.filter(t => !t.inStock).length;

  const sections = [
    {
      title: "Summer Tires",
      icon: Sun,
      href: "/admin/tires/summer",
      description: "Manage summer tire inventory",
    },
    {
      title: "Winter Tires",
      icon: Snowflake,
      href: "/admin/tires/winter",
      description: "Manage winter tire inventory",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tires"
          value={totalTires}
          description="Total products in inventory"
          icon={Package}
        />
        <StatCard
          title="Summer Tires"
          value={summerTires}
          description="Available summer tires"
          icon={Sun}
        />
        <StatCard
          title="Winter Tires"
          value={winterTires}
          description="Available winter tires"
          icon={Snowflake}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          description="Products needing restock"
          icon={AlertTriangle}
        />
      </div>

      {/* Section Cards */}
      <h2 className="text-2xl font-semibold mb-6">Tire Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link key={section.title} href={section.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <section.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
