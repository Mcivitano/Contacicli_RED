
import React from 'react';
import { TestData } from './types';

interface ConfigFormProps {
  testData: TestData;
  onDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTestRunning: boolean;
  initialCycleCount: number;
  onInitialCycleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testCode: string;
}

interface FormField {
  id: keyof TestData;
  label: string;
  unit?: string;
  type: string;
}

const formFields: FormField[] = [
  { id: 'alesaggio', label: 'Alesaggio', unit: 'mm', type: 'number' },
  { id: 'stelo', label: 'Stelo', unit: 'mm', type: 'number' },
  { id: 'attacco', label: 'Attacco', type: 'text' },
  { id: 'guarnizioni', label: 'Guarnizioni', type: 'text' },
  { id: 'corsa', label: 'Corsa', unit: 'mm', type: 'number' },
  { id: 'pressione', label: 'Pressione', unit: 'bar', type: 'number' },
  { id: 'frequenza', label: 'Frequenza', unit: 'Hz', type: 'number' },
];

const InputField: React.FC<{
  field: FormField;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}> = ({ field, value, onChange, disabled }) => (
    <div>
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1">
            {field.label}
        </label>
        <div className="relative">
            <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={field.label}
                step={field.id === 'frequenza' ? '0.1' : '1'}
                min="0"
            />
            {field.unit && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    {field.unit}
                </span>
            )}
        </div>
    </div>
);

const ConfigForm: React.FC<ConfigFormProps> = ({
  testData,
  onDataChange,
  isTestRunning,
  initialCycleCount,
  onInitialCycleChange,
  testCode,
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-600 pb-3">
        Dati di Configurazione
      </h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="initialCycleCount" className="block text-sm font-medium text-gray-300 mb-1">
            Cicli Iniziali
          </label>
          <input
            type="number"
            id="initialCycleCount"
            name="initialCycleCount"
            value={initialCycleCount}
            onChange={onInitialCycleChange}
            disabled={isTestRunning}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="0"
            min="0"
          />
        </div>

        {formFields.map((field) => (
          <InputField
            key={field.id}
            field={field}
            value={testData[field.id]}
            onChange={onDataChange}
            disabled={isTestRunning}
          />
        ))}
      </form>
      <div className="mt-8 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">
            Codice Test
          </h3>
          <p className="bg-gray-900 p-3 rounded-md font-mono text-center text-green-300 border border-gray-600 break-words">
            {testCode || 'N/D'}
          </p>
      </div>
    </div>
  );
};

export default ConfigForm;
