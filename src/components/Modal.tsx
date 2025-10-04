import React from 'react';

interface ModalProps {
  isOpen: boolean; 
  onClose: () => void; // Fonction pour fermer le modal
  children: React.ReactNode; // Contenu à afficher dans le modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Ne rien afficher si le modal n'est pas ouvert

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times; 
          </button>
        </div>
        <div className="mt-4">
          {children} {/* Affiche le contenu passé au modal */}
        </div>
      </div>
    </div>
  );
};

export default Modal;