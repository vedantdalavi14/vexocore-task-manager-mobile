// screens/DashboardScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Switch, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Pencil, CheckSquare, AlertTriangle } from 'lucide-react-native';
import ConfirmationModal from '../components/ConfirmationModal';
import Countdown from '../components/Countdown';

// This is a direct translation of your web app's dashboard
export default function DashboardScreen() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskText, setEditingTaskText] = useState('');
    const [filter, setFilter] = useState('all');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, "tasks"), where("userId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            tasksData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setTasks(tasksData);
            setLoading(false);
        });
        return unsubscribe;
    }, [currentUser]);

    const filteredTasks = useMemo(() => {
        const sorted = [...tasks].sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        });
        if (filter === 'pending') return sorted.filter(t => t.status === 'pending');
        if (filter === 'completed') return sorted.filter(t => t.status === 'completed');
        return sorted;
    }, [tasks, filter]);

    const handleAddTask = async () => {
        if (newTask.trim() === "") return;
        try {
            await addDoc(collection(db, "tasks"), {
                text: newTask.trim(),
                status: 'pending',
                createdAt: serverTimestamp(),
                userId: currentUser.uid,
                dueDate: null,
            });
            setNewTask('');
        } catch (error) { console.error("Error adding task: ", error); }
    };

    const handleToggleStatus = async (task) => {
        const taskRef = doc(db, "tasks", task.id);
        await updateDoc(taskRef, { status: task.status === 'pending' ? 'completed' : 'pending' });
    };

    const confirmDeleteTask = async () => {
        if (taskToDelete) {
            await deleteDoc(doc(db, "tasks", taskToDelete.id));
            setTaskToDelete(null);
        }
    };

    const handleStartEdit = (task) => {
        setEditingTaskId(task.id);
        setEditingTaskText(task.text);
    };

    const handleUpdateTask = async () => {
        if (editingTaskText.trim() === "") return;
        const taskRef = doc(db, "tasks", editingTaskId);
        await updateDoc(taskRef, { text: editingTaskText.trim() });
        setEditingTaskId(null);
        setEditingTaskText('');
    };

    const confirmLogout = () => signOut(auth);

    const renderTask = ({ item }) => {
        if (editingTaskId === item.id) {
            return (
                <View style={styles.taskItem}>
                    <TextInput
                        style={styles.editInput}
                        value={editingTaskText}
                        onChangeText={setEditingTaskText}
                        autoFocus={true}
                    />
                    <View style={styles.editButtons}>
                        <TouchableOpacity onPress={() => setEditingTaskId(null)}>
                            <Text style={{ color: '#9ca3af' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUpdateTask}>
                            <Text style={{ color: '#34d399', fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        const taskDate = item.dueDate ? new Date(item.dueDate).toLocaleString() : null;

        return (
            <View style={styles.taskItem}>
                <View style={styles.taskContent}>
                    <Switch
                        trackColor={{ false: "#4b5563", true: "#1d4ed8" }}
                        thumbColor={"#f4f3f4"}
                        onValueChange={() => handleToggleStatus(item)}
                        value={item.status === 'completed'}
                    />
                    <View style={styles.taskTextContainer}>
                        <Text style={[styles.taskText, item.status === 'completed' && styles.completedTaskText]}>
                            {item.text}
                        </Text>
                        <View style={{marginTop: 6}}>
                            {taskDate ? (
                                <Text style={styles.dateText}>{taskDate}</Text>
                            ) : (
                                <Text style={styles.dateText}>No due date</Text>
                            )}
                            {item.dueDate && item.status === 'pending' && <Countdown dueDate={item.dueDate} />}
                        </View>
                    </View>
                    <View style={styles.taskActions}>
                        <Text style={[styles.statusBadge, item.status === 'pending' ? styles.pendingBadge : styles.completedBadge]}>
                            {item.status}
                        </Text>
                        <TouchableOpacity onPress={() => handleStartEdit(item)}>
                            <Pencil size={18} color="#9ca3af" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTaskToDelete(item)}>
                            <Trash2 size={18} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ConfirmationModal visible={showLogoutConfirm} icon={<AlertTriangle size={48} color="#f87171" />} title="Are you sure?" message="You will be logged out of your account." confirmText="Confirm Logout" onConfirm={confirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
            <ConfirmationModal visible={!!taskToDelete} icon={<Trash2 size={48} color="#f87171" />} title="Delete Task?" message={`This will permanently delete the task: "${taskToDelete?.text}"`} confirmText="Delete Task" onConfirm={confirmDeleteTask} onCancel={() => setTaskToDelete(null)} />

            <View style={styles.header}>
                <View style={styles.headerTitleContainer}><CheckSquare color="#3b82f6" size={28} /><Text style={styles.headerTitle}>TaskFlow</Text></View>
                <View style={styles.headerRight}><Text style={styles.emailText}>{currentUser?.email}</Text><TouchableOpacity onPress={() => setShowLogoutConfirm(true)}><Text style={styles.logoutButton}>Logout</Text></TouchableOpacity></View>
            </View>

            <View style={styles.main}>
                <View style={styles.addTaskContainer}>
                    <TextInput style={styles.input} placeholder="What's your next task?" placeholderTextColor="#9ca3af" value={newTask} onChangeText={setNewTask} onSubmitEditing={handleAddTask} />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddTask}><Plus size={20} color="white" /></TouchableOpacity>
                </View>

                <View style={styles.filterContainer}>
                    <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filterButton, filter === 'all' && styles.activeFilter]}><Text style={styles.filterText}>All Tasks</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilter('pending')} style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}><Text style={styles.filterText}>Pending</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilter('completed')} style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}><Text style={styles.filterText}>Completed</Text></TouchableOpacity>
                </View>

                {loading ? <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }}/> : (
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTask}
                        ListEmptyComponent={() => (<View style={styles.emptyList}><Text style={styles.emptyText}>{filter === 'all' ? "You're all caught up!" : filter === 'pending' ? 'No pending tasks. Great job!' : 'No tasks completed yet.'}</Text></View>)}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111827' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1f2937' },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    emailText: { color: '#9ca3af', marginRight: 15 },
    logoutButton: { color: 'white', backgroundColor: '#374151', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, overflow: 'hidden' },
    main: { flex: 1, padding: 20 },
    addTaskContainer: { flexDirection: 'row', marginBottom: 20 },
    input: { flex: 1, backgroundColor: '#1f2937', color: 'white', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16 },
    editInput: { backgroundColor: '#374151', color: 'white', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 10 },
    addButton: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
    filterContainer: { flexDirection: 'row', marginBottom: 20 },
    filterButton: { paddingVertical: 10, flex: 1, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeFilter: { borderBottomColor: '#3b82f6' },
    filterText: { color: 'white', fontWeight: 'bold' },
    taskItem: { backgroundColor: '#1f2937', padding: 15, borderRadius: 8, marginBottom: 10 },
    taskContent: { flexDirection: 'row', alignItems: 'center' },
    taskTextContainer: { flex: 1, marginLeft: 15 },
    taskText: { color: 'white', fontSize: 16 },
    completedTaskText: { textDecorationLine: 'line-through', color: '#6b7280' },
    dateText: { color: '#9ca3af', fontSize: 12 },
    taskActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    statusBadge: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden' },
    pendingBadge: { backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' },
    completedBadge: { backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399' },
    editButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 10 },
    emptyList: { marginTop: 50, alignItems: 'center' },
    emptyText: { color: '#9ca3af', fontSize: 16 }
});