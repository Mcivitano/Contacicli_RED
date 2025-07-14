
import React from 'react';
import { TimeLogEntry, EditingState } from '../types';
import * as Icons from './icons';

interface TimeLogProps {
  logs: TimeLogEntry[];
  editingState: EditingState | null;
  onEdit: (index: number) => void;
  onSave: (index: number) => void;
  onCancel: () => void;
  onEditingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: number) => void;
}

const TimeLog: React.FC<TimeLogProps> = ({ logs, editingState, onEdit, onSave, onCancel, onEditingChange, onDelete }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-3 flex items-center">
        <Icons.ClockIcon />
        <span className="ml-2">Registro Orari</span>
      </h2>
      {logs.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Nessuna registrazione ancora. Premi Play per iniziare.</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {logs.map((log, index) => (
            <li
              key={log.id}
              className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
            >
              <div className="flex items-center">
                <span
                  className={`font-semibold mr-3 px-2 py-0.5 rounded-full text-sm ${
                    log.type === 'start' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {log.type === 'start' ? 'INIZIO' : 'FINE'}
                </span>
                {editingState?.index === index ? (
                  <input
                    type="datetime-local"
                    value={editingState.tempValue}
                    onChange={onEditingChange}
                    className="bg-gray-600 border border-gray-500 text-white rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <span className="text-gray-300 font-mono">{formatDate(log.timestamp)}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {editingState?.index === index ? (
                  <>
                    <button
                      onClick={() => onSave(index)}
                      className="text-green-400 hover:text-green-300 transition-colors"
                      aria-label="Salva"
                    >
                      <Icons.SaveIcon />
                    </button>
                    <button
                      onClick={onCancel}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                      aria-label="Annulla"
                    >
                      <Icons.CancelIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onEdit(index)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      aria-label="Modifica"
                    >
                      <Icons.EditIcon />
                    </button>
                    <button
                      onClick={() => onDelete(log.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      aria-label="Elimina"
                    >
                      <Icons.TrashIcon />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeLog;