import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function SittingTimeChart({ data }) {
  const chartData = data || [
    { value: 420, label: "Lun" },
    { value: 380, label: "Mar" },
    { value: 450, label: "Mié" },
    { value: 500, label: "Jue" },
    { value: 320, label: "Vie" },
    { value: 200, label: "Sáb" },
    { value: 150, label: "Dom" },
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
        🪑 Tiempo sentado (minutos)
      </Text>

      <BarChart
        barWidth={30}
        noOfSections={4}
        barBorderRadius={8}
        frontColor="#222dc5ff"
        data={chartData}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        yAxisTextStyle={{ color: "#9CA3AF" }}
        xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 12 }}
        isAnimated
      />
    </View>
  );
}
