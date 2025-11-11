import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { supabase } from "../../config/supabase";

export default function MuscleFatigueChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFatigue = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      const { data: metrics, error } = await supabase
        .from("user_metrics")
        .select("timestamp, muscle_fatigue_level")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: true });

      if (error) throw error;

      const formatted = metrics.map((item) => ({
        value: item.muscle_fatigue_level || 0,
        label: new Date(item.timestamp).toLocaleDateString("es-CO", {
          weekday: "short",
        }),
      }));

      setData(formatted);
    } catch (err) {
      console.error("Error al obtener fatiga:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFatigue();

    const channel = supabase
      .channel("fatigue_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_metrics" },
        (payload) => {
          console.log("Nuevo dato recibido (fatiga):", payload.new);
          fetchFatigue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#EF4444"
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
        💪 Nivel de fatiga muscular (tiempo real)
      </Text>
      <LineChart
        curved
        areaChart
        startFillColor="#EF4444"
        startOpacity={0.4}
        endOpacity={0.05}
        color="#EF4444"
        data={data}
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: "#9CA3AF" }}
        xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 12 }}
        isAnimated
      />
    </View>
  );
}
