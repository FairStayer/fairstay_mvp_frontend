import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, typography } from '../styles';
import * as api from '../services/api';

type ReportResultScreenRouteProp = RouteProp<RootStackParamList, 'ReportResult'>;
type ReportResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReportResult'>;

interface Props {
  route: ReportResultScreenRouteProp;
  navigation: ReportResultScreenNavigationProp;
}

export default function ReportResultScreen({ route, navigation }: Props) {
  const { imageId, analysisResult } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState<api.ImageDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageId && !analysisResult) {
      // imageId만 있고 analysisResult가 없으면 API로 데이터 가져오기
      loadImageData();
    } else if (analysisResult) {
      // analysisResult가 있으면 바로 사용
      setImageData({
        id: imageId || '',
        sessionId: '',
        imageUrl: '',
        processedImageUrl: analysisResult.processedImageUrl,
        damageAnalysis: {
          status: analysisResult.status,
          damages: analysisResult.damages,
        },
        createdAt: Date.now(),
      } as api.ImageDetailResponse);
    }
  }, [imageId, analysisResult]);

  const loadImageData = async () => {
    if (!imageId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getImageDetail(imageId);
      setImageData(data);
    } catch (err: any) {
      console.error('Load image data error:', err);
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
      Alert.alert('오류', err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    navigation.navigate('Home');
  };

  // 예시 데이터 (API 데이터 없을 때)
  const sampleData = [
    {
      type: 'crack',
      severity: 'medium',
      location: '벽지',
      confidence: 0.85,
      description: '전반적으로 사용감은 있으나 흠집이나 변색된 부분이 없으며 상태가 좋아보임.',
    },
  ];

  const damages = imageData?.damageAnalysis?.damages || sampleData;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.background} />
          <Text style={[typography.bodyL, styles.loadingText]}>
            데이터를 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        
        {/* 🔝 헤더 */}
        <Text style={[typography.titleXL, styles.logo]}>FairStay</Text>

        {/* 페이지 제목 */}
        <Text style={[typography.titleL, styles.title]}>AI 레포트 결과</Text>

        {/* 에러 표시 */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {damages.map((damage, index) => (
          <View key={index} style={styles.blockWrapper}>

            {/* 이미지 제목 */}
            <Text style={[typography.titleM, styles.imageLabel]}>
              손상 {index + 1}
            </Text>

            {/* AI 처리된 이미지 박스 */}
            {imageData?.processedImageUrl && (
              <View style={styles.imagePlaceholder}>
                <Image
                  source={{ uri: imageData.processedImageUrl }}
                  style={styles.resultImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* 항목 */}
            <View style={styles.infoRow}>
              <Text style={[typography.bodyL, styles.fieldLabel]}>유형</Text>
              <Text style={[typography.bodyL, styles.fieldValue]}>{damage.type}</Text>
            </View>

            {/* 심각도 */}
            <View style={styles.infoRow}>
              <Text style={[typography.bodyL, styles.fieldLabel]}>심각도</Text>
              <Text style={[typography.bodyL, styles.fieldValue]}>{damage.severity}</Text>
            </View>

            {/* 위치 */}
            <View style={styles.infoRow}>
              <Text style={[typography.bodyL, styles.fieldLabel]}>위치</Text>
              <Text style={[typography.bodyL, styles.fieldValue]}>{damage.location}</Text>
            </View>

            {/* 신뢰도 */}
            <View style={styles.infoRow}>
              <Text style={[typography.bodyL, styles.fieldLabel]}>신뢰도</Text>
              <Text style={[typography.bodyL, styles.fieldValue]}>
                {(damage.confidence * 100).toFixed(0)}%
              </Text>
            </View>

            {/* 설명 */}
            {damage.description && (
              <View style={styles.infoRowColumn}>
                <Text style={[typography.bodyL, styles.fieldLabel]}>설명</Text>
                <Text style={[typography.bodyL, styles.description]}>
                  {damage.description}
                </Text>
              </View>
            )}

          </View>
        ))}
      </ScrollView>

      {/* OK 버튼 */}
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
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },

  loadingText: {
    marginTop: spacing.m,
    color: colors.background,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
  },

  errorText: {
    color: '#E53935',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  logo: {
    color: colors.background,
    marginBottom: spacing.l,
  },

  title: {
    color: colors.background,
    marginBottom: spacing.xl,
  },

  blockWrapper: {
    marginBottom: spacing.xxl,
  },

  imageLabel: {
    textAlign: 'center',
    color: colors.background,
    marginBottom: spacing.s,
  },

  imagePlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#DDE1E6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
  },

  resultImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },

  imageBox: {
    width: '100%',
    height: 220,
    backgroundColor: '#DDE1E6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  realImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  placeholderText: {
    color: '#9AA1A9',
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  infoRowColumn: {
    marginBottom: spacing.m,
  },

  fieldLabel: {
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  fieldValue: {
    color: colors.background,
    marginLeft: spacing.s,
  },

  description: {
    color: colors.background,
    opacity: 0.8,
    lineHeight: 20,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.surface,
  },
});
