import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = "Remove Item?",
  message = "Are you sure you want to remove this item from your cart? This action cannot be undone.",
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.bottomModalContainer}>
        <View style={styles.bottomModalContent} className="bg-white dark:bg-slate-800">
          <View className="items-center mb-4">
            <View className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full items-center justify-center mb-3">
              <Feather name="alert-triangle" size={24} color="#DC2626" />
            </View>
            <Text className="text-xl font-outfit-bold text-slate-900 dark:text-white text-center">
              {title}
            </Text>
          </View>
          
          <Text className="text-slate-600 dark:text-slate-300 text-center mb-6">
            {message}
          </Text>
          
          <View className="flex-row justify-between w-full">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 mr-2 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg items-center justify-center"
            >
              <Text className="text-slate-700 dark:text-white font-outfit-bold text-base">
                Cancel
              </Text>
            </TouchableOpacity>
            
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

// Modal styles
const styles = StyleSheet.create({
  bottomModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomModalContent: {
    width: '100%',
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
});

export default ConfirmationModal;