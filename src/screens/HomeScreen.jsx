import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { supabase } from "../config/supabase";
import Header from "../components/common/Header";
import SittingTimeChart from "../components/dashboard/SittingTimeChart";
import ActiveBreaksChart from "../components/dashboard/ActiveBreaksChart";
import ActiveBreakTimer from "../components/dashboard/ActiveBreakTimer";
import StepsChart from "../components/dashboard/StepsChart";
import MuscleFatigueChart from "../components/dashboard/MuscleFatigueChart";
import PostureAngleChart from "../components/dashboard/PostureAngleChart";

export default function HomeScreen() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error al obtener el usuario:", userError.message);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, age")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error al obtener el perfil:", error.message);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.profileContainer}>
        {/*
        <Text style={styles.title}>
          Bienvenido 👋{" "}
          {profile
            ? `${profile.first_name} ${profile.last_name}`
            : "Cargando..."}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={styles.profileContainer}>
        <Text style={styles.title}>
          Bienvenido 👋{" "}
          {profile ? `${profile.first_name} ${profile.last_name}` : "Cargando..."}
        </Text>
      </View> */}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 16,
            color: "#fff",
          }}
        >
          Tu actividad postural 🧍‍♂️
        </Text>
        <ActiveBreakTimer breakIntervalMinutes={30} />
        <MuscleFatigueChart />
        <PostureAngleChart />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
