import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { toArabicNumerals } from '../i18n';
import { AppBar, Card, Icon, Toggle, Button, SegmentedControl, Slider } from '../components/ui';
import { useAppStore, AppRoutine } from '../store/useAppStore';
import { previewConfig } from '../previewTarget';

interface ScheduleScreenProps {
  navigation: any;
  route?: any;
}

// Item 11: Routine icons by start time (sunrise / sun / moon) matching Stitch
const getRoutineIcon = (startTime: string): string => {
  const hour = parseInt(startTime.split(':')[0], 10);
  if (isNaN(hour)) return 'wb_twilight';
  if (hour >= 5 && hour < 12) return 'wb_twilight';
  if (hour >= 12 && hour < 18) return 'light_mode';
  return 'bedtime';
};

// Item 9: Seed routines & calendar: Libyan work week is Sun–Thu
const formatRoutineDays = (days: string[], isRTL: boolean): string => {
  if (days.length === 7) return isRTL ? 'يومياً' : 'Daily';
  const isWorkWeek =
    days.length === 5 && ['Su', 'M', 'Tu', 'W', 'Th'].every((d) => days.includes(d));
  if (isWorkWeek) return isRTL ? 'الأحد – الخميس' : 'Sun–Thu';
  const isWeekend = days.length === 2 && ['F', 'Sa'].every((d) => days.includes(d));
  if (isWeekend) return isRTL ? 'الجمعة والسبت' : 'Fri–Sat';

  const dayLabelsAr: Record<string, string> = {
    Su: 'الأحد',
    M: 'الإثنين',
    Tu: 'الثلاثاء',
    W: 'الأربعاء',
    Th: 'الخميس',
    F: 'الجمعة',
    Sa: 'السبت',
  };
  const dayLabelsEn: Record<string, string> = {
    Su: 'Sun',
    M: 'Mon',
    Tu: 'Tue',
    W: 'Wed',
    Th: 'Thu',
    F: 'Fri',
    Sa: 'Sat',
  };
  return days.map((d) => (isRTL ? dayLabelsAr[d] : dayLabelsEn[d]) || d).join(isRTL ? '، ' : ', ');
};

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { colors, typography, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (previewConfig.scrollToEnd) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  }, []);

  const { routines, addRoutine, toggleRoutine, devices, selectedDeviceId } = useAppStore();

  // Item 8: Schedule belongs to a device: check route param or selectedDeviceId
  const routeDeviceId = route?.params?.deviceId;
  const currentDeviceId = routeDeviceId || selectedDeviceId || 'living';
  const activeDevice = devices.find((d) => d.id === currentDeviceId) || devices[0];

  const deviceRoutines = routines.filter(
    (r) => r.deviceId === activeDevice.id || (!r.deviceId && activeDevice.id === 'living')
  );

  const [newRoutineVisible, setNewRoutineVisible] = useState(Boolean(previewConfig?.sheet));

  useEffect(() => {
    if (previewConfig?.sheet !== undefined) {
      setNewRoutineVisible(Boolean(previewConfig.sheet));
    }
  }, [previewConfig?.sheet, previewConfig?.timestamp]);

  const [routineName, setRoutineName] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end'>('start');
  const [allowOvernight, setAllowOvernight] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Su', 'M', 'Tu', 'W', 'Th']);
  const [newIntensity, setNewIntensity] = useState(5);
  const [newMode, setNewMode] = useState<'continuous' | 'interval'>('interval');

  // Libyan week: Sun, Mon, Tue, Wed, Thu, Fri (weekend), Sat (weekend)
  const days = [
    { key: 'Su', label: isRTL ? 'ح' : 'Su', isWeekend: false, fullName: isRTL ? 'الأحد' : 'Sun' },
    { key: 'M', label: isRTL ? 'إ' : 'M', isWeekend: false, fullName: isRTL ? 'الإثنين' : 'Mon' },
    { key: 'Tu', label: isRTL ? 'ث' : 'Tu', isWeekend: false, fullName: isRTL ? 'الثلاثاء' : 'Tue' },
    { key: 'W', label: isRTL ? 'ر' : 'W', isWeekend: false, fullName: isRTL ? 'الأربعاء' : 'Wed' },
    { key: 'Th', label: isRTL ? 'خ' : 'Th', isWeekend: false, fullName: isRTL ? 'الخميس' : 'Thu' },
    { key: 'F', label: isRTL ? 'ج' : 'F', isWeekend: true, fullName: isRTL ? 'الجمعة' : 'Fri' },
    { key: 'Sa', label: isRTL ? 'س' : 'Sa', isWeekend: true, fullName: isRTL ? 'السبت' : 'Sat' },
  ];

  const toggleDay = (key: string) => {
    if (selectedDays.includes(key)) {
      setSelectedDays(selectedDays.filter((d) => d !== key));
    } else {
      setSelectedDays([...selectedDays, key]);
    }
  };

  // Item 2: Real 24h Time Picker logic
  const [startHour, startMinute] = startTime.split(':').map((v) => parseInt(v, 10) || 0);
  const [endHour, endMinute] = endTime.split(':').map((v) => parseInt(v, 10) || 0);
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const isOvernight = endTotalMinutes <= startTotalMinutes;

  const handleHourStep = (delta: number) => {
    if (activeTimeField === 'start') {
      const nextHour = (startHour + delta + 24) % 24;
      const formatted = `${String(nextHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
      setStartTime(formatted);
      if (!allowOvernight && endTotalMinutes <= nextHour * 60 + startMinute) {
        const nextEndHour = (nextHour + 2) % 24;
        setEndTime(`${String(nextEndHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`);
      }
    } else {
      const nextHour = (endHour + delta + 24) % 24;
      const formatted = `${String(nextHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
      setEndTime(formatted);
      if (nextHour * 60 + endMinute <= startTotalMinutes) {
        setAllowOvernight(true);
      }
    }
  };

  const handleMinuteSelect = (min: number) => {
    if (activeTimeField === 'start') {
      setStartTime(`${String(startHour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    } else {
      setEndTime(`${String(endHour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    }
  };

  const handleSaveRoutine = () => {
    const routine: AppRoutine = {
      id: 'routine_' + Date.now(),
      deviceId: activeDevice.id,
      name: routineName.trim() || t('scheduleScreen.customRoutine', 'روتين مخصص'),
      days: selectedDays.length > 0 ? selectedDays : ['Su', 'M', 'Tu', 'W', 'Th'],
      startTime: startTime.trim() || '08:00',
      endTime: endTime.trim() || '17:00',
      intensity: newIntensity,
      mode: newMode,
      enabled: true,
      isBurst: false,
      oilName: activeDevice?.oilName || (isRTL ? 'مريمية الغابة' : 'Forest Sage'),
    };
    addRoutine(routine);
    setRoutineName('');
    setStartTime('08:00');
    setEndTime('17:00');
    setNewRoutineVisible(false);
  };

  const enabledRoutines = deviceRoutines.filter((r) => r.enabled);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. App Bar (Back + Title + more_horiz) */}
      <AppBar
        showBack
        title={t('scheduleScreen.title', 'جدولة الروتين')}
        actions={[
          {
            icon: 'more_horiz',
            onPress: () => navigation.navigate('DeviceSettings'),
            label: 'More',
          },
        ]}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Sub-header Device Picker */}
        <View style={styles.subHeaderSection}>
          <TouchableOpacity activeOpacity={0.8} style={[styles.devicePickerPill, { backgroundColor: colors.surfaceMuted }]}>
            <View style={[styles.statusDotLive, { backgroundColor: colors.primary }]} />
            <Text style={[typography.labelMd, { color: colors.text, marginStart: 6, fontWeight: '600', fontSize: 12, letterSpacing: 0 }]}>
              {activeDevice?.name || t('home.livingRoomDiffuser', 'موزع غرفة المعيشة')}
            </Text>
            <Icon name="expand_more" size={16} color={colors.textMuted} style={{ marginStart: 4 }} />
          </TouchableOpacity>
          <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 8, letterSpacing: 0 }]}>
            {t('scheduleScreen.subtitle', 'أتمتة الأجواء على مدار اليوم بروتين انتشار الهواء البارد المخصص.')}
          </Text>
        </View>

        {/* 3. Weekly Rhythm Card (Item 19: Built from actual routines; Libyan weekend = Fri & Sat) */}
        <Card surface="low" style={styles.rhythmCard}>
          <View style={styles.rhythmHeader}>
            <View style={styles.rhythmHeaderLeft}>
              <Icon name="calendar_today" size={16} color={colors.primary} />
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: colors.textMuted,
                    fontWeight: '700',
                    textTransform: isRTL ? 'none' : 'uppercase',
                    letterSpacing: isRTL ? 0 : 0.8,
                    marginStart: 6,
                  },
                ]}
              >
                {t('scheduleScreen.weeklyRhythm', 'الإيقاع الأسبوعي')}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '600', letterSpacing: 0 }]}>
              {t('scheduleScreen.routinesCount', { count: enabledRoutines.length })}
            </Text>
          </View>

          {/* 7-Day Timeline Pillars built from active routines */}
          <View style={styles.daysGrid}>
            {days.map((day) => {
              // Active routines matching this day
              const dayRoutines = enabledRoutines.filter((r) =>
                r.days.includes(day.key) ||
                (day.key === 'Su' && r.days.includes('S2')) ||
                (day.key === 'M' && r.days.includes('M')) ||
                (day.key === 'Tu' && r.days.includes('T')) ||
                (day.key === 'W' && r.days.includes('W')) ||
                (day.key === 'Th' && r.days.includes('T2')) ||
                (day.key === 'F' && r.days.includes('F')) ||
                (day.key === 'Sa' && r.days.includes('S'))
              );

              return (
                <View key={day.key} style={styles.dayCol}>
                  <Text
                    style={[
                      typography.labelSm,
                      {
                        color: day.isWeekend ? colors.primary : colors.textMuted,
                        fontWeight: day.isWeekend ? '700' : '500',
                        marginBottom: 6,
                        letterSpacing: 0,
                      },
                    ]}
                  >
                    {day.label}
                  </Text>
                  <View style={[styles.dayPillarTrack, { backgroundColor: colors.surfaceMuted }]}>
                    {/* Render active routine blocks dynamically */}
                    {dayRoutines.length > 0 ? (
                      dayRoutines.map((r, rIdx) => {
                        const blockColor =
                          rIdx === 0 ? colors.accent : rIdx === 1 ? colors.primarySoft : colors.primary;
                        const blockHeight = Math.max(8, Math.min(20, Math.round(r.intensity * 2)));
                        return (
                          <View
                            key={r.id}
                            style={[
                              styles.dayBlock,
                              {
                                height: blockHeight,
                                backgroundColor: blockColor,
                                marginTop: rIdx > 0 ? 2 : 0,
                              },
                            ]}
                          />
                        );
                      })
                    ) : (
                      <View style={[styles.dayBlock, { height: 4, backgroundColor: colors.border }]} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Legend (Item 16: No sanctuary wording) */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
              <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4, letterSpacing: 0 }]}>
                {t('scheduleScreen.morning', 'صباح')}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primarySoft }]} />
              <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4, letterSpacing: 0 }]}>
                {t('scheduleScreen.midday', 'ظهيرة')}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4, letterSpacing: 0 }]}>
                {t('scheduleScreen.evening', 'مساء')}
              </Text>
            </View>
          </View>
        </Card>

        {/* 4. Active Schedules Section */}
        <View style={styles.schedulesSection}>
          <View style={styles.schedulesHeaderRow}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 18, fontWeight: '500', letterSpacing: 0 }]}>
              {t('scheduleScreen.activeRoutines', 'الجداول النشطة')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setNewRoutineVisible(true)}
              style={styles.newRoutineBtn}
            >
              <Icon name="add" size={16} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600', marginStart: 4, letterSpacing: 0 }]}>
                {t('scheduleScreen.newRoutine', 'روتين جديد')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Render Dynamic Routines (Item 8: filtered by deviceId; Item 11: icons by start time; Item 9: Sun-Thu) */}
          {deviceRoutines.map((routine) => {
            const isBurst = routine.isBurst;
            return (
              <Card key={routine.id} surface="lowest" style={styles.routineCard}>
                <View style={styles.routineTopRow}>
                  <View style={styles.routineTopLeft}>
                    <View style={[styles.routineIconWrap, { backgroundColor: colors.bgAlt }]}>
                      <Icon name={getRoutineIcon(routine.startTime)} size={20} color={colors.primary} />
                    </View>
                    <View style={{ marginStart: 12, flex: 1 }}>
                      <View style={styles.routineTitleRow}>
                        <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '500', letterSpacing: 0 }]}>
                          {routine.name}
                        </Text>
                        {/* Item 17: Hide Boost chip when burst is off */}
                        {isBurst && (
                          <View style={[styles.routineBoostBadge, { backgroundColor: colors.accent }]}>
                            <Text style={[typography.labelSm, { color: colors.text, fontSize: 9, fontWeight: '700', letterSpacing: 0 }]}>
                              {t('scheduleScreen.boostChip', 'تعزيز')}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
                        {`${routine.startTime} – ${routine.endTime} · ${formatRoutineDays(routine.days, isRTL)}`}
                      </Text>
                    </View>
                  </View>
                  <Toggle
                    value={routine.enabled}
                    onValueChange={() => toggleRoutine(routine.id)}
                  />
                </View>

                <View style={[styles.routineMetaPill, { backgroundColor: colors.bgAlt }]}>
                  <View style={styles.routineMetaItem}>
                    <Icon name="spa" size={15} color={colors.primary} />
                    <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12, letterSpacing: 0 }]}>
                      {routine.oilName}
                    </Text>
                  </View>
                  <View style={styles.routineMetaItem}>
                    <Icon name="air" size={15} color={colors.primary} />
                    <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12, letterSpacing: 0 }]}>
                      {t('device.level', { level: routine.intensity })}
                    </Text>
                  </View>
                  <View style={styles.routineMetaItem}>
                    <Icon name="airwave" size={15} color={colors.primary} />
                    <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12, letterSpacing: 0 }]}>
                      {routine.mode === 'continuous' ? t('home.continuous') : t('home.interval')}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* 5. New Routine Bottom Sheet Modal (Item 2: Real 24h interactive time picker + Save adds to list) */}
      <Modal
        visible={newRoutineVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNewRoutineVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheetContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.surfaceMuted }]}>
              <View style={[styles.sheetHandle, { backgroundColor: colors.surfaceMuted }]} />
            </View>

            <View style={styles.sheetHeader}>
              <Text style={[typography.headlineSm, { color: colors.text, fontSize: 19, fontWeight: '500', letterSpacing: 0 }]}>
                {t('scheduleScreen.newRoutine', 'إنشاء روتين جديد')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setNewRoutineVisible(false)}
                style={[styles.closeBtn, { backgroundColor: colors.surfaceMuted }]}
              >
                <Icon name="close" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Routine Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 6, letterSpacing: 0 }]}>
                {t('scheduleScreen.routineName', 'اسم الروتين')}
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.bgAlt,
                    color: colors.text,
                  },
                ]}
                placeholder={t('scheduleScreen.routineNamePlaceholder', 'مثال: وضوح الصباح')}
                placeholderTextColor={colors.textSubtle}
                value={routineName}
                onChangeText={setRoutineName}
              />
            </View>

            {/* Weekday Selector */}
            <View style={styles.inputGroup}>
              <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 8, letterSpacing: 0 }]}>
                {t('scheduleScreen.activeDays', 'الأيام النشطة')}
              </Text>
              <View style={styles.daysSelectRow}>
                {days.map((d) => {
                  const active = selectedDays.includes(d.key);
                  return (
                    <TouchableOpacity
                      key={d.key}
                      activeOpacity={0.8}
                      onPress={() => toggleDay(d.key)}
                      style={[
                        styles.dayCircle,
                        {
                          backgroundColor: active ? colors.primary : colors.surfaceMuted,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.labelMd,
                          {
                            color: active ? colors.onPrimary : colors.text,
                            fontWeight: active ? '700' : '500',
                            letterSpacing: 0,
                          },
                        ]}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Item 2: Real 24h Time Picker (Start & End Time cards + 24h Stepper/Pills) */}
            <View style={styles.inputGroup}>
              <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 6, letterSpacing: 0 }]}>
                {t('scheduleScreen.timeSelector', 'تحديد الوقت (24 ساعة)')}
              </Text>

              {/* Two selectable time cards side by side */}
              <View style={styles.timeCardsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setActiveTimeField('start')}
                  style={[
                    styles.timeCard,
                    {
                      backgroundColor: colors.bgAlt,
                      borderColor: activeTimeField === 'start' ? colors.primary : colors.border,
                      borderWidth: activeTimeField === 'start' ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={[typography.labelSm, { color: activeTimeField === 'start' ? colors.primary : colors.textMuted, fontWeight: '600' }]}>
                    {t('scheduleScreen.startTime', 'وقت البدء')}
                  </Text>
                  <Text style={[typography.headlineSm, { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 4 }]}>
                    {startTime}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setActiveTimeField('end')}
                  style={[
                    styles.timeCard,
                    {
                      backgroundColor: colors.bgAlt,
                      borderColor: activeTimeField === 'end' ? colors.primary : colors.border,
                      borderWidth: activeTimeField === 'end' ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={[typography.labelSm, { color: activeTimeField === 'end' ? colors.primary : colors.textMuted, fontWeight: '600' }]}>
                    {t('scheduleScreen.endTime', 'وقت الانتهاء')}
                  </Text>
                  <Text style={[typography.headlineSm, { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 4 }]}>
                    {endTime}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Hour adjustments & minute presets */}
              <View style={[styles.timePickerControls, { backgroundColor: colors.bgAlt }]}>
                <View style={styles.stepperRow}>
                  <Text style={[typography.labelSm, { color: colors.textMuted }]}>
                    {activeTimeField === 'start' ? t('scheduleScreen.startTime') : t('scheduleScreen.endTime')} ({t('scheduleScreen.hour', 'الساعة')}):
                  </Text>
                  <View style={styles.stepperBtns}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleHourStep(-1)}
                      style={[styles.stepBtn, { backgroundColor: colors.surfaceMuted }]}
                    >
                      <Icon name="remove" size={16} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[typography.headlineSm, { color: colors.primary, fontWeight: '700', marginHorizontal: 12, minWidth: 28, textAlign: 'center' }]}>
                      {String(activeTimeField === 'start' ? startHour : endHour).padStart(2, '0')}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleHourStep(1)}
                      style={[styles.stepBtn, { backgroundColor: colors.surfaceMuted }]}
                    >
                      <Icon name="add" size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Minute Presets */}
                <View style={styles.minutePresetsRow}>
                  <Text style={[typography.labelSm, { color: colors.textMuted }]}>
                    {t('scheduleScreen.minute', 'الدقيقة')}:
                  </Text>
                  <View style={styles.minutePills}>
                    {[0, 15, 30, 45].map((min) => {
                      const curMin = activeTimeField === 'start' ? startMinute : endMinute;
                      const active = curMin === min;
                      return (
                        <TouchableOpacity
                          key={min}
                          activeOpacity={0.8}
                          onPress={() => handleMinuteSelect(min)}
                          style={[
                            styles.minPill,
                            {
                              backgroundColor: active ? colors.primary : colors.surfaceMuted,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              typography.labelSm,
                              {
                                color: active ? colors.onPrimary : colors.text,
                                fontWeight: active ? '700' : '500',
                              },
                            ]}
                          >
                            :{String(min).padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Overnight Indicator / Toggle (Item 2: End after start or allow overnight explicitly) */}
                {isOvernight && (
                  <View style={[styles.overnightBadge, { backgroundColor: colors.accent }]}>
                    <Icon name="bedtime" size={15} color={colors.primary} />
                    <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', marginStart: 6 }]}>
                      {t('scheduleScreen.overnight', 'يمتد حتى اليوم التالي (+1)')}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Intensity & Mode */}
            <View style={styles.inputGroup}>
              <View style={styles.intensityHeader}>
                <Text style={[typography.labelMd, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {t('scheduleScreen.intensity', 'الكثافة')}
                </Text>
                <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '700', letterSpacing: 0 }]}>
                  {t('device.level', { level: newIntensity })}
                </Text>
              </View>
              <Slider
                value={newIntensity / 10}
                onChange={(val) => setNewIntensity(Math.max(1, Math.round(val * 10)))}
              />
            </View>

            {/* Mode Segmented */}
            <View style={styles.inputGroup}>
              <SegmentedControl<'continuous' | 'interval'>
                options={[
                  { label: t('home.continuous', 'مستمر'), value: 'continuous' },
                  { label: t('home.interval', 'فترات'), value: 'interval' },
                ]}
                selected={newMode}
                onChange={(val) => setNewMode(val)}
              />
            </View>

            {/* Save Button (Item 1: Save routine adds to list) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSaveRoutine}
              style={[styles.saveBtn, { backgroundColor: colors.ink }]}
            >
              <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '600', fontSize: 15, letterSpacing: 0 }]}>
                {t('scheduleScreen.saveRoutine', 'حفظ الروتين')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  subHeaderSection: {
    marginBottom: 16,
  },
  devicePickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  statusDotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  rhythmCard: {
    padding: 16,
    marginBottom: 24,
  },
  rhythmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rhythmHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayPillarTrack: {
    width: 32,
    height: 56,
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: 2,
    overflow: 'hidden',
  },
  dayBlock: {
    width: '100%',
    borderRadius: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  schedulesSection: {
    marginBottom: 20,
  },
  schedulesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  newRoutineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  routineCard: {
    padding: 16,
    marginBottom: 12,
  },
  routineTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginEnd: 12,
  },
  routineIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routineBoostBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  routineMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  routineMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  textInput: {
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  timeCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  timeCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePickerControls: {
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minutePresetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  minutePills: {
    flexDirection: 'row',
    gap: 6,
  },
  minPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  overnightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  daysSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  saveBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default ScheduleScreen;
