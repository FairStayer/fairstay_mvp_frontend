/**
 * API Configuration
 * Backend API URL 설정
 */

import { Platform } from 'react-native';

// 개발 환경
// Android 에뮬레이터에서는 localhost 대신 10.0.2.2 사용
// iOS 시뮬레이터와 실제 디바이스는 localhost 사용 (같은 네트워크에 있어야 함)
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:3000', // Android 에뮬레이터
  default: 'http://localhost:3000', // iOS 시뮬레이터 또는 웹
});

// 실제 디바이스에서 테스트 시 컴퓨터의 IP 주소 사용
// 예: 'http://192.168.0.10:3000'
// const DEV_API_URL = 'http://192.168.0.10:3000';

// 프로덕션 환경 (Lambda API Gateway URL)
// FairStay Backend API (AWS Lambda)
const PROD_API_URL = 'https://y0uhk6afg9.execute-api.ap-northeast-2.amazonaws.com/default/fairstay-mvp-backend';

// 현재 환경에 따라 API URL 선택
export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// API 엔드포인트
export const API_ENDPOINTS = {
  // 세션
  CREATE_SESSION: '/api/session/create',
  
  // 이미지
  UPLOAD_IMAGE: '/api/image/upload',
  ANALYZE_IMAGE: (imageId: string) => `/api/image/analyze/${imageId}`,
  GET_IMAGE: (imageId: string) => `/api/image/${imageId}`,
  
  // 공유
  SHARE_IMAGE: (imageId: string) => `/api/share/${imageId}`,
  
  // 설문
  SUBMIT_SURVEY: '/api/survey/submit',
};

// HTTP 요청 타임아웃 (밀리초)
export const REQUEST_TIMEOUT = 30000; // 30초

// 이미지 업로드 타임아웃 (밀리초)
export const UPLOAD_TIMEOUT = 60000; // 60초

// AI 분석 타임아웃 (밀리초)
export const ANALYSIS_TIMEOUT = 120000; // 120초 (AI 분석은 시간이 걸릴 수 있음)
