import { terminal as t } from "@/theme/terminal";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CoordinatesDisplayProps {
  lat: number;
  lng: number;
  accuracy?: number;
}

export const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({
  lat,
  lng,
  accuracy,
}) => {
  const [copied, setCopied] = useState(false);

  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  const latStr = `${Math.abs(lat).toFixed(5)}° ${latDir}`;
  const lngStr = `${Math.abs(lng).toFixed(5)}° ${lngDir}`;
  const accStr = accuracy != null ? `±${Math.round(accuracy)}m` : "N/A";
  const coordText = `LAT: ${latStr} | LNG: ${lngStr}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(coordText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.acquired}>{"> "}GPS COORDINATES ACQUIRED</Text>
      <Text style={styles.row}>{"> "}LAT  : {latStr}</Text>
      <Text style={styles.row}>{"> "}LNG  : {lngStr}</Text>
      <Text style={styles.row}>{"> "}ACC  : {accStr}</Text>
      <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
        <Text style={styles.copyText}>
          {copied ? "> [COPIED ✓]" : "> [COPY TO CLIPBOARD]"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: t.colors.primaryMuted,
    backgroundColor: t.colors.bgRaised,
    padding: t.spacing.md,
    marginBottom: t.spacing.md,
  },
  acquired: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primary,
    fontWeight: "700",
    marginBottom: t.spacing.sm,
  },
  row: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.primaryDim,
    marginBottom: t.spacing.xs,
  },
  copyBtn: {
    marginTop: t.spacing.sm,
  },
  copyText: {
    fontFamily: t.fonts.mono,
    fontSize: t.fonts.size.sm,
    color: t.colors.warning,
    fontWeight: "700",
  },
});
