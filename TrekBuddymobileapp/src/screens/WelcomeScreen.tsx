import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Reanimated from 'react-native-reanimated';
import { spacing, radius } from '../theme/spacing';

const { width, height } = Dimensions.get('window');

// Local static assets for the background marquee
const BACKGROUND_IMAGES = [
  require('../../assets/Famousplacesimg/arulmigu-manakula-vinayar-puducherry-1-attr-hero.jpg'),
  require('../../assets/assets/beaches/promenade beach.jpg'),
  require('../../assets/Famousplacesimg/download.jpg'),
  require('../../assets/assets/beaches/paradise beach.jpeg'),
  require('../../assets/Famousplacesimg/image_2022-07-26_124514583.jpg'),
];

// Each image in the background will be full width
const IMAGE_WIDTH = width;
const TOTAL_WIDTH = IMAGE_WIDTH * BACKGROUND_IMAGES.length;

interface WelcomeScreenProps {
  navigation?: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slow, continuous pan across the background images
    const loopAnim = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -TOTAL_WIDTH,
        duration: BACKGROUND_IMAGES.length * 6000, // 6 seconds per image
        useNativeDriver: true,
      })
    );
    loopAnim.start();
    return () => loopAnim.stop();
  }, [scrollX]);

  const handleGetStarted = () => {
    navigation?.navigate('Login');
  };

  // Duplicate the array to create a seamless infinite loop effect
  const doubledImages = [...BACKGROUND_IMAGES, ...BACKGROUND_IMAGES];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Full Screen Scrolling Background */}
      <View style={styles.backgroundContainer}>
        <Animated.View
          style={[
            styles.scrollableBackground,
            { transform: [{ translateX: scrollX }] }
          ]}
        >
          {doubledImages.map((img, index) => (
            <Image
              key={index}
              source={img}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          ))}
        </Animated.View>
      </View>

      {/* Gradient Overlay for Readability */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.1)', 'rgba(15, 23, 42, 0.7)', '#0f172a']}
        style={styles.gradientOverlay}
        locations={[0, 0.5, 1]}
      >
        <View style={styles.contentContainer}>
          {/* Top Text Content */}
          <View style={styles.textSection}>
            <Reanimated.Text
              entering={FadeInUp.delay(200).duration(800)}
              style={styles.subtitle}
            >
              Welcome to
            </Reanimated.Text>

            <Reanimated.Text
              entering={FadeInUp.delay(400).duration(800)}
              style={styles.title}
            >
              TrekBuddy
            </Reanimated.Text>

            <Reanimated.Text
              entering={FadeInUp.delay(600).duration(800)}
              style={styles.description}
            >
              Discover the hidden gems, heritage, and spirited culture of Puducherry.
            </Reanimated.Text>
          </View>

          {/* Bottom Button */}
          <Reanimated.View
            entering={FadeInDown.delay(800).duration(800)}
            style={styles.bottomSection}
          >
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#06b6d4', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started  →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Reanimated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scrollableBackground: {
    flexDirection: 'row',
    height: '100%',
  },
  backgroundImage: {
    width: IMAGE_WIDTH,
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  textSection: {
    marginBottom: 48,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#bae6fd',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: spacing.md,
    lineHeight: 64,
  },
  description: {
    fontSize: 18,
    color: '#cbd5e1',
    lineHeight: 28,
    maxWidth: '90%',
  },
  bottomSection: {
    width: '100%',
  },
  buttonWrapper: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
