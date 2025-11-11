import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

export default function ActiveBreaksChart({ data }) {
  const chartData = data || [
    { value: 2, label: "Lun" },
    { value: 3, label: "Mar" },
    { value: 1, label: "Mié" },
    { value: 4, label: "Jue" },
    { value: 2, label: "Vie" },
    { value: 5, label: "Sáb" },
    { value: 3, label: "Dom" },
  ];

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
        🕐 Pausas activas (por día)
      </Text>

      <LineChart
        areaChart
        curved
        hideDataPoints={false}
        startFillColor="#222dc5ff"
        startOpacity={0.4}
        endOpacity={0.05}
        color="#222dc5ff"
        data={chartData}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules // 👈 Esta línea elimina las líneas horizontales
        yAxisTextStyle={{ color: "#9CA3AF" }}
        xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 12 }}
        isAnimated
      />
    </View>
  );
}
