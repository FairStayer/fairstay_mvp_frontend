import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, spacing } from '../styles';

// ✅ SVG import
import LoginBackground from '../assets/icons/loginback.svg';
import LoginIcon from '../assets/icons/login.svg';

// ✅ 모달 컴포넌트 import
import WalletModal from '../components/WalletModal';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* 배경 */}
      <View style={styles.backgroundWrapper}>
        <LoginBackground
          width="1000"
          height="900"
          style={{ transform: [{ translateX: -100 }] }}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 중앙 아이콘 */}
        <View style={styles.iconWrapper}>
          <LoginIcon width={120} height={120} />
        </View>

        {/* 텍스트 섹션 */}
        <View style={styles.textBox}>
          <Text style={[typography.titleXL, styles.title]}>
            NEW STANDARD{'\n'}OF LIVING SPACE
          </Text>
          <Text style={[typography.bodyL, styles.subtitle]}>
            Experience the new standard of space contracts – secure, intuitive,
            and built for the day you live today.
          </Text>
        </View>

        {/* 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[typography.titleM, styles.buttonText]}>
            Get Started !
          </Text>
        </TouchableOpacity>
      </View>

      {/* 모달 */}
      <WalletModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={(type) => {
          setIsModalVisible(false);
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  backgroundWrapper: { ...StyleSheet.absoluteFillObject },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  iconWrapper: {
    marginTop: 280,
    alignItems: 'center',
    marginBottom: 140,
  },

  textBox: {
    marginBottom: spacing.m,
  },

  title: {
    textAlign: 'left',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 38,
    marginBottom: spacing.s,
  },

  subtitle: {
    textAlign: 'left',
    color: '#FFFFFF',
    opacity: 0.95,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: '90%',
  },

  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginHorizontal: 0,
  },

  buttonText: {
    color: colors.background,
  },
});
