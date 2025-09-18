
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import Lizard from './Lizard';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

interface LizardData {
  id: string;
}

export default function App() {
  const [lizards, setLizards] = useState<LizardData[]>([]);
  const lizardsRef = useRef(lizards);
  const [appVersion, setAppVersion] = useState('1.0.4');

  // Ref to hold the sound object
  const soundObject = useRef<Audio.Sound | null>(null);

  // Load sound once when component mounts
  useEffect(() => {
    const loadSound = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://audio-edge-d34v9.syd.o.radiomast.io/ref-128k-mp3-stereo' }
          //special thanks to https://www.radiomast.io/reference-streams for their reference audio streams.
        );
        soundObject.current = sound;
      } catch (error) {
        console.error('Error loading sound', error);
      }
    };
    loadSound();

    return () => {
      // Unload sound when component unmounts
      if (soundObject.current) {
        soundObject.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    lizardsRef.current = lizards;
  }, [lizards]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lizardsRef.current.length < 4) {
        const newId = String(Date.now() + Math.random());
        setLizards((prevLizards) => [...prevLizards, { id: newId }]);
      }
    }, 1000); // Generate a new lizard every second

    return () => clearInterval(interval);
  }, []);

  const handleAnimationEnd = (id: string) => {
    setLizards((prevLizards) => prevLizards.filter((lizard) => lizard.id !== id));
  };

  const handlePress = async () => {
    setLizards([]);
    // Play sound
    if (soundObject.current) {
      try {
        // Reset playback position to 0 to play from beginning
        await soundObject.current.setPositionAsync(0);
        await soundObject.current.playAsync();
      } catch (error) {
        console.error('Error playing sound', error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {lizards.map((lizard) => (
          <Lizard key={lizard.id} id={lizard.id} onAnimationEnd={handleAnimationEnd} />
        ))}
        <Text style={styles.versionText}>v{appVersion}</Text>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  versionText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    color: 'green',
    fontSize: 12,
  },
});
