import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignalCard } from "../../components/sos/SignalCard";
import { ScanlineOverlay } from "../../components/terminal/ScanlineOverlay";
import { SOS_CATEGORIES, SOS_DATA } from "../../data/sos";
import { terminal as t } from "../../theme/terminal";

export default function SOSScreen() {
  const [activeCategory, setActiveCategory] = useState("VISUAL");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locError, setLocError] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocError(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  const filtered = SOS_DATA.filter((s) => s.category === activeCategory);

  return (
    <View style={styles.container}>
      <ScanlineOverlay />
      <Text style={styles.header}>╔══ EMERGENCY SIGNALS ══╗</Text>
      <Text style={styles.statusLine}>
        {">"} STATUS: OFFLINE NOMINAL {">"} GPS:{" "}
        {coords
          ? `${coords.lat.toFixed(5)}°N  ${coords.lng.toFixed(5)}°E`
          : locError
            ? "DENIED"
            : "ACQUIRING..."}
      </Text>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
      >
        {SOS_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, activeCategory === cat && styles.tabActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === cat && styles.tabTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list}>
        {filtered.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.colors.bg, padding: t.spacing.md },
  header: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.lg,
    color: t.colors.primary,
    marginBottom: t.spacing.sm,
  },
  statusLine: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.xs,
    color: t.colors.warning,
    marginBottom: t.spacing.md,
  },
  tabs: { flexGrow: 0, marginBottom: t.spacing.md },
  tab: {
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
    marginRight: t.spacing.sm,
  },
  tabActive: {
    borderColor: t.colors.primary,
    backgroundColor: t.colors.primaryGhost,
  },
  tabText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.textMuted,
  },
  tabTextActive: { color: t.colors.primary },
  list: { flex: 1 },
});
