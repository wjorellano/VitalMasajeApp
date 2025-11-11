import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Alert, Vibration, StyleSheet } from "react-native";

const ActiveBreakTimer = ({ breakIntervalMinutes = 30 }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Función para formatear tiempo
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Efecto principal del cronómetro
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Notificación de pausa activa
  useEffect(() => {
    if (seconds > 0 && seconds % (breakIntervalMinutes * 60) === 0) {
      Alert.alert("⏰ Pausa activa", "Es hora de hacer una pausa activa 💪");
      Vibration.vibrate(2000);
    }
  }, [seconds]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏱️ Cronómetro de Pausas Activas</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>

      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <Button title="Iniciar" onPress={handleStart} color="#4CAF50" />
        ) : (
          <Button title="Pausar" onPress={handlePause} color="#FF9800" />
        )}
        <Button title="Detener" onPress={handleStop} color="#F44336" />
      </View>
      <Text style={styles.info}>
        Recordatorio cada {breakIntervalMinutes} minutos
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: "#666",
  },
});

export default ActiveBreakTimer;
