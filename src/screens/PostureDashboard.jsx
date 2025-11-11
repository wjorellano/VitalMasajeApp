import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
  ScrollView,
} from "react-native";
import { supabase } from "../config/supabase";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import {
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  Watch,
} from "lucide-react-native";

export default function PostureDashboard() {
  // -------------------- CRONÓMETRO --------------------
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // -------------------- PASOS --------------------
  const [stepsData, setStepsData] = useState([]);
  const fetchSteps = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const { data: metrics } = await supabase
      .from("user_metrics")
      .select("timestamp, steps")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: true });

    const grouped = {};
    metrics.forEach((m) => {
      const day = new Date(m.timestamp).toLocaleDateString("es-CO", {
        weekday: "short",
      });
      grouped[day] = (grouped[day] || 0) + (m.steps || 0);
    });
    const formatted = Object.entries(grouped).map(([label, value]) => ({
      label,
      value,
    }));
    setStepsData(formatted);
  };

  // -------------------- FATIGA --------------------
  const [fatigueData, setFatigueData] = useState([]);
  const fetchFatigue = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    const { data: metrics } = await supabase
      .from("user_metrics")
      .select("timestamp, muscle_fatigue_level")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: true });

    const formatted = metrics.map((m) => ({
      value: m.muscle_fatigue_level,
      label: new Date(m.timestamp).toLocaleDateString("es-CO", {
        weekday: "short",
      }),
    }));
    setFatigueData(formatted);
  };

  // -------------------- POSTURA --------------------
  const [angle, setAngle] = useState(0);
  const [status, setStatus] = useState("correcta");
  const animatedValue = useRef(new Animated.Value(0)).current;

  const fetchAngle = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    const { data: metrics } = await supabase
      .from("user_metrics")
      .select("posture_angle")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(1);

    if (metrics && metrics.length > 0) {
      const newAngle = metrics[0].posture_angle || 0;
      setAngle(newAngle);
      setStatus(newAngle <= 15 ? "correcta" : "incorrecta");

      Animated.timing(animatedValue, {
        toValue: newAngle,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
    }
  };

  // -------------------- REALTIME --------------------
  useEffect(() => {
    fetchSteps();
    fetchFatigue();
    fetchAngle();

    const channel = supabase
      .channel("metrics_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_metrics" },
        () => {
          fetchSteps();
          fetchFatigue();
          fetchAngle();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // -------------------- RENDER --------------------
  const angleColor = status === "correcta" ? "#22C55E" : "#EF4444";
  const pieData = [
    { value: angle, color: angleColor },
    { value: 90 - angle, color: "#1F2937" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Tu actividad postural 🧍‍♂️</Text>

      {/* CRONÓMETRO */}
      <View style={styles.timerCard}>
        <Text style={styles.timerTitle}>⏱ Cronómetro de Pausas Activas</Text>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>

        <View style={styles.timerButtons}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#22C55E" }]}
            onPress={() => setIsRunning(true)}
          >
            <Play color="#fff" size={20} />
            <Text style={styles.btnText}>Iniciar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#EF4444" }]}
            onPress={() => {
              setIsRunning(false);
              setSeconds(0);
            }}
          >
            <Square color="#fff" size={20} />
            <Text style={styles.btnText}>Detener</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.timerNote}>🔔 Recordatorio cada 30 minutos</Text>
      </View>

      {/* PASOS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚶 Pasos diarios (tiempo real)</Text>
        <BarChart
          barWidth={30}
          barBorderRadius={6}
          data={stepsData}
          frontColor="#3B82F6"
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{ color: "#9CA3AF" }}
          xAxisLabelTextStyle={{ color: "#9CA3AF" }}
          isAnimated
        />
      </View>

      {/* FATIGA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💪 Nivel de fatiga muscular</Text>
        <LineChart
          curved
          areaChart
          startFillColor="#F87171"
          startOpacity={0.5}
          endOpacity={0.1}
          color="#EF4444"
          data={fatigueData}
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{ color: "#9CA3AF" }}
          xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 12 }}
          isAnimated
        />
      </View>

      {/* POSTURA */}
      <View style={styles.postureCard}>
        <Text style={styles.cardTitle}>📐 Inclinación Postural</Text>
        <PieChart
          donut
          radius={90}
          innerRadius={70}
          data={pieData}
          centerLabelComponent={() => (
            <Animated.Text style={[styles.angleText, { color: angleColor }]}>
              {angle.toFixed(1)}°
            </Animated.Text>
          )}
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
        <Text style={styles.note}>
          Mantén tu espalda recta y evita superar los 15° de inclinación.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0E10", padding: 16 },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },
  timerCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  timerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },
  timerText: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  timerButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  timerNote: { color: "#9CA3AF", fontSize: 13, marginTop: 8 },

  postureCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  angleText: { fontSize: 30, fontWeight: "bold" },
  statusContainer: { marginTop: 10 },
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
  note: {
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});
