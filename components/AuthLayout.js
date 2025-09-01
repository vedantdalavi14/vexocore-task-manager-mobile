// components/AuthLayout.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { CheckSquare } from 'lucide-react-native';

export default function AuthLayout({ children, title, subtitle, switchFormText, switchFormLink, onSwitch }) {
  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
            <View style={styles.header}>
                <CheckSquare color="#3b82f6" size={40} />
                <Text style={styles.headerTitle}>TaskFlow</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                {children}
                <TouchableOpacity onPress={onSwitch} style={styles.switchButton}>
                    <Text style={styles.switchText}>
                        {switchFormText}{' '}
                        <Text style={styles.switchLink}>{switchFormLink}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#111827', // Equivalent to bg-gray-900
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
    },
    card: {
        width: '100%',
        backgroundColor: '#1f2937', // Equivalent to bg-gray-800
        borderRadius: 12, // rounded-xl
        padding: 25,
        alignItems: 'center',
        borderColor: '#374151', // border-gray-700
        borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        color: '#9ca3af', // text-gray-400
        marginBottom: 30,
        textAlign: 'center',
    },
    switchButton: {
        marginTop: 24,
    },
    switchText: {
        color: '#9ca3af', // text-gray-400
    },
    switchLink: {
        color: '#3b82f6', // text-blue-500
        fontWeight: '500', // font-medium
    },
});