import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { Icon } from '../components/ui/Icon';
import { AppBar } from '../components/ui/AppBar';

interface ConnectionStatesScreenProps {
  navigation?: any;
  route?: any;
}

type ConnectionStateTab = 'disabled' | 'out_of_range' | 'syncing';

export const ConnectionStatesScreen: React.FC<ConnectionStatesScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors, isDark, isRTL } = useTheme();
  const insets = useSafeAreaInsets();

  const initialTab: ConnectionStateTab = route?.params?.initialState || 'disabled';
  const [activeTab, setActiveTab] = useState<ConnectionStateTab>(initialTab);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animation pulses
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleRetry = () => {
    setIsReconnecting(true);
    showToast(isRTL ? 'جاري محاولة إعادة الاتصال...' : 'Attempting to reconnect...');
    setTimeout(() => {
      setIsReconnecting(false);
      showToast(isRTL ? 'تم الاتصال بالجهاز بنجاح' : 'Connected successfully');
    }, 2000);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      {/* 64pt App Bar */}
      <AppBar
        title={isRTL ? 'حالات الاتصال' : 'Connection States'}
        showBack={true}
        onBack={() => navigation?.goBack?.()}
        actions={[
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation?.navigate?.('Account'),
            label: 'Profile',
          },
        ]}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View style={[styles.toastContainer, { backgroundColor: colors.ink }]}>
          <Icon name="info" size={18} color={colors.accent} />
          <Text style={[styles.toastText, { color: colors.onInk }]}>
            {toastMessage}
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 64 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Introduction */}
        <View style={styles.headerSection}>
          <View style={[styles.telemetryBadge, { backgroundColor: colors.surfaceMuted }]}>
            <Icon name="sensors" size={14} color={colors.primary} />
            <Text style={[styles.telemetryBadgeText, { color: colors.primary }]}>
              {isRTL ? 'تشخيص الاتصال اللاسلكي' : 'Wireless Diagnostic'}
            </Text>
          </View>

          <Text style={[styles.screenTitle, { color: colors.text }]}>
            {isRTL ? 'حالة اتصال الموزع' : 'Diffuser Connection'}
          </Text>

          <Text style={[styles.screenSubtitle, { color: colors.textMuted }]}>
            {isRTL
              ? 'مراقبة اتصال البلوتوث وتشخيص الأعطال لموزع أودورا.'
              : 'Monitor Bluetooth connection status and diagnostic telemetry.'}
          </Text>

          {/* 3-State Switcher Tabs */}
          <View style={[styles.tabBar, { backgroundColor: colors.surfaceMuted }]}>
            <TouchableOpacity
              onPress={() => setActiveTab('disabled')}
              style={[
                styles.tabBtn,
                activeTab === 'disabled' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                },
              ]}
            >
              <Icon
                name="bluetooth_disabled"
                size={16}
                color={activeTab === 'disabled' ? colors.onPrimary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'disabled' ? colors.onPrimary : colors.textMuted,
                    fontWeight: activeTab === 'disabled' ? '600' : '400',
                  },
                ]}
              >
                {isRTL ? 'البلوتوث متوقف' : 'Disabled'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('out_of_range')}
              style={[
                styles.tabBtn,
                activeTab === 'out_of_range' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                },
              ]}
            >
              <Icon
                name="podcasts"
                size={16}
                color={activeTab === 'out_of_range' ? colors.onPrimary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'out_of_range' ? colors.onPrimary : colors.textMuted,
                    fontWeight: activeTab === 'out_of_range' ? '600' : '400',
                  },
                ]}
              >
                {isRTL ? 'خارج النطاق' : 'Out of Range'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('syncing')}
              style={[
                styles.tabBtn,
                activeTab === 'syncing' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                },
              ]}
            >
              <Icon
                name="sync"
                size={16}
                color={activeTab === 'syncing' ? colors.onPrimary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'syncing' ? colors.onPrimary : colors.textMuted,
                    fontWeight: activeTab === 'syncing' ? '600' : '400',
                  },
                ]}
              >
                {isRTL ? 'جاري الاتصال' : 'Connecting'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATE 1: Bluetooth Switched Off */}
        {activeTab === 'disabled' && (
          <View style={[styles.stateCard, { backgroundColor: colors.bgAlt }]}>
            <View style={[styles.largeIconCircle, { backgroundColor: colors.surfaceMuted }]}>
              <Icon name="bluetooth_disabled" size={40} color={colors.textMuted} />
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.textSubtle }]} />
              <Text style={[styles.badgeText, { color: colors.textMuted }]}>
                {isRTL ? 'اتصال البلوتوث معطّل' : 'Bluetooth Radio Off'}
              </Text>
            </View>

            <Text style={[styles.stateTitle, { color: colors.text }]}>
              {isRTL ? 'البلوتوث غير مفعّل' : 'Bluetooth is Switched Off'}
            </Text>

            <Text style={[styles.stateDescription, { color: colors.textMuted }]}>
              {isRTL
                ? 'يتطلب موزع أودورا اتصال البلوتوث للتواصل المباشر وضبط مستويات التفتيت وقراءة مخزون الزيت. يرجى تفعيل البلوتوث من إعدادات جهازك للمتابعة.'
                : 'Odora requires Bluetooth to control cold-air micro-diffusion and read cartridge levels. Turn on Bluetooth in your device settings.'}
            </Text>

            <View style={styles.actionCol}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openSettings?.();
                  showToast(isRTL ? 'جاري فتح إعدادات النظام...' : 'Opening system settings...');
                }}
                style={[styles.primaryCtaBtn, { backgroundColor: colors.ink }]}
                activeOpacity={0.85}
              >
                <Icon name="bluetooth" size={18} color={colors.onInk} />
                <Text style={[styles.primaryCtaText, { color: colors.onInk }]}>
                  {isRTL ? 'فتح إعدادات النظام' : 'Open System Settings'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Offline Tip */}
            <View style={[styles.tipCard, { backgroundColor: colors.surfaceMuted }]}>
              <Icon name="wb_twilight" size={18} color={colors.primary} />
              <View style={styles.tipTextCol}>
                <Text style={[styles.tipOverline, { color: colors.primary }]}>
                  {isRTL ? 'التشغيل التلقائي المستقل' : 'Autonomous Schedule'}
                </Text>
                <Text style={[styles.tipBody, { color: colors.textMuted }]}>
                  {isRTL
                    ? 'سيستمر الموزع في تنفيذ آخر جدول زمني محفوظ بشكل مستقل دون الحاجة لاتصال مستمر.'
                    : 'Your diffuser will continue its last active routine independently without requiring an active connection.'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STATE 2: Out of Range / Disconnected */}
        {activeTab === 'out_of_range' && (
          <View style={[styles.stateCard, { backgroundColor: colors.bgAlt }]}>
            <View style={[styles.largeIconCircle, { backgroundColor: isDark ? 'rgba(186,26,26,0.12)' : '#FDF2F2' }]}>
              <Icon name="portable_wifi_off" size={40} color={colors.error} />
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.error }]} />
              <Text style={[styles.badgeText, { color: colors.error }]}>
                {isRTL ? 'انقطع الاتصال بالجهاز' : 'Device Disconnected'}
              </Text>
            </View>

            <Text style={[styles.stateTitle, { color: colors.text }]}>
              {isRTL ? 'الجهاز خارج نطاق الاتصال' : 'Diffuser Out of Range'}
            </Text>

            <Text style={[styles.stateDescription, { color: colors.textMuted }]}>
              {isRTL
                ? 'تعذر الوصول إلى موزع أودورا في غرفة المعيشة. يرجى التأكد من تشغيل الجهاز والاقتراب منه.'
                : 'Unable to reach your Odora diffuser in Living Room. Ensure the device is powered on and within range.'}
            </Text>

            <View style={styles.actionCol}>
              <TouchableOpacity
                onPress={handleRetry}
                disabled={isReconnecting}
                style={[styles.primaryCtaBtn, { backgroundColor: colors.ink }]}
                activeOpacity={0.85}
              >
                <Icon name="refresh" size={18} color={colors.onInk} />
                <Text style={[styles.primaryCtaText, { color: colors.onInk }]}>
                  {isReconnecting
                    ? (isRTL ? 'جاري البحث...' : 'Searching...')
                    : (isRTL ? 'إعادة المحاولة' : 'Attempt Reconnect')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Troubleshooting Checklist */}
            <View style={[styles.checklistCard, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.checklistTitle, { color: colors.text }]}>
                {isRTL ? 'إرشادات استعادة الاتصال' : 'Connection Checklist'}
              </Text>
              <View style={styles.checkItem}>
                <Icon name="check_circle" size={16} color={colors.primary} />
                <Text style={[styles.checkText, { color: colors.textMuted }]}>
                  {isRTL ? 'تأكد من توصيل الموزع بمصدر الطاقة' : 'Ensure diffuser is plugged into power'}
                </Text>
              </View>
              <View style={styles.checkItem}>
                <Icon name="check_circle" size={16} color={colors.primary} />
                <Text style={[styles.checkText, { color: colors.textMuted }]}>
                  {isRTL ? 'اقترب من الجهاز لمسافة أقل من 10 أمتار' : 'Move closer within 10 meters'}
                </Text>
              </View>
              <View style={styles.checkItem}>
                <Icon name="check_circle" size={16} color={colors.primary} />
                <Text style={[styles.checkText, { color: colors.textMuted }]}>
                  {isRTL ? 'أعد تشغيل البلوتوث في هاتفك' : 'Toggle Bluetooth off and on in your phone'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STATE 3: Connecting / Syncing */}
        {activeTab === 'syncing' && (
          <View style={[styles.stateCard, { backgroundColor: colors.bgAlt }]}>
            <View style={[styles.largeIconCircle, { backgroundColor: colors.surfaceMuted }]}>
              <Icon name="sync" size={40} color={colors.primary} />
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {isRTL ? 'المزامنة جارية' : 'Syncing in Progress'}
              </Text>
            </View>

            <Text style={[styles.stateTitle, { color: colors.text }]}>
              {isRTL ? 'جاري الاتصال بالموزع...' : 'Connecting to Diffuser...'}
            </Text>

            <Text style={[styles.stateDescription, { color: colors.textMuted }]}>
              {isRTL
                ? 'جاري البحث عن الجهاز وإجراء المزامنة المباشرة عبر البلوتوث.'
                : 'Searching for your diffuser and establishing direct Bluetooth connection.'}
            </Text>

            {/* Progress Meter Bar */}
            <View style={[styles.progressTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '65%' }]} />
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                onPress={() => {
                  setActiveTab('disabled');
                  showToast(isRTL ? 'تم إلغاء الاتصال' : 'Connection cancelled');
                }}
                style={[styles.secondaryCtaBtn, { backgroundColor: colors.surfaceMuted }]}
                activeOpacity={0.85}
              >
                <Icon name="close" size={18} color={colors.text} />
                <Text style={[styles.secondaryCtaText, { color: colors.text }]}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  toastContainer: {
    position: 'absolute',
    top: 76,
    alignSelf: 'center',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: 20,
  },
  telemetryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginBottom: 10,
  },
  telemetryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: radii.full,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  tabBtnText: {
    fontSize: 12,
  },
  stateCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  largeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  stateDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 320,
  },
  actionCol: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  primaryCtaBtn: {
    width: '100%',
    height: 48,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryCtaBtn: {
    width: '100%',
    height: 48,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryCtaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipCard: {
    width: '100%',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipTextCol: {
    flex: 1,
  },
  tipOverline: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tipBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  checklistCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 12,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default ConnectionStatesScreen;
