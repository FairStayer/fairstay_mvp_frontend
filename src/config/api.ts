/**
 * API Configuration
 * Backend API URL 설정
 */

import { Platform } from 'react-native';

// 배포된 백엔드 API URL (AWS Lambda)
// Base URL: https://y0uhk6afg9.execute-api.ap-northeast-2.amazonaws.com/default/fairstay-mvp-backend
export const API_URL = 'https://y0uhk6afg9.execute-api.ap-northeast-2.amazonaws.com/default/fairstay-mvp-backend';

// API 엔드포인트
export const API_ENDPOINTS = {
  // Root & Health
  ROOT: '/',
  HEALTH: '/health',
  
  // 세션
  CREATE_SESSION: '/api/session/create',
  VALIDATE_SESSION: (sessionId: string) => `/api/session/validate/${sessionId}`,
  
  // 이미지 (3단계 업로드 프로세스)
  PRESIGNED_URL: '/api/image/presigned-url',
  CONFIRM_UPLOAD: '/api/image/confirm',
  ANALYZE_IMAGE: (imageId: string) => `/api/image/analyze/${imageId}`,
  GET_IMAGE: (imageId: string) => `/api/image/${imageId}`,
  GET_SESSION_IMAGES: (sessionId: string) => `/api/image/session/${sessionId}`,
  
  // 공유
  GENERATE_SHARE_LINK: (imageId: string) => `/api/share/generate/${imageId}`,
  KAKAO_SHARE: (imageId: string) => `/api/share/kakao-share/${imageId}`,
  
  // 설문
  SUBMIT_SURVEY: '/api/survey/submit',
  SURVEY_RESULTS: '/api/survey/results',
};

// HTTP 요청 타임아웃 (밀리초)
export const REQUEST_TIMEOUT = 30000; // 30초

// 이미지 업로드 타임아웃 (밀리초)
export const UPLOAD_TIMEOUT = 60000; // 60초

// AI 분석 타임아웃 (밀리초)
export const ANALYSIS_TIMEOUT = 120000; // 120초
