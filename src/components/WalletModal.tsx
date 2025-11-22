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

// ✅ 아이콘
import MetamaskIcon from '../assets/icons/metamask.svg';
import WalletConnectIcon from '../assets/icons/walletconnect.svg';

interface WalletModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

export default function WalletModal({ visible, onClose, onSelect }: WalletModalProps) {
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
          <Text style={styles.title}>Connect Wallet</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('Metamask')}
          >
            <MetamaskIcon width={28} height={28} style={{ marginRight: 12 }} />
            <Text style={styles.optionText}>Metamask</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => onSelect('WalletConnect')}
          >
            <WalletConnectIcon width={28} height={28} style={{ marginRight: 12 }} />
            <Text style={styles.optionText}>Wallet Connect</Text>
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
  optionText: {
    fontSize: 16,
    color: colors.background,
  },
});
