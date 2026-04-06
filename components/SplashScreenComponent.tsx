import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, StatusBar } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";

/**
 * SplashScreenComponent — Animated App Launch Screen
 *
 * Shown while the app is starting up (before the auth state is loaded).
 * Uses react-native-reanimated for smooth entry animations.
 *
 * Animation flow:
 * 1. Background fades in (opacity 0 → 1)
 * 2. Image scales up (0.9 → 1.0) with an exponential easing curve
 * 3. Logo simultaneously fades in over 1.2 seconds
 */

// Get the full screen dimensions to cover the entire display
const { width, height } = Dimensions.get("window");

const SplashScreenComponent: React.FC = () => {
  /**
   * useSharedValue: A special Reanimated hook for animatable values.
   * These live on the UI thread for smooth, non-blocking animations.
   */
  const logoScale = useSharedValue(0.9);        // Start slightly scaled down
  const logoOpacity = useSharedValue(0);         // Start invisible
  const backgroundOpacity = useSharedValue(0);   // Start invisible

  useEffect(() => {
    // Trigger all animations simultaneously when the component mounts
    backgroundOpacity.value = withTiming(1, { duration: 1000 });      // Fade in over 1 sec
    logoScale.value = withTiming(1, {
      duration: 1500,
      easing: Easing.out(Easing.exp), // Exponential easing = fast at start, slows down at end
    });
    logoOpacity.value = withTiming(1, { duration: 1200 }); // Fade in over 1.2 sec
  }, []);

  /**
   * useAnimatedStyle: Maps shared values to React Native style props.
   * This style updates automatically whenever the shared values change.
   */
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Make status bar transparent so splash image shows behind it */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Background Image — The full splash screen design with animation applied */}
      <Animated.Image
        source={require("../assets/remart-splash-screen.png")}
        style={[styles.backgroundImage, animatedBackgroundStyle]}
        resizeMode="cover"
      />

      {/* 
        Optional: Overlay logo for precise animation control.
        Currently commented out, but shows the pattern if needed.
      */}
      {/* 
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require("../assets/remart-logo.png")}
          style={[styles.logo, animatedLogoStyle]}
          resizeMode="contain"
        />
      </View>
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    width: width,   // Cover full screen width
    height: height, // Cover full screen height
    position: "absolute",
  },
  logoContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});

export default SplashScreenComponent;

