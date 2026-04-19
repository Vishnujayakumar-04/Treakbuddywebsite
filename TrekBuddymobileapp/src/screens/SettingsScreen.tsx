import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  Switch,
} from 'react-native';
import { KeyIcon, CheckIcon, InfoIcon, ArrowBackIcon } from '../components/icons';
import { saveGeminiApiKey, getGeminiApiKey } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface SettingsScreenProps {
  navigation?: any;
  route?: any;
}

export default function SettingsScreen({ navigation, route }: SettingsScreenProps) {
  const { theme, isDark, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(route?.params?.section || null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const savedKey = await getGeminiApiKey();
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    setIsLoading(true);
    try {
      await saveGeminiApiKey(apiKey.trim());
      setIsSaved(true);
      Alert.alert('Success', 'API key saved successfully!');
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key. Please try again.');
      console.error('Error saving API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as any);
    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    Alert.alert('Language', `Language changed to ${selectedLang?.name || languageCode}`);
  };

  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={'#FFFFFF'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowBackIcon size={24} color="#000000" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Configure your preferences</Text>
          </View>
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🌓</Text>
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>{t('settings.theme')}</Text>
          </View>
          <View style={styles.themeContainer}>
            <View style={styles.themeOption}>
              <Text style={[styles.themeLabel, { color: '#000000' }]}>{t('settings.lightTheme')}</Text>
              <Switch
                value={!isDark}
                onValueChange={(value) => handleThemeToggle(!value)}
                trackColor={{ false: '#E2E8F0', true: '#0E7C86' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
            <View style={styles.themeOption}>
              <Text style={[styles.themeLabel, { color: '#000000' }]}>{t('settings.darkTheme')}</Text>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#E2E8F0', true: '#0E7C86' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Language Selection Section */}
        <View style={[styles.section, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🌐</Text>
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>{t('settings.language')}</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: '#666666' }]}>
            {t('settings.language.description')}
          </Text>
          <View style={styles.languageContainer}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  {
                    borderColor: language === lang.code ? '#0E7C86' : '#E2E8F0',
                    backgroundColor: language === lang.code ? '#0E7C86' + '10' : '#FFFFFF',
                  },
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    {
                      color: language === lang.code ? '#0E7C86' : '#000000',
                    },
                    language === lang.code && styles.languageOptionTextActive,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                <Text
                  style={[
                    styles.languageOptionSubtext,
                    {
                      color: language === lang.code ? '#0E7C86' : '#666666',
                    },
                  ]}
                >
                  {lang.name}
                </Text>
                {language === lang.code && (
                  <Text style={[styles.checkmark, { color: '#0E7C86' }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* API Key Section */}
        <View style={[styles.section, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}>
          <View style={styles.sectionHeader}>
            <KeyIcon size={24} color={'#0E7C86'} />
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>Gemini API Key</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: '#666666' }]}>
            Enter your Google Gemini API key to enable AI travel recommendations.
            Get your key from Google AI Studio.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#000000' }]}
              placeholder="Enter your Gemini API key"
              placeholderTextColor={'#666666'}
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.saveButton, isSaved && styles.saveButtonSuccess, shadows.md]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.saveButtonText}>{t('settings.saving')}</Text>
              ) : isSaved ? (
                <>
                  <CheckIcon size={18} color={'#FFFFFF'} />
                  <Text style={[styles.saveButtonText, { marginLeft: spacing.xs }]}>{t('settings.saved')}</Text>
                </>
              ) : (
                <Text style={styles.saveButtonText}>{t('settings.saveKey')}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <InfoIcon size={20} color="#2176FF" />
            <Text style={styles.infoText}>
              {t('settings.apiKey.info')}
            </Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={[styles.section, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}>
          <View style={styles.sectionHeader}>
            <InfoIcon size={24} color={'#0E7C86'} />
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>{t('settings.about')}</Text>
          </View>
          <Text style={[styles.aboutText, { color: '#666666' }]}>
            {t('settings.about.description')}
          </Text>
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: '#666666' }]}>{t('settings.version')}</Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: '#000000',
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: '#666666',
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: '#FFFFFF',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.labelLarge,
    marginLeft: spacing.sm,
  },
  sectionDescription: {
    ...typography.bodySmall,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  themeContainer: {
    marginTop: spacing.md,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  themeLabel: {
    ...typography.bodyMedium,
  },
  languageContainer: {
    marginTop: spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  languageOptionActive: {
    backgroundColor: '#0E7C86' + '10',
    borderColor: '#0E7C86',
  },
  languageOptionText: {
    ...typography.bodyLarge,
    color: '#000000',
    flex: 1,
  },
  languageOptionTextActive: {
    color: '#0E7C86',
    fontWeight: '600',
  },
  languageOptionSubtext: {
    ...typography.bodySmall,
    color: '#666666',
    marginRight: spacing.sm,
  },
  languageOptionSubtextActive: {
    color: '#0E7C86',
  },
  checkmark: {
    ...typography.h4,
    color: '#0E7C86',
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.bodyMedium,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: '#0E7C86',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveButtonSuccess: {
    backgroundColor: '#48BB78',
  },
  saveButtonText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#2176FF10',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  infoText: {
    ...typography.bodySmall,
    color: '#666666',
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  aboutText: {
    ...typography.bodyMedium,
    color: '#666666',
    lineHeight: 22,
  },
  versionContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  versionText: {
    ...typography.bodySmall,
    color: '#666666',
  },
});
