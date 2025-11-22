
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../styles';
import DefaultIcon from '../assets/icons/default.svg';

interface Props {
  title: string;
  desc: string;
  date: string;
  status: 'In Progress' | 'Confirmed';
}

export default function ContractCard({ title, desc, date, status }: Props) {
  const statusColor =
    status === 'In Progress' ? colors.primary : '#A1A1AA';

  return (
    <View style={styles.card}>
      {/* NFT 이미지 / 썸네일 자리 */}
      <View style={styles.imageBox}>
        <DefaultIcon width={60} height={60} />
      </View>

      {/* 계약 정보 */}
      <View style={styles.info}>
        <Text style={[typography.titleM, styles.title]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[typography.bodyS, styles.desc]} numberOfLines={1}>
          {desc}
        </Text>
        <Text style={[typography.caption, styles.date]}>{date}</Text>
      </View>

      {/* 상태 뱃지 */}
      <View style={[styles.badge, { backgroundColor: statusColor }]}>
        <Text style={[typography.label, styles.badgeText]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.m,
    marginVertical: spacing.s,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  imageBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: spacing.m,
    overflow: 'hidden',
  },
  gradientPlaceholder: {
    flex: 1,
    backgroundColor: colors.secondary,
    opacity: 0.3,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.background,
  },
  desc: {
    color: '#6B7280',
    marginTop: 2,
  },
  date: {
    color: '#9CA3AF',
    marginTop: 2,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.surface,
    fontSize: typography.label.fontSize,
    fontFamily: typography.label.fontFamily,
    letterSpacing: typography.label.letterSpacing,
  },
});
