import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors, spacing } from '../styles';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}

export default function ImagePickerModal({ 
  visible, 
  onClose, 
  onCamera, 
  onGallery 
}: ImagePickerModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.handle} />
          <Text style={styles.title}>사진 선택</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={onCamera}
          >
            <Text style={styles.icon}>📷</Text>
            <Text style={styles.optionText}>카메라 촬영</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={onGallery}
          >
            <Text style={styles.icon}>🖼️</Text>
            <Text style={styles.optionText}>갤러리에서 추가</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.m,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xxl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.m,
  },
  title: {
    textAlign: 'center',
    color: colors.background,
    fontWeight: '600',
    fontSize: 17,
    marginBottom: spacing.l,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    marginBottom: spacing.s,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: colors.background,
    fontWeight: '500',
  },
});
