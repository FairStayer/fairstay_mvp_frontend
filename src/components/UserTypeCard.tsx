import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing } from '../styles';

interface Props {
  label: string;
  icon: any;
  selected: boolean;
  onPress: () => void;
  color: string;
}

export default function UserTypeCard({ label, icon, selected, onPress, color }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && { backgroundColor: color },
        selected && styles.shadowActive,
      ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Image
          source={icon}
          style={[
            styles.icon,
            { tintColor: selected ? colors.surface : '#4B5563' },
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            typography.titleM,
            { color: selected ? colors.surface : '#374151' },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignSelf: 'center',
    paddingVertical: spacing.xl, // 카드 높이 확보
    marginVertical: spacing.s,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: spacing.s,
  },
  shadowActive: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
});
