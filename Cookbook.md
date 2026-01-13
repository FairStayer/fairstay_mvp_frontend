# 에뮬레이터 한번 켜고 해야함
emulator -list-avds
emulator -avd Pixel_5

# 이거 아래 한 줄로 바로 전체 실행됨!!! 막 터미널 여러 개 켤 필요 없음!!!
npx react-native run-android

# 고질적인 네비게이션 관련 문제
# 1: React Native 0.75와 호환되는 버전으로 변경
npm i react-native-gesture-handler@2.18.0 \
      react-native-screens@3.34.0 \
      react-native-safe-area-context@4.10.9 \
      @react-navigation/native@6.1.18 \
      @react-navigation/stack@6.4.1

# 2. 그레이들 플러그인
// ❌ 기존 버전
classpath("com.android.tools.build:gradle:8.5.0")

// ✅ 해결: 8.6.0으로 업그레이드
classpath("com.android.tools.build:gradle:8.6.0")

# 3. compileSdk
// ❌ 기존 버전
compileSdk = 34

// ✅ 해결: 35로 업그레이드
compileSdk = 35

# 4. Android 번들 파일 누락
1) android\app\src\main\assets\모든 파일삭제
+ assets폴더가 없다면 생성
2) 아래 명렁어 실행
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
3) android\app\src\main\assets\index.android.bundle 
4) 위 폴더 위치의 파란색 글씨(index.android.bundle)가 생성되었으면 끝

# 아니 또 이제 백엔드 켠 후에는 아래 코드로 하라네
npm start

# IP 확인
ipconfig getifaddr en0

# ================================================= #

# 오류날 때
rm -rf node_modules
rm -rf yarn.lock package-lock.json
rm -rf /tmp/metro-*
watchman watch-del-all || true
rm -rf android/.gradle
rm -rf android/app/build
rm -rf android/build

npm install

npx react-native start --reset-cache

# 오류날 때 2
watchman watch-del-all || true
killall -9 node || true
adb uninstall com.fundit_dapp_frontend || true

rm -rf node_modules android/.gradle android/app/build
npm i

cd android && ./gradlew clean && cd ..

npx react-native start --reset-cache

# 오류날 때 3
cd android
./gradlew clean
cd ..
npx react-native run-android

# 피그마 MCP 연결
cd /Users/susie/Development/cursor-talk-to-figma-mcp-main
bun setup
bun socket
# 새로운 터미널에서
bunx cursor-talk-to-figma-mcp
