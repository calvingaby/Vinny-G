
import React, { useState, useMemo } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface OutputDisplayProps {
  originalPrompt: string;
  optimizedPrompt: string;
  isLoading: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ originalPrompt, optimizedPrompt, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (optimizedPrompt) {
      navigator.clipboard.writeText(optimizedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const highlightedPrompt = useMemo(() => {
    if (!optimizedPrompt || !originalPrompt) {
      return <p>{optimizedPrompt}</p>;
    }
    const originalWords = new Set(originalPrompt.toLowerCase().split(/[\s,.]+/).filter(Boolean));
    const optimizedWords = optimizedPrompt.split(/(\s+)/);

    return (
      <p className="leading-relaxed">
        {optimizedWords.map((word, index) => {
          const cleanWord = word.replace(/[,.]/g, '').toLowerCase();
          if (cleanWord && !originalWords.has(cleanWord)) {
            return (
              <span key={index} className="bg-indigo-500/30 text-indigo-300 rounded-sm px-0.5">
                {word}
              </span>
            );
          }
          return <span key={index}>{word}</span>;
        })}
      </p>
    );
  }, [originalPrompt, optimizedPrompt]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 min-h-[300px]">
        <div className="flex flex-col items-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="mt-4 text-gray-300">Optimizing your vision...</span>
        </div>
      </div>
    );
  }

  if (!optimizedPrompt) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 min-h-[300px]">
        <p className="text-gray-400 text-center">Your optimized prompt will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Comparison View</h3>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="font-mono text-xs uppercase text-gray-500 mb-2">Original</h4>
          <p className="text-gray-400 italic text-sm leading-relaxed">{originalPrompt || "No base prompt provided."}</p>
          <hr className="border-gray-700 my-4" />
          <h4 className="font-mono text-xs uppercase text-gray-500 mb-2">Optimized <span className="text-indigo-400 normal-case">(new terms highlighted)</span></h4>
          {highlightedPrompt}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Final Prompt</h3>
        <div className="relative bg-gray-900/50 p-4 rounded-lg border border-gray-600">
          <p className="text-gray-200 font-mono text-sm leading-relaxed">{optimizedPrompt}</p>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-indigo-600 rounded-md transition duration-200 text-gray-300 hover:text-white"
            aria-label="Copy prompt"
          >
            {isCopied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <CopyIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutputDisplay;
