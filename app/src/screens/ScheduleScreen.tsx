import React, { useState } from 'react';
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

interface ScheduleScreenProps {
  navigation: any;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();
  const insets = useSafeAreaInsets();

  const [routine1On, setRoutine1On] = useState(true);
  const [routine2On, setRoutine2On] = useState(true);
  const [routine3On, setRoutine3On] = useState(true);

  const [newRoutineVisible, setNewRoutineVisible] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['M', 'T', 'W', 'T2', 'F']);
  const [newIntensity, setNewIntensity] = useState(5);
  const [newMode, setNewMode] = useState<'continuous' | 'interval'>('interval');

  const days = [
    { key: 'M', label: isRTL ? 'إ' : 'M' },
    { key: 'T', label: isRTL ? 'ث' : 'T' },
    { key: 'W', label: isRTL ? 'ر' : 'W' },
    { key: 'T2', label: isRTL ? 'خ' : 'T' },
    { key: 'F', label: isRTL ? 'ج' : 'F' },
    { key: 'S', label: isRTL ? 'س' : 'S' },
    { key: 'S2', label: isRTL ? 'ح' : 'S' },
  ];

  const toggleDay = (key: string) => {
    if (selectedDays.includes(key)) {
      setSelectedDays(selectedDays.filter((d) => d !== key));
    } else {
      setSelectedDays([...selectedDays, key]);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. App Bar (Back + Title + more_horiz) */}
      <AppBar
        showBack
        title={isRTL ? 'جدولة الروتين' : 'Schedule Routine'}
        actions={[
          {
            icon: 'more_horiz',
            onPress: () => navigation.navigate('DeviceSettings'),
            label: 'More',
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Sub-header Device Picker */}
        <View style={styles.subHeaderSection}>
          <TouchableOpacity activeOpacity={0.8} style={[styles.devicePickerPill, { backgroundColor: colors.surfaceMuted }]}>
            <View style={[styles.statusDotLive, { backgroundColor: colors.primary }]} />
            <Text style={[typography.labelMd, { color: colors.text, marginStart: 6, fontWeight: '600', fontSize: 12 }]}>
              {isRTL ? 'موزع غرفة المعيشة (أخضر)' : 'Living Room Diffuser (Sage)'}
            </Text>
            <Icon name="expand_more" size={16} color={colors.textMuted} style={{ marginStart: 4 }} />
          </TouchableOpacity>
          <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 8 }]}>
            {isRTL
              ? 'أتمتة الأجواء على مدار اليوم بروتين انتشار الهواء البارد المخصص.'
              : 'Automate your atmosphere throughout the day with cold-air misting routines.'}
          </Text>
        </View>

        {/* 3. Weekly Rhythm Card */}
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
                {isRTL ? 'الإيقاع الأسبوعي' : 'WEEKLY RHYTHM'}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '600' }]}>
              {isRTL ? '3 روائح مجدولة' : '3 Rituals Active'}
            </Text>
          </View>

          {/* 7-Day Timeline Pillars */}
          <View style={styles.daysGrid}>
            {days.map((day, idx) => {
              const isWeekday = idx < 5;
              return (
                <View key={day.key} style={styles.dayCol}>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginBottom: 6 }]}>
                    {day.label}
                  </Text>
                  <View style={[styles.dayPillarTrack, { backgroundColor: colors.surfaceMuted }]}>
                    {/* Stacked color blocks */}
                    <View style={[styles.dayBlock, { height: 12, backgroundColor: colors.accent }]} />
                    {isWeekday && (
                      <View style={[styles.dayBlock, { height: 16, backgroundColor: colors.primarySoft, marginTop: 2 }]} />
                    )}
                    {isWeekday && (
                      <View style={[styles.dayBlock, { height: 16, backgroundColor: colors.primary, marginTop: 2 }]} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4 }]}>
                {isRTL ? 'وضوح (صباح)' : 'clarity'}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primarySoft }]} />
              <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4 }]}>
                {isRTL ? 'تركيز (ظهيرة)' : 'focus'}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
              <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4 }]}>
                {isRTL ? 'ملاذ (مساء)' : 'sanctuary'}
              </Text>
            </View>
          </View>
        </Card>

        {/* 4. Active Schedules Section */}
        <View style={styles.schedulesSection}>
          <View style={styles.schedulesHeaderRow}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 18, fontWeight: '500' }]}>
              {isRTL ? 'الجداول النشطة' : 'Active Schedules'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setNewRoutineVisible(true)}
              style={styles.newRoutineBtn}
            >
              <Icon name="add" size={16} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600', marginStart: 4 }]}>
                {isRTL ? 'روتين جديد' : 'New Routine'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Routine Card 1: Morning Clarity */}
          <Card surface="lowest" style={styles.routineCard}>
            <View style={styles.routineTopRow}>
              <View style={styles.routineTopLeft}>
                <View style={[styles.routineIconWrap, { backgroundColor: colors.accent }]}>
                  <Icon name="wb_twilight" size={20} color={colors.text} />
                </View>
                <View style={{ marginStart: 12, flex: 1 }}>
                  <View style={styles.routineTitleRow}>
                    <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '500' }]}>
                      {isRTL ? 'وضوح الصباح' : 'Morning Clarity'}
                    </Text>
                    <View style={[styles.routineBoostBadge, { backgroundColor: colors.accent }]}>
                      <Text style={[typography.labelSm, { color: colors.text, fontSize: 9, fontWeight: '700' }]}>
                        {isRTL ? 'تعزيز' : 'BOOST'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                    {isRTL ? '07:00 – 09:30 · كل أيام الأسبوع' : '7:00 AM – 9:30 AM · Every Weekday'}
                  </Text>
                </View>
              </View>
              <Toggle value={routine1On} onValueChange={setRoutine1On} />
            </View>

            <View style={[styles.routineMetaPill, { backgroundColor: colors.bgAlt }]}>
              <View style={styles.routineMetaItem}>
                <Icon name="spa" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? 'مريمية الغابة' : 'Forest Sage'}
                </Text>
              </View>
              <View style={styles.routineMetaItem}>
                <Icon name="air" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? `المستوى ${toArabicNumerals(7)}` : 'Level 7'}
                </Text>
              </View>
              <View style={styles.routineMetaItem}>
                <Icon name="schedule" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? 'يومي متناغم' : 'Circadian'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Routine Card 2: Afternoon Focus */}
          <Card surface="lowest" style={styles.routineCard}>
            <View style={styles.routineTopRow}>
              <View style={styles.routineTopLeft}>
                <View style={[styles.routineIconWrap, { backgroundColor: colors.surfaceMuted }]}>
                  <Icon name="light_mode" size={20} color={colors.primary} />
                </View>
                <View style={{ marginStart: 12, flex: 1 }}>
                  <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '500' }]}>
                    {isRTL ? 'تركيز الظهيرة' : 'Afternoon Focus'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                    {isRTL ? '13:00 – 16:30 · الإثنين، الأربعاء، الجمعة' : '1:00 PM – 4:30 PM · Mon, Wed, Fri'}
                  </Text>
                </View>
              </View>
              <Toggle value={routine2On} onValueChange={setRoutine2On} />
            </View>

            <View style={[styles.routineMetaPill, { backgroundColor: colors.bgAlt }]}>
              <View style={styles.routineMetaItem}>
                <Icon name="spa" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? 'كتان قطني' : 'Cotton Linen'}
                </Text>
              </View>
              <View style={styles.routineMetaItem}>
                <Icon name="air" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? `المستوى ${toArabicNumerals(4)}` : 'Level 4'}
                </Text>
              </View>
              <View style={styles.routineMetaItem}>
                <Icon name="airwave" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? 'فترات' : 'Interval'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Routine Card 3: Evening Sanctuary */}
          <Card surface="lowest" style={styles.routineCard}>
            <View style={styles.routineTopRow}>
              <View style={styles.routineTopLeft}>
                <View style={[styles.routineIconWrap, { backgroundColor: colors.accent }]}>
                  <Icon name="bedtime" size={20} color={colors.text} />
                </View>
                <View style={{ marginStart: 12, flex: 1 }}>
                  <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '500' }]}>
                    {isRTL ? 'ملاذ المساء' : 'Evening Sanctuary'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                    {isRTL ? '19:00 – 22:30 · يومياً' : '7:00 PM – 10:30 PM · Daily'}
                  </Text>
                </View>
              </View>
              <Toggle value={routine3On} onValueChange={setRoutine3On} />
            </View>

            <View style={[styles.routineMetaPill, { backgroundColor: colors.bgAlt }]}>
              <View style={styles.routineMetaItem}>
                <Icon name="spa" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? 'صندل أبيض' : 'White Santal'}
                </Text>
              </View>
              <View style={styles.routineMetaItem}>
                <Icon name="air" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? `المستوى ${toArabicNumerals(3)}` : 'Level 3'}
                </Text>
              </View>
              <View style={styles.routineMetaItem}>
                <Icon name="waves" size={15} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontSize: 12 }]}>
                  {isRTL ? 'مستمر' : 'Continuous'}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* 5. New Routine Bottom Sheet Modal */}
      <Modal
        visible={newRoutineVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNewRoutineVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheetContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.surfaceMuted }]} />

            <View style={styles.sheetHeader}>
              <Text style={[typography.headlineSm, { color: colors.text, fontSize: 19, fontWeight: '500' }]}>
                {isRTL ? 'إنشاء روتين جديد' : 'Create New Routine'}
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
              <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 6 }]}>
                {isRTL ? 'اسم الروتين' : 'Routine Name'}
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.bgAlt,
                    color: colors.text,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                placeholder={isRTL ? 'مثال: تركيز الصباح' : 'e.g. Morning Focus'}
                placeholderTextColor={colors.textSubtle}
                value={routineName}
                onChangeText={setRoutineName}
              />
            </View>

            {/* Weekday Selector */}
            <View style={styles.inputGroup}>
              <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 8 }]}>
                {isRTL ? 'الأيام النشطة' : 'Active Days'}
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

            {/* Intensity & Mode */}
            <View style={styles.inputGroup}>
              <View style={styles.intensityHeader}>
                <Text style={[typography.labelMd, { color: colors.textMuted }]}>
                  {isRTL ? 'الكثافة' : 'Mist Intensity'}
                </Text>
                <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '700' }]}>
                  {isRTL ? `المستوى ${toArabicNumerals(newIntensity)}` : `Level ${newIntensity}`}
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
                  { label: isRTL ? 'مستمر' : 'Continuous', value: 'continuous' },
                  { label: isRTL ? 'فترات' : 'Interval', value: 'interval' },
                ]}
                selected={newMode}
                onChange={(val) => setNewMode(val)}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => setNewRoutineVisible(false)}
              style={[styles.saveBtn, { backgroundColor: colors.ink }]}
            >
              <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '600', fontSize: 15 }]}>
                {isRTL ? 'حفظ الروتين' : 'Save Routine'}
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
