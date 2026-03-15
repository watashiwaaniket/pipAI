import { ScanlineOverlay } from "@/components/terminal/ScanlineOverlay";
import { useModelStore } from "@/stores/modelStore";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Key section — model management
export default function SettingsScreen() {
  const { models, activeModelId, setActiveModel, startDownload, deleteModel } =
    useModelStore();

  return (
    <ScrollView style={styles.container}>
      <ScanlineOverlay />
      <Text style={styles.header}>╔══ SYSTEM CONFIGURATION ══╝</Text>

      <Text style={styles.section}>{">"} INTELLIGENCE MODULES</Text>

      {models.map((model) => {
        const isActive = model.id === activeModelId;
        const isDownloaded = model.isDownloaded;

        return (
          <View
            key={model.id}
            style={[styles.card, isActive && styles.cardActive]}
          >
            <Text style={styles.modelName}>
              {isActive ? "[ACTIVE] " : "        "}
              {model.name}
            </Text>
            <Text style={styles.modelMeta}>
              {model.params} PARAMS | {(model.sizeBytes / 1e9).toFixed(1)}GB |
              CTX:{model.contextLength}
            </Text>

            <View style={styles.actions}>
              {!isDownloaded ? (
                <TouchableOpacity onPress={() => startDownload(model.id)}>
                  <Text style={styles.actionDownload}>[ DOWNLOAD MODULE ]</Text>
                </TouchableOpacity>
              ) : (
                <>
                  {!isActive && (
                    <TouchableOpacity onPress={() => setActiveModel(model.id)}>
                      <Text style={styles.actionActivate}>[ ACTIVATE ]</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => deleteModel(model.id)}>
                    <Text style={styles.actionDelete}>[ DELETE ]</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        );
      })}

      <Text style={styles.section}>{">"} SYSTEM INFO</Text>
      <Text style={styles.info}>VERSION : 1.0.0</Text>
      <Text style={styles.info}>NETWORK : OFFLINE ONLY</Text>
      <Text style={styles.info}>STORAGE : {/* compute used storage */}</Text>
    </ScrollView>
  );
}
