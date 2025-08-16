import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import Lizard from './Lizard';
import { useState, useEffect } from 'react';

interface LizardData {
  id: string;
}

export default function App() {
  const [lizards, setLizards] = useState<LizardData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lizards.length < 4) {
        const newId = String(Date.now() + Math.random());
        setLizards((prevLizards) => [...prevLizards, { id: newId }]);
      }
    }, 1000); // Generate a new lizard every second

    return () => clearInterval(interval);
  }, [lizards]);

  const handleAnimationEnd = (id: string) => {
    setLizards((prevLizards) => prevLizards.filter((lizard) => lizard.id !== id));
  };

  const handlePress = () => {
    setLizards([]);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {lizards.map((lizard) => (
          <Lizard key={lizard.id} id={lizard.id} onAnimationEnd={handleAnimationEnd} />
        ))}
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
