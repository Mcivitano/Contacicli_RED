
import React from 'react';

interface ArchiveModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 m-4 max-w-sm w-full border border-gray-700 transform transition-all">
        <h2 id="modal-title" className="text-2xl font-bold text-white mb-4">
          Conferma Fine Test
        </h2>
        <p className="text-gray-300 mb-6">
          Sei sicuro di voler terminare e archiviare il test corrente? L'operazione non è reversibile.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Conferma e Archivia
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
