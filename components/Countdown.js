// components/Countdown.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function Countdown({ dueDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(dueDate) - +new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const isOverdue = +new Date(dueDate) < +new Date();

  if (isOverdue) {
    return (
      <View style={[styles.container, styles.overdueContainer]}>
        <Clock size={12} color="#f87171" />
        <Text style={styles.overdueText}> Overdue</Text>
      </View>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const timerComponents = [];
  if (timeLeft.days > 0) timerComponents.push(`${timeLeft.days}d`);
  if (timeLeft.hours > 0) timerComponents.push(`${timeLeft.hours}h`);
  if (timeLeft.minutes > 0) timerComponents.push(`${timeLeft.minutes}m`);
  timerComponents.push(`${timeLeft.seconds}s`);

  return (
    <View style={styles.container}>
      <Clock size={12} color="#60a5fa" />
      <Text style={styles.timeLeftText}> {timerComponents.join(' ')} left</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  overdueContainer: {
      marginTop: 0, // No margin for overdue text as it's on the same line
      marginLeft: 10,
  },
  overdueText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeLeftText: {
    color: '#60a5fa', // cyan-400 equivalent
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});