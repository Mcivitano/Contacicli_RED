
export interface TestData {
  alesaggio: string;
  stelo: string;
  attacco: string;
  corsa: string;
  pressione: string;
  frequenza: string;
}

export interface TimeLogEntry {
  id: number;
  type: 'start' | 'stop';
  timestamp: any; // Modificato per compatibilità con Firestore Timestamp
}

export interface EditingState {
  index: number;
  tempValue: string;
}

export interface CurrentTestState {
    data: TestData;
    initialCycleCount: number;
    isRunning: boolean;
    timeLogs: TimeLogEntry[];
    testCode: string;
}

export interface ArchivedTest {
    id: string; // L'ID sarà una stringa da Firestore
    testCode: string;
    finalCycleCount: number;
    completionDate: string;
    data: TestData;
    timeLogs: TimeLogEntry[];
}