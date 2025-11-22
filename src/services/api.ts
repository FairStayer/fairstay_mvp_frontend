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
  userType: string;
  createdAt: number;
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
export const createSession = async (userType: 'tenant' | 'landlord'): Promise<SessionResponse> => {
  try {
    const response = await apiClient.post<{ success: boolean; session: SessionResponse }>(
      API_ENDPOINTS.CREATE_SESSION,
      { userType }
    );
    
    if (response.data.success && response.data.session) {
      return response.data.session;
    }
    
    throw new Error('Failed to create session');
  } catch (error) {
    console.error('Create session error:', error);
    throw handleApiError(error);
  }
};

/**
 * 이미지 업로드
 */
export const uploadImage = async (
  imageUri: string, 
  sessionId: string
): Promise<ImageUploadResponse> => {
  try {
    // React Native에서 이미지 파일 준비
    const formData = new FormData();
    
    // 이미지 파일 추가
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
    
    // 세션 ID 추가
    formData.append('sessionId', sessionId);
    
    const response = await apiClient.post<{ success: boolean } & ImageUploadResponse>(
      API_ENDPOINTS.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: UPLOAD_TIMEOUT,
      }
    );
    
    if (response.data.success) {
      return {
        imageId: response.data.imageId,
        imageUrl: response.data.imageUrl,
        message: response.data.message,
      };
    }
    
    throw new Error('Failed to upload image');
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
export const shareImage = async (imageId: string): Promise<{ shareUrl: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; shareUrl: string }>(
      API_ENDPOINTS.SHARE_IMAGE(imageId)
    );
    
    if (response.data.success) {
      return { shareUrl: response.data.shareUrl };
    }
    
    throw new Error('Failed to create share link');
  } catch (error) {
    console.error('Share image error:', error);
    throw handleApiError(error);
  }
};

/**
 * 설문 제출
 */
export const submitSurvey = async (surveyData: {
  sessionId: string;
  imageId: string;
  responses: Record<string, any>;
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
  shareImage,
  submitSurvey,
  checkConnection,
};
