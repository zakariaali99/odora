import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, I18nManager, Platform, DevSettings } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  IBMPlexSansArabic_300Light,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import i18n, { STORAGE_KEY_LANGUAGE } from './src/i18n';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTheme } from './src/theme';
import { useAppStore } from './src/store/useAppStore';
import { LanguageConfirmSheet } from './src/components/LanguageConfirmSheet';
import { previewConfig } from './src/previewTarget';
import { initSessionId } from './src/services/api';

export default function App() {
  const isRTL = useAppStore((s) => s.isRTL);
  const { colors, isDark } = useTheme();
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    IBMPlexSansArabic_300Light,
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    MaterialSymbolsOutlined: require('./assets/fonts/MaterialSymbolsOutlined.ttf'),
  });

  useEffect(() => {
    async function initApp() {
      try {
        await initSessionId();
        const storedLang = await AsyncStorage.getItem(STORAGE_KEY_LANGUAGE);
        const previewLang = __DEV__ ? previewConfig.lang : null;
        const activeLang: 'ar' | 'en' =
          previewLang ?? (storedLang === 'en' || storedLang === 'ar' ? storedLang : 'ar');
        const isRtl = activeLang === 'ar';

        await i18n.changeLanguage(activeLang);
        useAppStore.setState({ language: activeLang, isRTL: isRtl });

        if (Platform.OS === 'web') {
          if (typeof document !== 'undefined') {
            document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
            document.documentElement.setAttribute('lang', activeLang);
          }
        } else {
          // Native layout mirroring check
          if (I18nManager.isRTL !== isRtl) {
            I18nManager.allowRTL(isRtl);
            I18nManager.forceRTL(isRtl);
            try {
              await Promise.race([
                Updates.reloadAsync(),
                new Promise((resolve) => setTimeout(resolve, 500)),
              ]);
            } catch (err) {
              // expo-updates is disabled in dev mode; native cold launch applies RTL
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load initial language configuration:', err);
      } finally {
        setIsReady(true);
      }
    }

    initApp();
  }, []);

  if (!fontsLoaded || !isReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primarySoft} />
      </View>
    );
  }

  const linking = {
    prefixes: ['odora://', 'http://localhost:8081'],
    config: {
      screens: {
        DevUiKit: 'dev/ui-kit',
        MainTabs: '',
        Settings: 'settings',
      },
    },
  };

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.rootContainer,
          // Direction property for React Native Web layout mirroring
          { direction: isRTL ? 'rtl' : 'ltr' } as any,
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
        <LanguageConfirmSheet />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 390 : undefined,
    alignSelf: 'center',
  },
});

// reload trigger: 1790232608.8648598
