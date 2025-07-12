import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const colorVariants = {
  blue: "from-blue-500 to-blue-600",
  green: "from-emerald-500 to-emerald-600",
  purple: "from-purple-500 to-purple-600",
  red: "from-red-500 to-red-600",
  orange: "from-orange-500 to-orange-600",
  indigo: "from-indigo-500 to-indigo-600",
};

export default function StatsCards({
  title,
  value,
  icon: Icon,
  color,
  isLoading,
  alert,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
          alert ? "ring-2 ring-red-200 bg-red-50" : "bg-white"
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${colorVariants[color]} rounded-full opacity-10`}
        />

        <CardHeader className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {title}
              </CardTitle>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">{value}</div>
              )}
            </div>
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${colorVariants[color]} shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardHeader>

        {alert && (
          <CardContent className="px-6 pb-6">
            <div className="flex items-center text-red-600 text-sm font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              Attention requise
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
