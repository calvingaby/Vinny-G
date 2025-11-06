import React, { useState, useCallback } from 'react';
import { Settings } from './types';
import { OUTPUT_STYLES, PERSPECTIVES, LIGHTING_MOODS, CULTURAL_FOCUSES } from './constants';
import { optimizePrompt, generatePromptFromImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/imageUtils';
import SelectMenu from './components/SelectMenu';
import OutputDisplay from './components/OutputDisplay';

const App: React.FC = () => {
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [originalPromptForDisplay, setOriginalPromptForDisplay] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    outputStyle: OUTPUT_STYLES[0].value,
    perspective: PERSPECTIVES[0].value,
    lighting: LIGHTING_MOODS[0].value,
    culturalFocus: CULTURAL_FOCUSES[0].value,
  });
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [loading, setLoading] = useState<'optimize' | 'generate' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setError(null);
    } else if (file) {
      setError("Please upload a valid image file (JPG, PNG).");
      setImageFile(null);
      setImageUrl(null);
    }
  };
  
  const handleRemoveImage = () => {
      setImageFile(null);
      if(imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageUrl(null);
  }

  const handleSubmit = useCallback(async () => {
    if (!basePrompt.trim() && !imageFile) {
      setError("Please provide a base prompt or an image.");
      return;
    }
    setError(null);
    setLoading('optimize');
    setOptimizedPrompt('');
    setOriginalPromptForDisplay(basePrompt);

    try {
      const result = await optimizePrompt(basePrompt, settings, !!imageFile);
      setOptimizedPrompt(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(null);
    }
  }, [basePrompt, settings, imageFile]);
  
  const handleGenerateFromImage = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first to generate a prompt from it.");
      return;
    }
    setError(null);
    setLoading('generate');
    setOptimizedPrompt('');
    setOriginalPromptForDisplay(`[Generated from uploaded image: ${imageFile.name}]`);

    try {
      const imagePart = await fileToGenerativePart(imageFile);
      const result = await generatePromptFromImage(imagePart);
      setOptimizedPrompt(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(null);
    }
  }, [imageFile]);

  const isLoading = loading !== null;
  const isOptimizing = loading === 'optimize';
  const isGenerating = loading === 'generate';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Structured Visualizer
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
            Transform your ideas into high-fidelity, AI-ready visual prompts.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <div className="space-y-6 flex-grow">
              <div>
                <label htmlFor="base-prompt" className="block text-lg font-semibold text-gray-200 mb-2">
                  1. Your Creative Idea
                </label>
                <textarea
                  id="base-prompt"
                  rows={5}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition duration-150"
                  placeholder="e.g., A powerful queen sitting on a futuristic throne..."
                  value={basePrompt}
                  onChange={(e) => setBasePrompt(e.target.value)}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  2. Reference Image (Optional)
                </h3>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                      {imageUrl ? (
                          <div className='relative group'>
                              <img src={imageUrl} alt="preview" className="mx-auto h-24 w-auto rounded-md"/>
                              <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                          </div>
                      ) : (
                          <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                      )}
                    <div className="flex text-sm text-gray-500 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleImageUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  3. Structured Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectMenu label="Output Style" id="outputStyle" value={settings.outputStyle} options={OUTPUT_STYLES} onChange={handleSettingsChange} />
                  <SelectMenu label="Perspective Hint" id="perspective" value={settings.perspective} options={PERSPECTIVES} onChange={handleSettingsChange} />
                  <SelectMenu label="Lighting Mood" id="lighting" value={settings.lighting} options={LIGHTING_MOODS} onChange={handleSettingsChange} />
                  <SelectMenu label="Cultural Focus" id="culturalFocus" value={settings.culturalFocus} options={CULTURAL_FOCUSES} onChange={handleSettingsChange} />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-800/50 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-150"
                >
                  {isOptimizing ? 'Optimizing...' : 'Optimize Prompt'}
                </button>
                <button
                  onClick={handleGenerateFromImage}
                  disabled={isLoading || !imageFile}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 disabled:bg-teal-800/50 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-150"
                >
                  {isGenerating ? 'Analyzing...' : 'Generate from Image'}
                </button>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <OutputDisplay originalPrompt={originalPromptForDisplay} optimizedPrompt={optimizedPrompt} isLoading={isLoading}/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
