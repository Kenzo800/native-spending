import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { clearAllData, exportData } from '../utils/storage';
import { useApp } from './context/AppContext';
import { useTheme } from './context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, colors, isDark } = useTheme();
  const { refreshData } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const data = await exportData();
      
      // For now, just show the data in an alert for demonstration
      Alert.alert(
        '匯出資料', 
        '資料已準備好匯出。在實際應用中，這會保存到文件或分享給其他應用。',
        [
          { text: '確定', onPress: () => console.log('Export data:', data.substring(0, 100) + '...') }
        ]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('錯誤', '匯出資料失敗');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      '清除所有資料',
      '此操作將刪除所有交易記錄、類別和設定，且無法復原。確定要繼續嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await refreshData();
              Alert.alert('成功', '所有資料已清除');
            } catch (error) {
              Alert.alert('錯誤', '清除資料失敗');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent || (
        onPress && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const ThemeButton = ({ mode, label }: { mode: typeof themeMode; label: string }) => (
    <TouchableOpacity
      style={[
        styles.themeButton,
        { borderColor: colors.border },
        themeMode === mode && {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        }
      ]}
      onPress={() => setThemeMode(mode)}
    >
      <Text style={[
        styles.themeButtonText,
        { color: themeMode === mode ? colors.surface : colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          設定
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Settings */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            外觀設定
          </Text>
          <View style={styles.themeSelector}>
            <ThemeButton mode="light" label="淺色" />
            <ThemeButton mode="dark" label="深色" />
            <ThemeButton mode="system" label="跟隨系統" />
          </View>
        </Card>

        {/* Navigation */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            功能
          </Text>
          
          <SettingItem
            icon="analytics-outline"
            title="統計分析"
            subtitle="查看您的財務統計數據"
            onPress={() => router.push('/statistics')}
          />
          
          <SettingItem
            icon="list-outline"
            title="交易記錄"
            subtitle="查看所有交易記錄"
            onPress={() => router.push('/transactions')}
          />
          
          <SettingItem
            icon="pricetag-outline"
            title="類別管理"
            subtitle="管理收入和支出類別"
            onPress={() => {
              // TODO: Implement category management screen
              Alert.alert('開發中', '類別管理功能即將推出');
            }}
          />
        </Card>

        {/* Data Management */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            資料管理
          </Text>
          
          <SettingItem
            icon="download-outline"
            title="匯出資料"
            subtitle="備份您的交易記錄"
            onPress={handleExportData}
            rightComponent={
              <Button
                title={isExporting ? "匯出中..." : "匯出"}
                onPress={handleExportData}
                size="small"
                variant="outline"
                loading={isExporting}
              />
            }
          />
          
          <SettingItem
            icon="cloud-upload-outline"
            title="匯入資料"
            subtitle="從備份文件還原資料"
            onPress={() => {
              // TODO: Implement data import
              Alert.alert('開發中', '資料匯入功能即將推出');
            }}
          />
          
          <SettingItem
            icon="trash-outline"
            title="清除所有資料"
            subtitle="刪除所有交易記錄和設定"
            onPress={handleClearData}
            rightComponent={
              <Button
                title="清除"
                onPress={handleClearData}
                size="small"
                variant="outline"
                textStyle={{ color: colors.error }}
                style={{ borderColor: colors.error }}
              />
            }
          />
        </Card>

        {/* Notifications */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            通知設定
          </Text>
          
          <SettingItem
            icon="notifications-outline"
            title="推送通知"
            subtitle="接收記帳提醒"
            rightComponent={
              <Switch
                value={false}
                onValueChange={() => {
                  // TODO: Implement notification settings
                  Alert.alert('開發中', '通知功能即將推出');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
          />
          
          <SettingItem
            icon="alarm-outline"
            title="每日提醒"
            subtitle="提醒您記錄每日支出"
            rightComponent={
              <Switch
                value={false}
                onValueChange={() => {
                  Alert.alert('開發中', '提醒功能即將推出');
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
          />
        </Card>

        {/* About */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            關於
          </Text>
          
          <SettingItem
            icon="information-circle-outline"
            title="版本資訊"
            subtitle="記帳應用 v1.0.0"
          />
          
          <SettingItem
            icon="help-circle-outline"
            title="使用說明"
            subtitle="了解如何使用此應用"
            onPress={() => {
              Alert.alert('開發中', '使用說明即將推出');
            }}
          />
          
          <SettingItem
            icon="star-outline"
            title="評價應用"
            subtitle="在應用商店給我們評分"
            onPress={() => {
              Alert.alert('謝謝', '感謝您的支持！');
            }}
          />
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});