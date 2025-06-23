'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCode, FaPlay } from 'react-icons/fa';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Challenge } from '../types';
import { seedChallenges } from '@/utils/seedChallenges';

interface ChallengesTabProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

interface TestCase {
  input: any;
  expected: any;
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({ showSuccess, showError }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState<Omit<Challenge, 'id' | 'createdAt' | 'createdBy'>>({
    title: '',
    difficulty: 'Easy',
    description: '',
    example: '',
    constraints: [''],
    points: 100,
    timeLimit: 30,
    functionName: '',
    testCases: [{ input: {}, expected: {} }],
    maxAttempts: undefined
  });

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const challengesRef = collection(db, 'challenges');
      const challengesQuery = query(challengesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(challengesQuery);
      
      const challengesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Challenge[];
      
      setChallenges(challengesList);
    } catch (error) {
      console.error('Error loading challenges:', error);
      showError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      if (!user) {
        showError('You must be logged in to create challenges');
        return;
      }

      // Validate form
      if (!formData.title || !formData.description || !formData.functionName) {
        showError('Please fill in all required fields');
        return;
      }

      if (formData.testCases.length === 0) {
        showError('Please add at least one test case');
        return;
      }

      const challengeData = {
        ...formData,
        constraints: formData.constraints.filter(c => c.trim() !== ''),
        createdAt: editingChallenge ? editingChallenge.createdAt : serverTimestamp(),
        createdBy: editingChallenge ? editingChallenge.createdBy : user.uid,
        updatedAt: serverTimestamp()
      };

      if (editingChallenge && editingChallenge.id) {
        // Update existing challenge
        await updateDoc(doc(db, 'challenges', editingChallenge.id), challengeData);
        showSuccess('Challenge updated successfully!');
      } else {
        // Create new challenge
        await addDoc(collection(db, 'challenges'), challengeData);
        showSuccess('Challenge created successfully!');
      }

      resetForm();
      loadChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
      showError('Failed to save challenge');
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      difficulty: challenge.difficulty,
      description: challenge.description,
      example: challenge.example,
      constraints: challenge.constraints.length > 0 ? challenge.constraints : [''],
      points: challenge.points,
      timeLimit: challenge.timeLimit,
      functionName: challenge.functionName,
      testCases: challenge.testCases.length > 0 ? challenge.testCases : [{ input: {}, expected: {} }],
      maxAttempts: challenge.maxAttempts
    });
    setShowForm(true);
  };

  const handleDelete = async (challenge: Challenge) => {
    if (!challenge.id) return;
    
    if (window.confirm(`Are you sure you want to delete "${challenge.title}"?`)) {
      try {
        await deleteDoc(doc(db, 'challenges', challenge.id));
        showSuccess('Challenge deleted successfully!');
        loadChallenges();
      } catch (error) {
        console.error('Error deleting challenge:', error);
        showError('Failed to delete challenge');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      difficulty: 'Easy',
      description: '',
      example: '',
      constraints: [''],
      points: 100,
      timeLimit: 30,
      functionName: '',
      testCases: [{ input: {}, expected: {} }],
      maxAttempts: undefined
    });
    setEditingChallenge(null);
    setShowForm(false);
  };

  const addConstraint = () => {
    setFormData(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  const updateConstraint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.map((c, i) => i === index ? value : c)
    }));
  };

  const removeConstraint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index)
    }));
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: {}, expected: {} }]
    }));
  };

  const handleSeedChallenges = async () => {
    if (window.confirm('This will add 5 sample challenges to the database. Continue?')) {
      try {
        const user = auth.currentUser;
        const result = await seedChallenges(user?.uid || 'admin');
        if (result.success) {
          showSuccess(`Successfully added ${result.count} sample challenges!`);
          loadChallenges();
        } else {
          showError('Failed to seed challenges');
        }
      } catch (error) {
        console.error('Error seeding challenges:', error);
        showError('Failed to seed challenges');
      }
    }
  };

  const updateTestCase = (index: number, field: 'input' | 'expected', value: string) => {
    try {
      const parsedValue = JSON.parse(value);
      setFormData(prev => ({
        ...prev,
        testCases: prev.testCases.map((tc, i) => 
          i === index ? { ...tc, [field]: parsedValue } : tc
        )
      }));
    } catch (error) {
      // Invalid JSON, keep the string value for now
      setFormData(prev => ({
        ...prev,
        testCases: prev.testCases.map((tc, i) => 
          i === index ? { ...tc, [field]: value } : tc
        )
      }));
    }
  };

  const removeTestCase = (index: number) => {
    if (formData.testCases.length > 1) {
      setFormData(prev => ({
        ...prev,
        testCases: prev.testCases.filter((_, i) => i !== index)
      }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Code Challenges</h2>
          <p className="text-gray-400">Manage coding challenges for the platform</p>
        </div>
        <div className="flex gap-3">
          {challenges.length === 0 && (
            <button
              onClick={handleSeedChallenges}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaPlay className="text-sm" />
              Seed Sample Challenges
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="text-sm" />
            Add Challenge
          </button>
        </div>
      </div>

      {/* Challenge Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-screen overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' }))}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Function Name *</label>
                  <input
                    type="text"
                    value={formData.functionName}
                    onChange={(e) => setFormData(prev => ({ ...prev, functionName: e.target.value }))}
                    placeholder="e.g., twoSum"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Points *</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    min="0"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Time Limit (minutes) *</label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Max Attempts (optional)</label>
                  <input
                    type="number"
                    value={formData.maxAttempts || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      maxAttempts: e.target.value ? parseInt(e.target.value) || undefined : undefined 
                    }))}
                    min="1"
                    placeholder="Leave empty for unlimited"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Set to limit attempts (e.g., 10). Leave empty for unlimited attempts.</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Example</label>
                <textarea
                  value={formData.example}
                  onChange={(e) => setFormData(prev => ({ ...prev, example: e.target.value }))}
                  rows={3}
                  placeholder="Input: nums = [2,7,11,15], target = 9&#10;Output: [0,1]"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              {/* Constraints */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-300">Constraints</label>
                  <button
                    type="button"
                    onClick={addConstraint}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Constraint
                  </button>
                </div>
                {formData.constraints.map((constraint, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={constraint}
                      onChange={(e) => updateConstraint(index, e.target.value)}
                      placeholder="e.g., 1 <= nums.length <= 10^4"
                      className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    {formData.constraints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeConstraint(index)}
                        className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-300">Test Cases *</label>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Add Test Case
                  </button>
                </div>
                {formData.testCases.map((testCase, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">Test Case {index + 1}</h4>
                      {formData.testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-1">Input (JSON)</label>
                        <textarea
                          value={typeof testCase.input === 'string' ? testCase.input : JSON.stringify(testCase.input, null, 2)}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          rows={3}
                          placeholder='{"nums": [2,7,11,15], "target": 9}'
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Expected Output (JSON)</label>
                        <textarea
                          value={typeof testCase.expected === 'string' ? testCase.expected : JSON.stringify(testCase.expected, null, 2)}
                          onChange={(e) => updateTestCase(index, 'expected', e.target.value)}
                          rows={3}
                          placeholder='[0, 1]'
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Challenges List */}
      <div className="grid gap-4">
        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <FaCode className="text-4xl text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No challenges created yet</p>
            <p className="text-gray-500">Create your first coding challenge to get started!</p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-6 border border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3 line-clamp-2">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>🏆 {challenge.points} points</span>
                    <span>⏱️ {challenge.timeLimit} minutes</span>
                    <span>🧪 {challenge.testCases?.length || 0} test cases</span>
                    <span>📝 {challenge.functionName}()</span>
                    {challenge.maxAttempts && (
                      <span className="text-orange-400">🎯 {challenge.maxAttempts} max attempts</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(challenge)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    title="Edit Challenge"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Delete Challenge"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengesTab; 