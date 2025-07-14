import React, { useState } from 'react';
import { ArchivedTest } from '../types';
import { ClockIcon, ExcelIcon } from './icons';
import * as XLSX from 'xlsx';

const ArchivedTestItem: React.FC<{ test: ArchivedTest }> = ({ test }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExport = () => {
        const defaultFileName = `Test_${test.testCode.replace(/\s/g, '_')}_${new Date().toLocaleDateString('it-IT')}.xlsx`;
        const fileName = prompt("Inserisci il nome del file per l'esportazione:", defaultFileName);
        
        if (!fileName) { // Utente ha annullato
            return;
        }

        // 1. Foglio Riepilogo
        const summaryData = [
            ["Codice Test", test.testCode],
            ["Data Completamento", test.completionDate],
            ["Cicli Finali", test.finalCycleCount],
            ["", ""], // riga vuota
            ["Dettagli Configurazione", ""],
            ["Alesaggio (mm)", test.data.alesaggio],
            ["Stelo (mm)", test.data.stelo],
            ["Attacco", test.data.attacco],
            ["Corsa (mm)", test.data.corsa],
            ["Pressione (bar)", test.data.pressione],
            ["Frequenza (Hz)", test.data.frequenza],
        ];
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

        // 2. Foglio Registro Orari
        const logHeader = ["Tipo", "Data", "Ora"];
        const logData = test.timeLogs.map(log => {
             const d = new Date(log.timestamp);
             return [
                log.type === 'start' ? 'INIZIO' : 'FINE',
                d.toLocaleDateString('it-IT'),
                d.toLocaleTimeString('it-IT')
             ];
        });
        const logWs = XLSX.utils.aoa_to_sheet([logHeader, ...logData]);

        // Creazione Workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, summaryWs, "Riepilogo Test");
        XLSX.utils.book_append_sheet(wb, logWs, "Registro Orari");

        // Download file
        XLSX.writeFile(wb, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
    };

    return (
        <li className="bg-gray-800 rounded-lg shadow-md border border-gray-700 transition-all duration-300">
            <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-700/50 rounded-t-lg"
                aria-expanded={isExpanded}
            >
                <div>
                    <p className="font-mono text-green-400 text-sm">{test.testCode}</p>
                    <p className="text-gray-400 text-xs">Completato il: {test.completionDate}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-white">{test.finalCycleCount.toLocaleString('it-IT')}</p>
                    <p className="text-xs text-gray-500">Cicli Finali</p>
                </div>
            </button>
            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                    <h4 className="font-semibold text-gray-200 mb-2">Dettagli Configurazione:</h4>
                    <ul className="text-sm text-gray-300 space-y-1 pl-2">
                        <li>Alesaggio: <span className="font-mono">{test.data.alesaggio} mm</span></li>
                        <li>Stelo: <span className="font-mono">{test.data.stelo} mm</span></li>
                        <li>Attacco: <span className="font-mono">{test.data.attacco}</span></li>
                        <li>Corsa: <span className="font-mono">{test.data.corsa} mm</span></li>
                        <li>Pressione: <span className="font-mono">{test.data.pressione} bar</span></li>
                        <li>Frequenza: <span className="font-mono">{test.data.frequenza} Hz</span></li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-600 flex justify-end">
                         <button
                            onClick={handleExport}
                            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold"
                         >
                             <ExcelIcon />
                             <span>Esporta in Excel</span>
                         </button>
                    </div>
                </div>
            </div>
        </li>
    );
};


const ArchivedTestsList: React.FC<{ tests: ArchivedTest[] }> = ({ tests }) => {
  if (tests.length === 0) {
    return null; // Non mostrare nulla se non ci sono test archiviati
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-3 flex items-center">
        <ClockIcon />
        <span className="ml-2">Archivio Test Conclusi</span>
      </h2>
      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {tests.map(test => (
          <ArchivedTestItem key={test.id} test={test} />
        ))}
      </ul>
    </div>
  );
};

export default ArchivedTestsList;