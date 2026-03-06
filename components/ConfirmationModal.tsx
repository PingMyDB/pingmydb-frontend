
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertCircle className="text-destructive" size={24} />,
          button: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          bg: 'bg-destructive/10'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="text-yellow-600" size={24} />,
          button: 'bg-yellow-600 text-white hover:bg-yellow-600/90',
          bg: 'bg-yellow-500/10'
        };
      case 'info':
        return {
          icon: <AlertCircle className="text-primary" size={24} />,
          button: 'bg-primary text-primary-foreground hover:bg-primary/90',
          bg: 'bg-primary/10'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-card border rounded-2xl shadow-2xl p-6 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${styles.bg}`}>
                {styles.icon}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex w-full gap-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl border font-semibold hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 py-2.5 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${styles.button}`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <AlertCircle size={18} />
                    </motion.div>
                  ) : null}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
