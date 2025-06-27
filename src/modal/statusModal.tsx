import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react'; // Importa o ícone de erro também

interface StatusModalProps {
  message: string;
  type: 'success' | 'error'; // Adiciona um tipo para controlar o estilo
  onClose: () => void;
  duration?: number; // Duração em milissegundos que o modal ficará visível (default: 3000ms)
}

const StatusModal: React.FC<StatusModalProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Define as cores e o ícone com base no tipo
  const icon = type === 'success' ? <CheckCircle className="h-24 w-24 text-green-500 mb-4" /> : <XCircle className="h-24 w-24 text-red-500 mb-4" />;
  const title = type === 'success' ? 'Sucesso!' : 'Ops, algo deu errado!';
  const titleColorClass = type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  useEffect(() => {
    setIsVisible(true);

    const timerOut = setTimeout(() => {
      setIsVisible(false);
      const timerClose = setTimeout(() => onClose(), 300);
      return () => clearTimeout(timerClose);
    }, duration);

    return () => clearTimeout(timerOut);
  }, [duration, onClose]);

  return (
    <div className={`
      fixed inset-0 bg-black/50 dark:bg-slate-900/75 flex items-center justify-center z-50
      transition-opacity duration-300 ease-out
      ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div className={`
        bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center flex flex-col items-center
        transform transition-all duration-300 ease-out
        ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {icon}
        <h3 className={`text-3xl font-bold ${titleColorClass} mb-3`}>{title}</h3>
        <p className="text-xl text-slate-700 dark:text-slate-300 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default StatusModal;