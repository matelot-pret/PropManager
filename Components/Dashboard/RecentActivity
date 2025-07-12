import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "paiement",
      message: "Aucune activité récente",
      time: "Commencez par ajouter vos biens",
      status: "info",
      icon: Clock,
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-orange-600 bg-orange-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-6 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Activity className="w-6 h-6 text-blue-600" />
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const StatusIcon = getStatusIcon(activity.status);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div
                  className={`p-2 rounded-full ${getStatusColor(
                    activity.status
                  )}`}
                >
                  <StatusIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">
                    {activity.message}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
