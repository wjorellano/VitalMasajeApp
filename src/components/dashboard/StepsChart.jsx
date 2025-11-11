import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { supabase } from "../config/supabase";

export default function StepsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSteps = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      const { data: metrics, error } = await supabase
        .from("user_metrics")
        .select("timestamp, steps")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: true });

      if (error) throw error;

      // Agrupar por día
      const grouped = {};
      metrics.forEach((row) => {
        const day = new Date(row.timestamp).toLocaleDateString("es-CO", {
          weekday: "short",
        });
        grouped[day] = (grouped[day] || 0) + (row.steps || 0);
      });

      const formatted = Object.entries(grouped).map(([label, value]) => ({
        label,
        value,
      }));

      setData(formatted);
    } catch (err) {
      console.error("Error al obtener pasos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#3B82F6"
        style={{ marginTop: 20 }}
      />
    );

  return (
    <View
      style={{
        backgroundColor: "#0D0D0D",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        🚶 Pasos diarios
      </Text>
      <BarChart
        barWidth={26}
        barBorderRadius={6}
        frontColor="#3B82F6"
        data={data}
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: "#9CA3AF" }}
        xAxisLabelTextStyle={{ color: "#9CA3AF" }}
        isAnimated
      />
    </View>
  );
}
