import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, spacing } from '../styles';
import ImagePickerModal from '../components/ImagePickerModal';
import * as api from '../services/api';
import { pickImageFromGallery, pickImageFromCamera } from '../utils/imagePicker';

// ICONS
import NotificationIcon from '../assets/icons/notification.svg';
import SettingIcon from '../assets/icons/setting.svg';
import ProfileIcon from '../assets/icons/profile.svg';
import PlusIcon from '../assets/icons/plus.svg'; // 있으면 사용, 없으면 제거

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const SESSION_STORAGE_KEY = 'fairstay_session_id';

export default function TenantHomeScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // 세션 ID 초기화
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // 저장된 세션 확인
      let storedSessionId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      
      // 세션이 없으면 새로 생성
      if (!storedSessionId) {
        console.log('Creating new session...');
        const session = await api.createSession('tenant');
        storedSessionId = session.sessionId;
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, storedSessionId);
        console.log('Session created:', storedSessionId);
      }
      
      setSessionId(storedSessionId);
    } catch (error) {
      console.error('Session initialization error:', error);
      Alert.alert(
        '연결 오류',
        '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  const handleCamera = async () => {
    setIsModalVisible(false);
    
    const image = await pickImageFromCamera();
    if (image?.uri) {
      uploadAndAnalyzeImage(image.uri);
    }
  };

  const handleGallery = async () => {
    setIsModalVisible(false);
    
    if (!sessionId) {
      Alert.alert('오류', '세션이 초기화되지 않았습니다.');
      return;
    }

    const image = await pickImageFromGallery();
    if (image?.uri) {
      uploadAndAnalyzeImage(image.uri);
    }
  };

  const uploadAndAnalyzeImage = async (imageUri: string) => {
    if (!sessionId) {
      Alert.alert('오류', '세션이 초기화되지 않았습니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. 이미지 업로드
      console.log('Uploading image...');
      const uploadResult = await api.uploadImage(imageUri, sessionId);
      console.log('Image uploaded:', uploadResult.imageId);

      // 2. AI 분석 요청
      console.log('Analyzing image...');
      const analysisResult = await api.analyzeImage(uploadResult.imageId);
      console.log('Analysis completed:', analysisResult);

      // 3. 결과 화면으로 이동
      navigation.navigate('ReportResult', {
        imageId: uploadResult.imageId,
        analysisResult: analysisResult,
      });
    } catch (error: any) {
      console.error('Upload and analyze error:', error);
      Alert.alert(
        '오류',
        error.message || '이미지 업로드 및 분석 중 오류가 발생했습니다.',
        [{ text: '확인' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔝 헤더 */}
      <View style={styles.header}>
        <Text style={[typography.titleXL, styles.logoText]}>FairStay</Text>

        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => console.log('Notification')}>
            <NotificationIcon width={20} height={20} fill={`${colors.surface}E6`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Settings')}>
            <SettingIcon width={20} height={20} fill={`${colors.surface}E6`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Profile')}>
            <ProfileIcon width={19} height={19} fill={`${colors.surface}E6`} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 제목 */}
      <Text style={[typography.titleL, styles.sectionTitle]}>AI 레포트 생성</Text>

      {/* 부제 */}
      <Text style={[typography.bodyL, styles.subtitle]}>
        가구를 촬영하면 손상도를 알 수 있어요!
      </Text>

      {/* 📷 사진 등록 박스 */}
      <TouchableOpacity 
        style={styles.uploadBox}
        onPress={() => setIsModalVisible(true)}
        disabled={isLoading}
      >
        <View style={styles.uploadContents}>
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="#A4ACB3" />
              <Text style={[typography.bodyL, styles.uploadText, { marginTop: spacing.m }]}>
                처리 중...
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.plusIcon}>＋</Text>
              <Text style={[typography.bodyL, styles.uploadText]}>
                사진 등록
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* 세션 ID 표시 (개발용) */}
      {__DEV__ && sessionId && (
        <Text style={styles.debugText}>
          Session ID: {sessionId.substring(0, 8)}...
        </Text>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} />

      {/* 이미지 선택 모달 */}
      <ImagePickerModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCamera={handleCamera}
        onGallery={handleGallery}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  logoText: {
    color: colors.background,
    fontWeight: '600',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: spacing.l,
  },

  /* SECTION TITLE */
  sectionTitle: {
    color: colors.background,
    marginBottom: spacing.s,
  },

  /* SUBTITLE */
  subtitle: {
    textAlign: 'center',
    color: colors.background,
    opacity: 0.8,
    marginBottom: spacing.l,
  },

  /* UPLOAD BOX */
  uploadBox: {
    width: '100%',
    height: 220,
    backgroundColor: '#DDE1E6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  uploadContents: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 40,
    color: '#A4ACB3',
    marginBottom: spacing.s,
  },
  uploadText: {
    color: '#9AA1A9',
  },
  
  /* DEBUG TEXT */
  debugText: {
    marginTop: spacing.m,
    textAlign: 'center',
    color: colors.background,
    opacity: 0.5,
    fontSize: 12,
  },
});
