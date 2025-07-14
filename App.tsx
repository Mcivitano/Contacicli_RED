import React, { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, collection, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import { CurrentTestState, ArchivedTest, TimeLogEntry, EditingState, TestData } from './types';
import ConfigForm from './components/ConfigForm';
import CycleCounter from './components/CycleCounter';
import Controls from './components/Controls';
import TimeLog from './components/TimeLog';
import ArchiveModal from './components/ArchiveModal';
import ArchivedTestsList from './components/ArchivedTestsList';

const initialTestData: TestData = {
    alesaggio: '100',
    stelo: '50',
    attacco: 'ISO 6020-2',
    corsa: '500',
    pressione: '210',
    frequenza: '1',
};

const getInitialState = (): CurrentTestState => ({
    data: initialTestData,
    initialCycleCount: 0,
    isRunning: false,
    timeLogs: [],
    testCode: Object.values(initialTestData).filter(v => v.trim() !== '').join('-'),
});

// Funzione per convertire i Timestamp di Firestore in oggetti Date
const convertFirestoreTimestamps = (logs: any[]): TimeLogEntry[] => {
    return logs.map(log => ({
        ...log,
        timestamp: log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp)
    })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};


const App: React.FC = () => {
    const [currentTest, setCurrentTest] = useState<CurrentTestState>(getInitialState());
    const [archivedTests, setArchivedTests] = useState<ArchivedTest[]>([]);
    const [cycleCount, setCycleCount] = useState<number>(0);
    const [editingState, setEditingState] = useState<EditingState | null>(null);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    // Riferimenti ai documenti Firestore
    const currentTestRef = doc(db, "testState", "current");
    const archivedTestsRef = collection(db, "archivedTests");

    // Sincronizzazione in tempo reale con Firestore
    useEffect(() => {
        const unsubCurrent = onSnapshot(currentTestRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data() as CurrentTestState;
                data.timeLogs = convertFirestoreTimestamps(data.timeLogs);
                setCurrentTest(data);
            } else {
                // Se non esiste, crea il documento iniziale
                setDoc(currentTestRef, getInitialState());
            }
            setIsLoading(false);
        });

        const unsubArchived = onSnapshot(archivedTestsRef, (snapshot) => {
            const tests = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ArchivedTest));
            setArchivedTests(tests);
        });

        return () => {
            unsubCurrent();
            unsubArchived();
        };
    }, []);

    const updateCurrentTestInDb = useCallback(async (newState: Partial<CurrentTestState>) => {
        await setDoc(currentTestRef, { ...currentTest, ...newState }, { merge: true });
    }, [currentTest, currentTestRef]);
    
    const calculateTotalCycles = useCallback(() => {
        const frequencyHz = parseFloat(currentTest.data.frequenza);
        if (isNaN(frequencyHz) || frequencyHz <= 0) {
            setCycleCount(currentTest.initialCycleCount);
            return 0;
        }

        let totalActiveMilliseconds = 0;
        let lastStartTime: Date | null = null;
        
        currentTest.timeLogs.forEach(log => {
            if (log.type === 'start') {
                lastStartTime = log.timestamp;
            } else if (log.type === 'stop' && lastStartTime) {
                totalActiveMilliseconds += log.timestamp.getTime() - lastStartTime.getTime();
                lastStartTime = null; 
            }
        });

        if (currentTest.isRunning && lastStartTime) {
            totalActiveMilliseconds += new Date().getTime() - lastStartTime.getTime();
        }

        const calculatedCycles = Math.floor((totalActiveMilliseconds / 1000) * frequencyHz);
        const total = currentTest.initialCycleCount + calculatedCycles;
        setCycleCount(total);
        return total;
    }, [currentTest.timeLogs, currentTest.data.frequenza, currentTest.isRunning, currentTest.initialCycleCount]);

    useEffect(() => {
        calculateTotalCycles();
        let intervalId: number | undefined;
        if (currentTest.isRunning) {
            intervalId = window.setInterval(calculateTotalCycles, 250);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [currentTest.isRunning, calculateTotalCycles]);

    useEffect(() => {
        const code = Object.values(currentTest.data).filter(v => v.trim() !== '').join('-');
        if (code !== currentTest.testCode) {
            updateCurrentTestInDb({ testCode: code });
        }
    }, [currentTest.data, currentTest.testCode, updateCurrentTestInDb]);

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newData = { ...currentTest.data, [name]: value };
        updateCurrentTestInDb({ data: newData });
    };
  
    const handleInitialCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        updateCurrentTestInDb({ initialCycleCount: isNaN(value) ? 0 : value });
    };

    const handleToggleTest = () => {
        const newRunningState = !currentTest.isRunning;
        const newLog: TimeLogEntry = {
            id: Date.now(),
            type: newRunningState ? 'start' : 'stop',
            timestamp: new Date(),
        };
        const newTimeLogs = [...currentTest.timeLogs, newLog].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        updateCurrentTestInDb({ isRunning: newRunningState, timeLogs: newTimeLogs });
    };

    const handleEditLog = (index: number) => {
        const logToEdit = currentTest.timeLogs[index];
        const date = logToEdit.timestamp;
        const localISOString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setEditingState({ index, tempValue: localISOString });
    };
  
    const handleSaveLog = (index: number) => {
        if (editingState) {
            const newTimestamp = new Date(editingState.tempValue);
            const newTimeLogs = currentTest.timeLogs.map((log, i) =>
                i === index ? { ...log, timestamp: newTimestamp } : log
            ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
            updateCurrentTestInDb({ timeLogs: newTimeLogs });
            setEditingState(null);
        }
    };

    const handleCancelEdit = () => setEditingState(null);

    const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(editingState) setEditingState({...editingState, tempValue: e.target.value});
    };
  
    const handleDeleteLog = (idToDelete: number) => {
        const newTimeLogs = currentTest.timeLogs.filter(log => log.id !== idToDelete);
        updateCurrentTestInDb({ timeLogs: newTimeLogs });
    };
    
    const handleArchiveTest = async () => {
        const finalCycleCount = calculateTotalCycles();
        
        const newArchivedTest = {
            testCode: currentTest.testCode,
            finalCycleCount: finalCycleCount,
            completionDate: new Date().toLocaleString('it-IT'),
            data: currentTest.data,
            timeLogs: currentTest.timeLogs,
            createdAt: serverTimestamp() // per ordinamento
        };
        
        await addDoc(archivedTestsRef, newArchivedTest);
        await updateCurrentTestInDb({ ...getInitialState(), isRunning: false });
        
        setIsArchiveModalOpen(false);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-2xl">Caricamento dati...</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Cilindro Test Tracker</h1>
                    <p className="text-lg text-gray-400 mt-2">Monitoraggio cicli per cilindro oleodinamico in sala prove.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <ConfigForm
                            testData={currentTest.data}
                            onDataChange={handleDataChange}
                            isTestRunning={currentTest.isRunning}
                            initialCycleCount={currentTest.initialCycleCount}
                            onInitialCycleChange={handleInitialCycleChange}
                            testCode={currentTest.testCode}
                        />
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center">
                            <CycleCounter count={cycleCount} />
                            <Controls
                                isTestRunning={currentTest.isRunning}
                                onToggle={handleToggleTest}
                                onEndTest={() => setIsArchiveModalOpen(true)}
                                isEndTestDisabled={currentTest.timeLogs.length === 0}
                            />
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                            <TimeLog
                                logs={currentTest.timeLogs}
                                editingState={editingState}
                                onEdit={handleEditLog}
                                onSave={handleSaveLog}
                                onCancel={handleCancelEdit}
                                onEditingChange={handleEditingChange}
                                onDelete={handleDeleteLog}
                            />
                        </div>
                    </div>
                </main>
                
                <section className="max-w-7xl mx-auto mt-12">
                     <ArchivedTestsList tests={archivedTests} />
                </section>

            </div>
            <ArchiveModal
                isOpen={isArchiveModalOpen}
                onConfirm={handleArchiveTest}
                onCancel={() => setIsArchiveModalOpen(false)}
            />
        </>
    );
};

export default App;
