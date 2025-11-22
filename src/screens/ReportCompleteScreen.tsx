import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, spacing } from '../styles';
import DraftIcon from '../assets/icons/draft.svg'; // ✅ 아이콘 추가

type ReportCompleteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReportComplete'>;

interface Props {
  navigation: ReportCompleteScreenNavigationProp;
}

export default function DraftCompleteScreen({ navigation }: Props) {
  const handleNext = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ 중앙 아이콘 */}
      <View style={styles.iconWrapper}>
        <DraftIcon width={180} height={180} />
      </View>

      {/* ✅ 메시지 */}
      <Text style={[typography.titleXL, styles.message]}>
        Your contract draft{"\n"}has been completed
      </Text>

      {/* ✅ 기존 버튼 모양 적용 */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={[typography.titleM, styles.buttonText]}>OK</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  iconWrapper: {
    marginBottom: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%', // ✅ 하단 버튼 스타일 유지
    position: 'absolute',
    bottom: spacing.xl,
  },
  buttonText: {
    color: colors.surface,
  },
});
