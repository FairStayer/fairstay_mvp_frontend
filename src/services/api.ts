/**
 * API Service Layer
 * Backend API와의 통신을 담당하는 서비스
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  API_URL, 
  API_ENDPOINTS, 
  REQUEST_TIMEOUT, 
  UPLOAD_TIMEOUT, 
  ANALYSIS_TIMEOUT 
} from '../config/api';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SessionResponse {
  sessionId: string;
  expiresAt: number;
}

export interface ImageUploadResponse {
  imageId: string;
  imageUrl: string;
  message: string;
}

export interface Damage {
  type: string;
  severity: string;
  location: string;
  confidence: number;
  description?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AnalysisResponse {
  imageId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedImageUrl?: string;
  damages: Damage[];
}

export interface ImageDetailResponse {
  id: string;
  sessionId: string;
  imageUrl: string;
  processedImageUrl?: string;
  damageAnalysis: {
    status: string;
    damages: Damage[];
    processedAt?: number;
  };
  createdAt: number;
}

/**
 * 세션 생성
 */
export const createSession = async (): Promise<SessionResponse> => {
  try {
    const response = await apiClient.post<{ 
      success: boolean; 
      sessionId: string;
      expiresAt: number;
    }>(
      API_ENDPOINTS.CREATE_SESSION
    );
    
    if (response.data.success) {
      return {
        sessionId: response.data.sessionId,
        expiresAt: response.data.expiresAt,
      };
    }
    
    throw new Error('Failed to create session');
  } catch (error) {
    console.error('Create session error:', error);
    throw handleApiError(error);
  }
};

/**
 * 이미지 업로드 (3단계 프로세스)
 * 1단계: Presigned URL 받기
 * 2단계: S3에 직접 업로드
 * 3단계: 업로드 완료 확인
 */
export const uploadImage = async (
  imageUri: string, 
  sessionId: string
): Promise<ImageUploadResponse> => {
  try {
    // 1단계: Presigned URL 받기
    const filename = `photo_${Date.now()}.jpg`;
    const presignedResponse = await apiClient.post<{ 
      success: boolean;
      uploadUrl: string;
      s3Key: string;
      imageUrl: string;
      expiresIn: number;
    }>(
      API_ENDPOINTS.PRESIGNED_URL,
      {
        sessionId,
        filename,
        contentType: 'image/jpeg'
      }
    );
    
    if (!presignedResponse.data.success) {
      throw new Error('Failed to get presigned URL');
    }
    
    const { uploadUrl, s3Key, imageUrl } = presignedResponse.data;
    
    // 2단계: S3에 직접 업로드
    // React Native에서 이미지 파일 읽기
    const imageBlob = await fetch(imageUri).then(res => res.blob());
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: imageBlob,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image to S3');
    }
    
    // 3단계: 업로드 완료 확인
    const confirmResponse = await apiClient.post<{ 
      success: boolean;
      imageId: string;
      imageUrl: string;
      message: string;
    }>(
      API_ENDPOINTS.CONFIRM_UPLOAD,
      {
        sessionId,
        s3Key,
        imageUrl
      },
      {
        timeout: UPLOAD_TIMEOUT,
      }
    );
    
    if (confirmResponse.data.success) {
      return {
        imageId: confirmResponse.data.imageId,
        imageUrl: confirmResponse.data.imageUrl,
        message: confirmResponse.data.message,
      };
    }
    
    throw new Error('Failed to confirm image upload');
  } catch (error) {
    console.error('Upload image error:', error);
    throw handleApiError(error);
  }
};

/**
 * AI 이미지 분석 요청
 */
export const analyzeImage = async (imageId: string): Promise<AnalysisResponse> => {
  try {
    const response = await apiClient.post<{ success: boolean } & AnalysisResponse>(
      API_ENDPOINTS.ANALYZE_IMAGE(imageId),
      {},
      {
        timeout: ANALYSIS_TIMEOUT,
      }
    );
    
    if (response.data.success) {
      return {
        imageId: response.data.imageId,
        status: response.data.status,
        processedImageUrl: response.data.processedImageUrl,
        damages: response.data.damages,
      };
    }
    
    throw new Error('Failed to analyze image');
  } catch (error) {
    console.error('Analyze image error:', error);
    throw handleApiError(error);
  }
};

