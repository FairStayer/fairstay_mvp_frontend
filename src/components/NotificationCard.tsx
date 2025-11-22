import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../styles';
import NotificationIcon from '../assets/icons/notification.svg';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
  time: string;
  status: 'Read' | 'Unread';
}

export default function NotificationCard({ title, time, status }: Props) {
  const navigation = useNavigation<any>();
  const isUnread = status === 'Unread';

  const handlePress = () => {
    navigation.navigate('DummyContractDetail');
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { opacity: isUnread ? 1 : 0.6 }]}
      onPress={handlePress}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          <NotificationIcon width={26} height={26} />
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={[
            typography.label,
            { color: isUnread ? colors.secondary : '#9CA3AF' },
          ]}
        >
          {status}
        </Text>
        <Text style={[typography.bodyL, { color: colors.background, marginTop: 2 }]}>
          {title}
        </Text>
        <Text
          style={[
            typography.caption,
            { color: isUnread ? colors.secondary : '#9CA3AF', marginTop: 3 },
          ]}
        >
          {time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftSection: {
    marginRight: spacing.m,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D9D6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
  },
});
