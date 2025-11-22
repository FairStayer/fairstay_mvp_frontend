/**
 * 이미지 선택 유틸리티
 */

import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';

export interface ImagePickerResponse {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
}

/**
 * 갤러리에서 이미지 선택
 */
export const pickImageFromGallery = async (): Promise<ImagePickerResponse | null> => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
      return null;
    }

    if (result.errorCode) {
      console.error('Image picker error:', result.errorMessage);
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return null;
    }

    return {
      uri: asset.uri,
      fileName: asset.fileName || 'image.jpg',
      type: asset.type || 'image/jpeg',
      fileSize: asset.fileSize,
    };
  } catch (error) {
    console.error('pickImageFromGallery error:', error);
    return null;
  }
};

/**
 * 카메라로 사진 촬영
 */
export const pickImageFromCamera = async (): Promise<ImagePickerResponse | null> => {
  try {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      saveToPhotos: true,
    });

    if (result.didCancel) {
      console.log('User cancelled camera');
      return null;
    }

    if (result.errorCode) {
      console.error('Camera error:', result.errorMessage);
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return null;
    }

    return {
      uri: asset.uri,
      fileName: asset.fileName || 'camera-photo.jpg',
      type: asset.type || 'image/jpeg',
      fileSize: asset.fileSize,
    };
  } catch (error) {
    console.error('pickImageFromCamera error:', error);
    return null;
  }
};

/**
 * 테스트용 더미 이미지 반환
 */
export const getDummyImage = (): ImagePickerResponse => {
  return {
    uri: 'https://picsum.photos/800/600',
    fileName: 'test-image.jpg',
    type: 'image/jpeg',
    fileSize: 100000,
  };
};
