import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { supabase } from "../../config/supabase";
import { PieChart } from "react-native-gifted-charts";
import { CheckCircle, AlertTriangle } from "lucide-react-native";

export default function PostureAngleChart() {
  const [angle, setAngle] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("correcta");
  const animatedValue = useState(new Animated.Value(0))[0];

  // 🎯 Cargar el ángulo actual
  const fetchAngle = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      const { data: metrics, error } = await supabase
        .from("user_metrics")
        .select("posture_angle")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (metrics && metrics.length > 0) {
        const newAngle = metrics[0].posture_angle || 0;
        setAngle(newAngle);
        setStatus(newAngle <= 15 ? "correcta" : "incorrecta");

        // animar el cambio de ángulo
        Animated.timing(animatedValue, {
          toValue: newAngle,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }).start();
      }
    } catch (err) {
      console.error("Error al obtener ángulo:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 👂 Escuchar cambios en tiempo real
  useEffect(() => {
    fetchAngle();

    const channel = supabase
      .channel("posture_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_metrics" },
        (payload) => {
          console.log("Nuevo ángulo:", payload.new.posture_angle);
          fetchAngle();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#22C55E"
        style={{ marginTop: 20 }}
      />
    );

  const interpolatedAngle = animatedValue.interpolate({
    inputRange: [0, 90],
    outputRange: [0, 90],
  });

  const dataPie = [
    { value: angle, color: status === "correcta" ? "#22C55E" : "#EF4444" },
    { value: 90 - angle, color: "#1F2937" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📐 Inclinación Postural</Text>

      <PieChart
        donut
        innerRadius={75}
        radius={95}
        data={dataPie}
        backgroundColor="#111827"
        centerLabelComponent={() => (
          <Animated.View>
            <Text
              style={[
                styles.angleValue,
                { color: status === "correcta" ? "#22C55E" : "#EF4444" },
              ]}
            >
              {angle.toFixed(1)}°
            </Text>
          </Animated.View>
        )}
        isAnimated
      />

      <View style={styles.statusContainer}>
        {status === "correcta" ? (
          <View style={styles.statusBadgeCorrect}>
            <CheckCircle size={20} color="#22C55E" />
            <Text style={styles.statusTextCorrect}>Postura Correcta</Text>
          </View>
        ) : (
          <View style={styles.statusBadgeIncorrect}>
            <AlertTriangle size={20} color="#F87171" />
            <Text style={styles.statusTextIncorrect}>Postura Incorrecta</Text>
          </View>
        )}
      </View>

      <Text style={styles.subtext}>
        Mantén tu espalda recta y evita superar los 15° de inclinación.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0D0D0D",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  angleValue: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  statusBadgeCorrect: {
    flexDirection: "row",
    backgroundColor: "#16A34A22",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  statusBadgeIncorrect: {
    flexDirection: "row",
    backgroundColor: "#EF444422",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  statusTextCorrect: {
    color: "#22C55E",
    fontWeight: "600",
    marginLeft: 6,
  },
  statusTextIncorrect: {
    color: "#F87171",
    fontWeight: "600",
    marginLeft: 6,
  },
  subtext: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
    marginTop: 12,
  },
});
