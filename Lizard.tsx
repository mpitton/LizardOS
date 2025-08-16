import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

interface LizardProps {
  id: string;
  onAnimationEnd: (id: string) => void;
}

const getRandomColor = () => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Lizard: React.FC<LizardProps> = ({ id, onAnimationEnd }) => {
  const translateX = useRef(new Animated.Value(Math.random() * (width - 50))).current;
  const translateY = useRef(new Animated.Value(Math.random() * (height - 50))).current;
  const lizardColor = useRef(getRandomColor()).current;

  useEffect(() => {
    const createAnimation = () => {
      const animations = [];
      for (let i = 0; i < 5; i++) { // Create 5 random segments for the path
        const duration = Math.random() * 1000 + 1000; // 1-2 seconds per segment
        const toX = Math.random() * (width - 50);
        const toY = Math.random() * (height - 50);

        animations.push(
          Animated.timing(translateX, {
            toValue: toX,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: toY,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
      }

      Animated.sequence(animations).start(() => {
        // After completing the sequence, move off-screen
        const finalDuration = Math.random() * 2000 + 1000; // 1-3 seconds to leave screen
        const offScreenX = Math.random() < 0.5 ? -width : width * 2;
        const offScreenY = Math.random() < 0.5 ? -height : height * 2;

        Animated.parallel([
          Animated.timing(translateX, {
            toValue: offScreenX,
            duration: finalDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: offScreenY,
            duration: finalDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ]).start(() => onAnimationEnd(id));
      });
    };

    createAnimation();
  }, []);

  return (
    <Animated.View
      style={[
        styles.lizard,
        { backgroundColor: lizardColor },
        { transform: [{ translateX }, { translateY }] },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  lizard: {
    position: 'absolute',
    width: 150,
    height: 20,
    borderRadius: 10,
  },
});

export default Lizard;
