import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { BellIcon, WifiIcon } from "react-native-heroicons/outline";

const Header = ({}) => {
  return (
    <View style={styles.customHeader}>
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Posture Smart
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={{ marginRight: 15 }}>
          <BellIcon size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("../../assets/images/hombre.jpeg")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderWidth: 1,
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    width: "100%",
    height: 100,
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#141414",
  },
});

export default Header;
