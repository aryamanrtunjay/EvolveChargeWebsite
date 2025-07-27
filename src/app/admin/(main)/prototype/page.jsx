'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../../../firebaseConfig';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};


export default function AmpereonPrototypeControl() {
  const [action, setAction] = useState('forward');
  const [duration, setDuration] = useState('');
  const [steps, setSteps] = useState([]);

  const addStep = () => {
    const dur = parseFloat(duration);
    if (isNaN(dur) || dur <= 0) {
      alert('Please enter a valid positive duration.');
      return;
    }
    setSteps([...steps, { action, duration: dur }]);
    setDuration('');
  };

  const submitInstructions = async () => {
    if (steps.length === 0) {
      alert('Please add at least one step.');
      return;
    }
    try {
      const db = getDatabase(app);
      await set(ref(db, '/prototype-instructions'), { steps, executed: false });
      alert('Instructions updated successfully!');
      setSteps([]);
    } catch (err) {
      alert('Error updating instructions: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Ampereon Prototype Control</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-gray-900"
            >
              <option value="forward">Move Forward</option>
              <option value="backward">Move Backward</option>
              <option value="drop">Drop</option>
              <option value="raise">Raise</option>
              <option value="actuator_forward">Actuator Forward</option>
              <option value="actuator_backward">Actuator Backward</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="0.1"
              step="0.1"
              placeholder="e.g., 3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-gray-900"
            />
          </div>
          
          <button
            onClick={addStep}
            className="w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 font-medium transition-colors"
          >
            Add Step
          </button>
        </div>
        
        <h4 className="text-lg font-medium text-gray-900 mt-6 mb-3">Current Steps</h4>
        <ul className="space-y-2 mb-4">
          {steps.map((step, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 border border-gray-200">
              {step.action.charAt(0).toUpperCase() + step.action.slice(1).replace(/_/g, ' ')} for {step.duration} seconds
            </li>
          ))}
          {steps.length === 0 && (
            <p className="text-sm text-gray-500 text-center">No steps added yet</p>
          )}
        </ul>
        
        <button
          onClick={submitInstructions}
          className="w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 font-medium transition-colors"
        >
          Submit Instructions
        </button>
      </motion.div>
    </div>
  );
}