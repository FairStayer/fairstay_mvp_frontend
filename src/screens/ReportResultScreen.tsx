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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, typography } from '../styles';
import * as api from '../services/api';
import ImagePickerModal from '../components/ImagePickerModal';

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
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  useEffect(() => {
    if (imageId && !analysisResult) {
      // imageId만 있고 analysisResult가 없으면 API로 데이터 가져오기
      loadImageData();
    } else if (analysisResult) {
      // analysisResult가 있으면 바로 사용
      setImageData({
        id: imageId || '',
        sessionId: '',
        imageUrl: analysisResult.imageUrl || '',
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

  const handleSharePDF = async () => {
    if (!imageId) {
      Alert.alert('오류', '이미지 ID가 없습니다.');
      return;
    }

    try {
      const shareData = await api.shareImage(imageId);
      Alert.alert(
        'PDF 공유',
        `공유 링크가 생성되었습니다:\n${shareData.shareUrl}`,
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '링크 열기', 
            onPress: () => Linking.openURL(shareData.shareUrl) 
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('오류', error.message || 'PDF 공유 링크 생성에 실패했습니다.');
    }
  };

  const handleShareKakao = async () => {
    if (!imageId) {
      Alert.alert('오류', '이미지 ID가 없습니다.');
      return;
    }

    try {
      const kakaoData = await api.getKakaoShareData(imageId);
      Alert.alert(
        '카카오톡 공유',
        `카카오톡 공유 데이터가 생성되었습니다.\n\n제목: ${kakaoData.title}\n설명: ${kakaoData.description}`,
        [
          { text: '확인' }
        ]
      );
      // TODO: 실제 카카오톡 SDK 연동 필요
    } catch (error: any) {
      Alert.alert('오류', error.message || '카카오톡 공유에 실패했습니다.');
    }
  };

  const handleComplete = () => {
    navigation.navigate('Home');
  };

  const damages = imageData?.damageAnalysis?.damages || [];

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

        {/* 손상 데이터가 없을 때 */}
        {damages.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[typography.bodyL, styles.emptyText]}>
              분석된 손상이 없습니다.
            </Text>
          </View>
        )}

        {/* 손상 데이터 표시 */}
        {damages.map((damage, index) => (
          <View key={index} style={styles.blockWrapper}>

            {/* 이미지 제목 */}
            <Text style={[typography.titleM, styles.imageLabel]}>
              이미지{index + 1}
            </Text>

            {/* AI 처리된 이미지 박스 */}
            <View style={styles.imagePlaceholder}>
              {(imageData?.processedImageUrl || imageData?.imageUrl) ? (
                <Image
                  source={{ uri: imageData.processedImageUrl || imageData.imageUrl }}
                  style={styles.resultImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={[typography.bodyM, styles.placeholderText]}>
                  이미지 없음
                </Text>
              )}
            </View>

            {/* 항목 */}
            <View style={styles.infoRow}>
              <Text style={[typography.bodyL, styles.fieldLabel]}>항목</Text>
              <Text style={[typography.bodyL, styles.fieldValue]}>
                {damage.location || damage.type || '알 수 없음'}
              </Text>
            </View>

            {/* 손상도 */}
            <View style={styles.infoRow}>
              <Text style={[typography.bodyL, styles.fieldLabel]}>손상도</Text>
              <Text style={[typography.bodyL, styles.fieldValue]}>
                {damage.confidence ? `${(damage.confidence * 100).toFixed(0)}%` : '알 수 없음'}
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

        {/* 레포트 내보내기 섹션 */}
        {damages.length > 0 && (
          <View style={styles.shareSection}>
            <Text style={[typography.titleM, styles.shareTitle]}>레포트 내보내기</Text>

            {/* PDF로 내보내기 버튼 */}
            <TouchableOpacity style={styles.shareButton} onPress={handleSharePDF}>
              <View style={[styles.iconCircle, { backgroundColor: '#E53935' }]}>
                <Text style={styles.iconText}>PDF</Text>
              </View>
              <Text style={[typography.bodyL, styles.shareButtonText]}>PDF로 내보내기</Text>
            </TouchableOpacity>

            {/* 카카오톡으로 내보내기 버튼 */}
            <TouchableOpacity style={styles.shareButton} onPress={handleShareKakao}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE500' }]}>
                <Text style={[styles.iconText, { color: '#000' }]}>톡</Text>
              </View>
              <Text style={[typography.bodyL, styles.shareButtonText]}>카카오톡으로 내보내기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 완료 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={[typography.titleM, styles.buttonText]}>완료</Text>
      </TouchableOpacity>

      {/* 공유 모달 (필요시) */}
      <ImagePickerModal
        visible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        onCamera={handleSharePDF}
        onGallery={handleShareKakao}
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
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.xl,
  },

  errorText: {
    color: '#E53935',
    textAlign: 'center',
  },

  emptyContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: spacing.xxl,
    marginVertical: spacing.xl,
    alignItems: 'center',
  },

  emptyText: {
    color: colors.secondary,
    textAlign: 'center',
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
    overflow: 'hidden',
  },

  resultImage: {
    width: '100%',
    height: '100%',
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
    color: colors.primary,
    marginBottom: spacing.xs,
    minWidth: 70,
  },
  
  fieldValue: {
    color: colors.background,
    marginLeft: spacing.s,
    flex: 1,
  },

  description: {
    color: colors.background,
    opacity: 0.8,
    lineHeight: 20,
    marginTop: spacing.xs,
  },

  shareSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: `${colors.background}20`,
  },

  shareTitle: {
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.l,
  },

  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: `${colors.background}30`,
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },

  iconText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 14,
  },

  shareButtonText: {
    color: colors.background,
    flex: 1,
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
