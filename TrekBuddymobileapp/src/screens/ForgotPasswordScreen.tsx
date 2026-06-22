import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { resetPassword } from '../utils/auth';
import { spacing, radius } from '../theme/spacing';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

interface ForgotPasswordScreenProps {
  navigation?: any;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch (error: any) {
      Alert.alert('Reset Failed', error.message || 'Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Header Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.headerSection}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
              <View style={[styles.blurButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Feather name="arrow-left" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.welcomeText} numberOfLines={1} adjustsFontSizeToFit>Reset Password</Text>
            <Text style={styles.subtitleText}>Enter your email account to receive a reset link</Text>
          </Animated.View>

          {/* Glassmorphism Form Card */}
          <Animated.View entering={FadeInUp.delay(300).duration(800).springify()} style={{ marginTop: 24 }}>
            <View style={[styles.glassCard, { backgroundColor: 'rgba(15, 23, 42, 0.7)' }]}>
              <View style={styles.glassInner}>

                {submitted ? (
                  <Animated.View entering={FadeInUp} style={styles.successContainer}>
                    <Feather name="check-circle" size={48} color="#22d3ee" style={{ marginBottom: 16 }} />
                    <Text style={styles.successTitle}>Check Your Mail</Text>
                    <Text style={styles.successText}>
                      We have sent a password recovery link to {email}. Follow the link to create a new password.
                    </Text>
                    
                    <TouchableOpacity
                      onPress={() => navigation?.navigate('Login')}
                      style={[styles.loginBtnWrapper, { marginTop: 20 }]}
                    >
                      <LinearGradient
                        colors={['#06b6d4', '#2563eb']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.loginBtnGradient}
                      >
                        <Text style={styles.loginBtnText}>Back to Login</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                ) : (
                  <>
                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                      <View style={styles.inputContainer}>
                        <Feather name="mail" size={18} color="#22d3ee" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your email"
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        onPress={handleReset}
                        disabled={loading}
                        activeOpacity={0.8}
                        style={styles.loginBtnWrapper}
                      >
                        <LinearGradient
                          colors={['#06b6d4', '#2563eb']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.loginBtnGradient}
                        >
                          <Text style={styles.loginBtnText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                      <Text style={styles.footerText}>Remember your password? </Text>
                      <TouchableOpacity onPress={() => navigation?.goBack()}>
                        <Text style={styles.signupText}>Sign In</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

              </View>
            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: STATUSBAR_HEIGHT + 8,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 0,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    lineHeight: 42,
    letterSpacing: -1,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    maxWidth: '90%',
  },
  glassCard: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  glassInner: {
    padding: spacing.xl,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.xl,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  actionButtons: {
    gap: 16,
    marginTop: 10,
  },
  loginBtnWrapper: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  loginBtnGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  signupText: {
    color: '#22d3ee',
    fontSize: 14,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  }
});
