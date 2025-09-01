// screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock } from 'lucide-react-native';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Failed to create an account. The email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Start organizing your life, one task at a time."
      switchFormText="Already have an account?"
      switchFormLink="Log In"
      onSwitch={() => navigation.navigate('Login')}
    >
      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.inputContainer}>
          <Mail color="#9ca3af" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Lock color="#9ca3af" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password (min. 6 characters)"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {/* New Confirm Password Field */}
        <View style={styles.inputContainer}>
          <Lock color="#9ca3af" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
    form: {
        width: '100%',
      },
      errorText: {
        color: '#f87171',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: '#ef4444',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 14,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#374151',
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#4b5563',
      },
      icon: {
        marginLeft: 15,
      },
      input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 16,
      },
      button: {
        backgroundColor: '#2563eb',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
      },
});