/**
 * 이미지 상세 정보 조회
 */
export const getImageDetail = async (imageId: string): Promise<ImageDetailResponse> => {
  try {
    const response = await apiClient.get<{ success: boolean; image: ImageDetailResponse }>(
      API_ENDPOINTS.GET_IMAGE(imageId)
    );
    
    if (response.data.success && response.data.image) {
      return response.data.image;
    }
    
    throw new Error('Failed to get image detail');
  } catch (error) {
    console.error('Get image detail error:', error);
    throw handleApiError(error);
  }
};

/**
 * 공유 링크 생성
 */
export const shareImage = async (imageId: string): Promise<{ 
  shareUrl: string;
  shareId: string;
  expiresAt: number;
}> => {
  try {
    const response = await apiClient.post<{ 
      success: boolean; 
      shareUrl: string;
      shareId: string;
      expiresAt: number;
    }>(
      API_ENDPOINTS.GENERATE_SHARE_LINK(imageId)
    );
    
    if (response.data.success) {
      return { 
        shareUrl: response.data.shareUrl,
        shareId: response.data.shareId,
        expiresAt: response.data.expiresAt,
      };
    }
    
    throw new Error('Failed to create share link');
  } catch (error) {
    console.error('Share image error:', error);
    throw handleApiError(error);
  }
};

/**
 * 세션의 모든 이미지 조회
 */
export const getSessionImages = async (sessionId: string): Promise<{
  count: number;
  images: ImageDetailResponse[];
}> => {
  try {
    const response = await apiClient.get<{ 
      success: boolean; 
      count: number;
      images: ImageDetailResponse[];
    }>(
      API_ENDPOINTS.GET_SESSION_IMAGES(sessionId)
    );
    
    if (response.data.success) {
      return {
        count: response.data.count,
        images: response.data.images,
      };
    }
    
    throw new Error('Failed to get session images');
  } catch (error) {
    console.error('Get session images error:', error);
    throw handleApiError(error);
  }
};

/**
 * 카카오톡 공유용 데이터 생성
 */
export const getKakaoShareData = async (imageId: string): Promise<{
  title: string;
  description: string;
  imageUrl: string;
  shareUrl: string;
}> => {
  try {
    const response = await apiClient.post<{ 
      success: boolean; 
      kakaoShareData: {
        title: string;
        description: string;
        imageUrl: string;
        shareUrl: string;
      };
    }>(
      API_ENDPOINTS.KAKAO_SHARE(imageId)
    );
    
    if (response.data.success) {
      return response.data.kakaoShareData;
    }
    
    throw new Error('Failed to get kakao share data');
  } catch (error) {
    console.error('Get kakao share data error:', error);
    throw handleApiError(error);
  }
};

/**
 * 설문 제출
 */
export const submitSurvey = async (surveyData: {
  sessionId: string;
  hasRealEstateExperience: boolean;
  explanationRating: number;
  processConvenienceRating: number;
  overallSatisfactionRating: number;
  additionalComments?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.SUBMIT_SURVEY,
      surveyData
    );
    
    return response.data;
  } catch (error) {
    console.error('Submit survey error:', error);
    throw handleApiError(error);
  }
};

/**
 * API 에러 핸들링
 */
const handleApiError = (error: any): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    if (axiosError.response) {
      // 서버 응답이 있는 경우
      const message = axiosError.response.data?.message || 
                     axiosError.response.data?.error || 
                     `Server error: ${axiosError.response.status}`;
      return new Error(message);
    } else if (axiosError.request) {
      // 요청은 보냈지만 응답이 없는 경우
      return new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    }
  }
  
  // 기타 에러
  return error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다.');
};

/**
 * 네트워크 연결 상태 확인
 */
export const checkConnection = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default {
  createSession,
  uploadImage,
  analyzeImage,
  getImageDetail,
  getSessionImages,
  shareImage,
  getKakaoShareData,
  submitSurvey,
  checkConnection,
};
