'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function TextInputModal({ isOpen, onClose }) {
  const [text, setText] = useState('');
  const maxWords = 1000;

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    // Handle text submission logic here
    console.log('Submitting text:', text);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Enter Text
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Paste or type your text to generate a summary
          </p>
        </div>

        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            placeholder="Enter your text here..."
          />
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Maximum {maxWords} words</span>
            <span>{wordCount} / {maxWords} words</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={wordCount === 0 || wordCount > maxWords}
          >
            Generate Summary
          </Button>
        </div>
      </div>
    </Modal>
  );
} 