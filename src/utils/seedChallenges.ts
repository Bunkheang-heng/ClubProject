import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const sampleChallenges = [
  {
    title: "Two Sum",
    difficulty: "Easy" as const,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    example: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Input: nums = [3,2,4], target = 6
Output: [1,2]

Input: nums = [3,3], target = 6
Output: [0,1]`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    points: 100,
    timeLimit: 30,
    functionName: "twoSum",
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
    ]
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy" as const,
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and Open brackets must be closed in the correct order.",
    example: `Input: s = "()"
Output: true

Input: s = "()[]{}"
Output: true

Input: s = "(]"
Output: false

Input: s = "([)]"
Output: false

Input: s = "{[]}"
Output: true`,
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    points: 120,
    timeLimit: 25,
    functionName: "isValid",
    maxAttempts: 10, // Limited to 10 attempts
    testCases: [
      { input: { s: "()" }, expected: true },
      { input: { s: "()[]{}" }, expected: true },
      { input: { s: "(]" }, expected: false },
      { input: { s: "([)]" }, expected: false },
      { input: { s: "{[]}" }, expected: true },
    ]
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium" as const,
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a contiguous part of an array.",
    example: `Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.

Input: nums = [1]
Output: 1

Input: nums = [5,4,-1,7,8]
Output: 23`,
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    points: 200,
    timeLimit: 35,
    functionName: "maxSubArray",
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
      { input: { nums: [1] }, expected: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 },
      { input: { nums: [-1] }, expected: -1 },
    ]
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium" as const,
    description: "Given a string s, return the longest palindromic substring in s. A string is palindromic if it reads the same forward and backward.",
    example: `Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Input: s = "cbbd"
Output: "bb"`,
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    points: 250,
    timeLimit: 45,
    functionName: "longestPalindrome",
    testCases: [
      { input: { s: "babad" }, expected: "bab" },
      { input: { s: "cbbd" }, expected: "bb" },
      { input: { s: "a" }, expected: "a" },
      { input: { s: "ac" }, expected: "a" },
    ]
  },
  {
    title: "Reverse Integer",
    difficulty: "Medium" as const,
    description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
    example: `Input: x = 123
Output: 321

Input: x = -123
Output: -321

Input: x = 120
Output: 21`,
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    points: 180,
    timeLimit: 30,
    functionName: "reverse",
    testCases: [
      { input: { x: 123 }, expected: 321 },
      { input: { x: -123 }, expected: -321 },
      { input: { x: 120 }, expected: 21 },
      { input: { x: 0 }, expected: 0 },
    ]
  }
];

export const seedChallenges = async (createdBy: string = 'admin') => {
  try {
    console.log('Seeding challenges...');
    const challengesRef = collection(db, 'challenges');
    
    for (const challenge of sampleChallenges) {
      const challengeData = {
        ...challenge,
        createdAt: serverTimestamp(),
        createdBy
      };
      
      await addDoc(challengesRef, challengeData);
      console.log(`Added challenge: ${challenge.title}`);
    }
    
    console.log('Successfully seeded all challenges!');
    return { success: true, count: sampleChallenges.length };
  } catch (error) {
    console.error('Error seeding challenges:', error);
    return { success: false, error };
  }
};

export default seedChallenges; 