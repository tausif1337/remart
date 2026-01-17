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

const { width, height } = Dimensions.get("window");

const SplashScreenComponent: React.FC = () => {
  const logoScale = useSharedValue(0.9);
  const logoOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    backgroundOpacity.value = withTiming(1, { duration: 1000 });
    logoScale.value = withTiming(1, { 
      duration: 1500, 
      easing: Easing.out(Easing.exp) 
    });
    logoOpacity.value = withTiming(1, { duration: 1200 });
  }, []);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Background Image - The full splash screen design */}
      <Animated.Image
        source={require("../assets/remart-splash-screen.png")}
        style={[styles.backgroundImage, animatedBackgroundStyle]}
        resizeMode="cover"
      />

      {/* Optionally overlay the logo for more control over animation */}
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
    width: width,
    height: height,
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
