import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

/**
 * ConfirmationModal — Bottom-Sheet Style Confirmation Dialog
 *
 * A reusable modal that slides up from the bottom and asks the user
 * to confirm a destructive action (like removing a cart item).
 *
 * This uses React Native's built-in <Modal> component, not a library.
 *
 * Props:
 * - visible: Controls whether the modal is shown or hidden
 * - onClose: Called when user taps 'Cancel' (or presses Back on Android)
 * - onConfirm: Called when user taps 'Remove' to confirm the action
 * - title: Optional custom title text (default: "Remove Item?")
 * - message: Optional custom message text
 */
interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;   // Optional: falls back to a default string
  message?: string; // Optional: falls back to a default string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = "Remove Item?",
  message = "Are you sure you want to remove this item from your cart? This action cannot be undone.",
}) => {
  return (
    // transparent={true} allows the dimmed background overlay to show
    // animationType="slide" makes it slide up from the bottom
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose} // Android Back button
    >
      {/* Dark overlay background */}
      <View style={styles.bottomModalContainer}>
        {/* The white card at the bottom */}
        <View
          style={styles.bottomModalContent}
          className="bg-white dark:bg-slate-800"
        >
          {/* Warning Icon and Title */}
          <View className="items-center mb-4">
            <View className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full items-center justify-center mb-3">
              <Feather name="alert-triangle" size={24} color="#DC2626" />
            </View>
            <Text className="text-xl font-outfit-bold text-slate-900 dark:text-white text-center">
              {title}
            </Text>
          </View>

          {/* Descriptive Message */}
          <Text className="text-slate-600 dark:text-slate-300 text-center mb-6">
            {message}
          </Text>

          {/* Action Buttons Row */}
          <View className="flex-row justify-between w-full">
            {/* Cancel — closes modal without doing anything */}
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 mr-2 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg items-center justify-center"
            >
              <Text className="text-slate-700 dark:text-white font-outfit-bold text-base">
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Confirm — performs the destructive action */}
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 ml-2 h-12 bg-red-600 rounded-lg items-center justify-center"
            >
              <Text className="text-white font-outfit-bold text-base">
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// StyleSheet for the modal layout (NativeWind can't easily do flex-end + backdrop)
const styles = StyleSheet.create({
  bottomModalContainer: {
    flex: 1,
    justifyContent: "flex-end",            // Anchors the card to the bottom of screen
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
  },
  bottomModalContent: {
    width: "100%",
    padding: 24,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
});

export default ConfirmationModal;

