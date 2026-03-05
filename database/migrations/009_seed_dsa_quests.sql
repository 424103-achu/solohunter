-- Seed DSA Niche + DSA Coding Quests with hardcoded test_cases and starter_code
-- Run: psql -U postgres -h localhost -d solo_hunter_rpg -f seed_dsa_quests.sql

-- ============ INSERT DSA NICHE ============
INSERT INTO niches (name, description) VALUES
  ('DSA', 'Data Structures & Algorithms — the core of competitive programming')
ON CONFLICT DO NOTHING;

-- Also insert other niches for completeness
INSERT INTO niches (name, description) VALUES
  ('Frontend', 'Master the art of building beautiful, responsive user interfaces'),
  ('Backend', 'Conquer server-side logic, APIs, and database mastery'),
  ('DevOps', 'Infrastructure, CI/CD, containers, and cloud deployment'),
  ('Full Stack', 'The complete warrior — front and back combined')
ON CONFLICT DO NOTHING;

-- ============================================================
-- EASY DAILY QUESTS (Levels 1-5)
-- ============================================================

INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type, niche_id, starter_code, test_cases) VALUES
(
  'Two Sum',
  'Given an array of integers and a target, return indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice.
---EXAMPLES---
Input: nums = [2,7,11,15], target = 9 → Output: [0,1]
Input: nums = [3,2,4], target = 6 → Output: [1,2]
Input: nums = [3,3], target = 6 → Output: [0,1]
---STARTER---
function twoSum(nums, target) {
  // Your code here
}',
  'easy', 50, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function twoSum(nums, target) {\n  // Your code here\n}',
  '[
    {"input": "twoSum([2,7,11,15], 9)", "expected_output": "[0,1]", "description": "Basic case"},
    {"input": "twoSum([3,2,4], 6)", "expected_output": "[1,2]", "description": "Middle elements"},
    {"input": "twoSum([3,3], 6)", "expected_output": "[0,1]", "description": "Duplicate values"},
    {"input": "twoSum([1,5,3,7], 8)", "expected_output": "[1,2]", "description": "Non-adjacent pair"}
  ]'::jsonb
),
(
  'Reverse String',
  'Write a function that reverses a string. Return the reversed string.
---EXAMPLES---
Input: "hello" → Output: "olleh"
Input: "world" → Output: "dlrow"
Input: "a" → Output: "a"
---STARTER---
function reverseString(s) {
  // Your code here
}',
  'easy', 40, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function reverseString(s) {\n  // Your code here\n}',
  '[
    {"input": "reverseString(\"hello\")", "expected_output": "olleh", "description": "Basic word"},
    {"input": "reverseString(\"world\")", "expected_output": "dlrow", "description": "Another word"},
    {"input": "reverseString(\"a\")", "expected_output": "a", "description": "Single character"},
    {"input": "reverseString(\"racecar\")", "expected_output": "racecar", "description": "Palindrome"},
    {"input": "reverseString(\"\")", "expected_output": "", "description": "Empty string"}
  ]'::jsonb
),
(
  'Palindrome Number',
  'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.
---EXAMPLES---
Input: 121 → Output: true
Input: -121 → Output: false
Input: 10 → Output: false
---STARTER---
function isPalindrome(x) {
  // Your code here
}',
  'easy', 40, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function isPalindrome(x) {\n  // Your code here\n}',
  '[
    {"input": "isPalindrome(121)", "expected_output": "true", "description": "Palindrome number"},
    {"input": "isPalindrome(-121)", "expected_output": "false", "description": "Negative number"},
    {"input": "isPalindrome(10)", "expected_output": "false", "description": "Ends with zero"},
    {"input": "isPalindrome(0)", "expected_output": "true", "description": "Zero"},
    {"input": "isPalindrome(12321)", "expected_output": "true", "description": "5-digit palindrome"}
  ]'::jsonb
),
(
  'FizzBuzz',
  'Given an integer n, return a string array answer where: answer[i] == "FizzBuzz" if i+1 is divisible by 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, or i+1 as a string otherwise.
---EXAMPLES---
Input: n = 3 → Output: ["1","2","Fizz"]
Input: n = 5 → Output: ["1","2","Fizz","4","Buzz"]
Input: n = 15 → last element is "FizzBuzz"
---STARTER---
function fizzBuzz(n) {
  // Your code here
}',
  'easy', 45, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function fizzBuzz(n) {\n  // Your code here\n}',
  '[
    {"input": "fizzBuzz(3)", "expected_output": "[\"1\",\"2\",\"Fizz\"]", "description": "n=3"},
    {"input": "fizzBuzz(5)", "expected_output": "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]", "description": "n=5"},
    {"input": "fizzBuzz(1)", "expected_output": "[\"1\"]", "description": "n=1"},
    {"input": "fizzBuzz(15)[14]", "expected_output": "FizzBuzz", "description": "15th element is FizzBuzz"}
  ]'::jsonb
),
(
  'Array Sum',
  'Write a function that returns the sum of all elements in an array of integers.
---EXAMPLES---
Input: [1,2,3,4,5] → Output: 15
Input: [10,20,30] → Output: 60
Input: [] → Output: 0
---STARTER---
function arraySum(arr) {
  // Your code here
}',
  'easy', 35, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function arraySum(arr) {\n  // Your code here\n}',
  '[
    {"input": "arraySum([1,2,3,4,5])", "expected_output": "15", "description": "Basic sum"},
    {"input": "arraySum([10,20,30])", "expected_output": "60", "description": "Tens"},
    {"input": "arraySum([])", "expected_output": "0", "description": "Empty array"},
    {"input": "arraySum([-1,1,-2,2])", "expected_output": "0", "description": "Negative numbers"},
    {"input": "arraySum([100])", "expected_output": "100", "description": "Single element"}
  ]'::jsonb
),
(
  'Count Vowels',
  'Write a function that counts the number of vowels (a, e, i, o, u) in a given string. Case insensitive.
---EXAMPLES---
Input: "hello" → Output: 2
Input: "AEIOU" → Output: 5
Input: "xyz" → Output: 0
---STARTER---
function countVowels(str) {
  // Your code here
}',
  'easy', 35, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function countVowels(str) {\n  // Your code here\n}',
  '[
    {"input": "countVowels(\"hello\")", "expected_output": "2", "description": "Basic word"},
    {"input": "countVowels(\"AEIOU\")", "expected_output": "5", "description": "All vowels uppercase"},
    {"input": "countVowels(\"xyz\")", "expected_output": "0", "description": "No vowels"},
    {"input": "countVowels(\"\")", "expected_output": "0", "description": "Empty string"},
    {"input": "countVowels(\"aEiOu\")", "expected_output": "5", "description": "Mixed case"}
  ]'::jsonb
),
(
  'Find Maximum',
  'Write a function that returns the maximum value in an array of numbers. Return -Infinity for empty arrays.
---EXAMPLES---
Input: [1,5,3,9,2] → Output: 9
Input: [-1,-5,-3] → Output: -1
Input: [42] → Output: 42
---STARTER---
function findMax(arr) {
  // Your code here
}',
  'easy', 35, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function findMax(arr) {\n  // Your code here\n}',
  '[
    {"input": "findMax([1,5,3,9,2])", "expected_output": "9", "description": "Positive numbers"},
    {"input": "findMax([-1,-5,-3])", "expected_output": "-1", "description": "Negative numbers"},
    {"input": "findMax([42])", "expected_output": "42", "description": "Single element"},
    {"input": "findMax([0,0,0])", "expected_output": "0", "description": "All zeros"},
    {"input": "findMax([3,3,3])", "expected_output": "3", "description": "All same"}
  ]'::jsonb
),
(
  'Remove Duplicates',
  'Given a sorted array, remove the duplicates in-place such that each element appears only once and return the new array.
---EXAMPLES---
Input: [1,1,2] → Output: [1,2]
Input: [0,0,1,1,1,2,2,3,3,4] → Output: [0,1,2,3,4]
---STARTER---
function removeDuplicates(nums) {
  // Your code here
}',
  'easy', 45, 1, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function removeDuplicates(nums) {\n  // Your code here\n}',
  '[
    {"input": "removeDuplicates([1,1,2])", "expected_output": "[1,2]", "description": "Simple duplicates"},
    {"input": "removeDuplicates([0,0,1,1,1,2,2,3,3,4])", "expected_output": "[0,1,2,3,4]", "description": "Many duplicates"},
    {"input": "removeDuplicates([1,2,3])", "expected_output": "[1,2,3]", "description": "No duplicates"},
    {"input": "removeDuplicates([5,5,5,5])", "expected_output": "[5]", "description": "All same"}
  ]'::jsonb
),

-- ============================================================
-- EASY MAIN QUESTS (available anytime)
-- ============================================================

(
  'Valid Parentheses',
  'Given a string containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.
---EXAMPLES---
Input: "()" → Output: true
Input: "()[]{}" → Output: true
Input: "(]" → Output: false
---STARTER---
function isValid(s) {
  // Your code here
}',
  'easy', 55, 1, 'main',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function isValid(s) {\n  // Your code here\n}',
  '[
    {"input": "isValid(\"()\")", "expected_output": "true", "description": "Simple parentheses"},
    {"input": "isValid(\"()[]{}\")", "expected_output": "true", "description": "Mixed valid"},
    {"input": "isValid(\"(]\")", "expected_output": "false", "description": "Mismatched"},
    {"input": "isValid(\"([)]\")", "expected_output": "false", "description": "Wrong order"},
    {"input": "isValid(\"{[]}\")", "expected_output": "true", "description": "Nested valid"}
  ]'::jsonb
),
(
  'Contains Duplicate',
  'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.
---EXAMPLES---
Input: [1,2,3,1] → Output: true
Input: [1,2,3,4] → Output: false
Input: [1,1,1,3,3,4,3,2,4,2] → Output: true
---STARTER---
function containsDuplicate(nums) {
  // Your code here
}',
  'easy', 45, 1, 'main',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function containsDuplicate(nums) {\n  // Your code here\n}',
  '[
    {"input": "containsDuplicate([1,2,3,1])", "expected_output": "true", "description": "Has duplicate"},
    {"input": "containsDuplicate([1,2,3,4])", "expected_output": "false", "description": "All unique"},
    {"input": "containsDuplicate([1,1,1,3,3,4,3,2,4,2])", "expected_output": "true", "description": "Many duplicates"},
    {"input": "containsDuplicate([])", "expected_output": "false", "description": "Empty array"}
  ]'::jsonb
),

-- ============================================================
-- MEDIUM DAILY QUESTS (Levels 5-15)
-- ============================================================

(
  'Binary Search',
  'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1. You must write an algorithm with O(log n) runtime complexity.
---EXAMPLES---
Input: nums = [-1,0,3,5,9,12], target = 9 → Output: 4
Input: nums = [-1,0,3,5,9,12], target = 2 → Output: -1
---STARTER---
function binarySearch(nums, target) {
  // Your code here
}',
  'medium', 75, 2, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function binarySearch(nums, target) {\n  // Your code here\n}',
  '[
    {"input": "binarySearch([-1,0,3,5,9,12], 9)", "expected_output": "4", "description": "Found in array"},
    {"input": "binarySearch([-1,0,3,5,9,12], 2)", "expected_output": "-1", "description": "Not found"},
    {"input": "binarySearch([5], 5)", "expected_output": "0", "description": "Single element found"},
    {"input": "binarySearch([1,3,5,7,9], 1)", "expected_output": "0", "description": "First element"},
    {"input": "binarySearch([1,3,5,7,9], 9)", "expected_output": "4", "description": "Last element"}
  ]'::jsonb
),
(
  'Find Duplicates',
  'Given an array of integers, return an array of all elements that appear more than once. Return them in the order they first appear as duplicates.
---EXAMPLES---
Input: [4,3,2,7,8,2,3,1] → Output: [2,3]
Input: [1,1,2] → Output: [1]
Input: [1] → Output: []
---STARTER---
function findDuplicates(nums) {
  // Your code here
}',
  'medium', 70, 2, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function findDuplicates(nums) {\n  // Your code here\n}',
  '[
    {"input": "findDuplicates([4,3,2,7,8,2,3,1])", "expected_output": "[2,3]", "description": "Two duplicates"},
    {"input": "findDuplicates([1,1,2])", "expected_output": "[1]", "description": "One duplicate"},
    {"input": "findDuplicates([1])", "expected_output": "[]", "description": "No duplicates"},
    {"input": "findDuplicates([1,1,1])", "expected_output": "[1]", "description": "Triple same"}
  ]'::jsonb
),
(
  'Maximum Subarray',
  'Given an integer array nums, find the subarray with the largest sum, and return its sum.
---EXAMPLES---
Input: [-2,1,-3,4,-1,2,1,-5,4] → Output: 6 (subarray [4,-1,2,1])
Input: [1] → Output: 1
Input: [5,4,-1,7,8] → Output: 23
---STARTER---
function maxSubArray(nums) {
  // Your code here
}',
  'medium', 80, 2, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function maxSubArray(nums) {\n  // Your code here\n}',
  '[
    {"input": "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", "expected_output": "6", "description": "Mixed array"},
    {"input": "maxSubArray([1])", "expected_output": "1", "description": "Single element"},
    {"input": "maxSubArray([5,4,-1,7,8])", "expected_output": "23", "description": "Mostly positive"},
    {"input": "maxSubArray([-1])", "expected_output": "-1", "description": "Single negative"},
    {"input": "maxSubArray([-2,-1])", "expected_output": "-1", "description": "All negative"}
  ]'::jsonb
),
(
  'Merge Sorted Arrays',
  'Given two sorted integer arrays, merge them into a single sorted array and return it.
---EXAMPLES---
Input: [1,2,4], [1,3,4] → Output: [1,1,2,3,4,4]
Input: [1], [] → Output: [1]
---STARTER---
function mergeSorted(arr1, arr2) {
  // Your code here
}',
  'medium', 70, 2, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function mergeSorted(arr1, arr2) {\n  // Your code here\n}',
  '[
    {"input": "mergeSorted([1,2,4], [1,3,4])", "expected_output": "[1,1,2,3,4,4]", "description": "Equal length"},
    {"input": "mergeSorted([1], [])", "expected_output": "[1]", "description": "One empty"},
    {"input": "mergeSorted([], [])", "expected_output": "[]", "description": "Both empty"},
    {"input": "mergeSorted([1,3,5], [2,4,6])", "expected_output": "[1,2,3,4,5,6]", "description": "Interleaved"},
    {"input": "mergeSorted([1,1], [1,1])", "expected_output": "[1,1,1,1]", "description": "All same"}
  ]'::jsonb
),
(
  'Anagram Check',
  'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses all original letters exactly once.
---EXAMPLES---
Input: "anagram", "nagaram" → Output: true
Input: "rat", "car" → Output: false
---STARTER---
function isAnagram(s, t) {
  // Your code here
}',
  'medium', 65, 2, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function isAnagram(s, t) {\n  // Your code here\n}',
  '[
    {"input": "isAnagram(\"anagram\", \"nagaram\")", "expected_output": "true", "description": "Valid anagram"},
    {"input": "isAnagram(\"rat\", \"car\")", "expected_output": "false", "description": "Not anagram"},
    {"input": "isAnagram(\"a\", \"a\")", "expected_output": "true", "description": "Single char"},
    {"input": "isAnagram(\"ab\", \"a\")", "expected_output": "false", "description": "Different lengths"},
    {"input": "isAnagram(\"\", \"\")", "expected_output": "true", "description": "Both empty"}
  ]'::jsonb
),

-- ============================================================
-- MEDIUM MAIN QUESTS
-- ============================================================

(
  'Longest Substring Without Repeating',
  'Given a string s, find the length of the longest substring without repeating characters.
---EXAMPLES---
Input: "abcabcbb" → Output: 3 (abc)
Input: "bbbbb" → Output: 1
Input: "pwwkew" → Output: 3 (wke)
---STARTER---
function lengthOfLongestSubstring(s) {
  // Your code here
}',
  'medium', 85, 2, 'main',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function lengthOfLongestSubstring(s) {\n  // Your code here\n}',
  '[
    {"input": "lengthOfLongestSubstring(\"abcabcbb\")", "expected_output": "3", "description": "Repeating abc"},
    {"input": "lengthOfLongestSubstring(\"bbbbb\")", "expected_output": "1", "description": "All same"},
    {"input": "lengthOfLongestSubstring(\"pwwkew\")", "expected_output": "3", "description": "wke substring"},
    {"input": "lengthOfLongestSubstring(\"\")", "expected_output": "0", "description": "Empty string"},
    {"input": "lengthOfLongestSubstring(\"abcdef\")", "expected_output": "6", "description": "All unique"}
  ]'::jsonb
),
(
  'Group Anagrams',
  'Given an array of strings, group the anagrams together. You can return the answer in any order. Sort each group alphabetically.
---EXAMPLES---
Input: ["eat","tea","tan","ate","nat","bat"] → Output: [["ate","eat","tea"],["bat"],["nat","tan"]]
---STARTER---
function groupAnagrams(strs) {
  // Your code here
}',
  'medium', 90, 2, 'main',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function groupAnagrams(strs) {\n  // Your code here\n}',
  '[
    {"input": "JSON.stringify(groupAnagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]).map(g=>g.sort()).sort((a,b)=>a[0].localeCompare(b[0])))", "expected_output": "[[\"ate\",\"eat\",\"tea\"],[\"bat\"],[\"nat\",\"tan\"]]", "description": "Standard grouping"},
    {"input": "JSON.stringify(groupAnagrams([\"\"]).map(g=>g.sort()))", "expected_output": "[[\"\"]]", "description": "Empty string"},
    {"input": "JSON.stringify(groupAnagrams([\"a\"]).map(g=>g.sort()))", "expected_output": "[[\"a\"]]", "description": "Single char"}
  ]'::jsonb
),
(
  'Product of Array Except Self',
  'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Do not use division.
---EXAMPLES---
Input: [1,2,3,4] → Output: [24,12,8,6]
Input: [-1,1,0,-3,3] → Output: [0,0,9,0,0]
---STARTER---
function productExceptSelf(nums) {
  // Your code here
}',
  'medium', 90, 2, 'main',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function productExceptSelf(nums) {\n  // Your code here\n}',
  '[
    {"input": "productExceptSelf([1,2,3,4])", "expected_output": "[24,12,8,6]", "description": "Basic case"},
    {"input": "productExceptSelf([-1,1,0,-3,3])", "expected_output": "[0,0,9,0,0]", "description": "With zero"},
    {"input": "productExceptSelf([2,2,2])", "expected_output": "[4,4,4]", "description": "All same"},
    {"input": "productExceptSelf([1,1])", "expected_output": "[1,1]", "description": "Two ones"}
  ]'::jsonb
),

-- ============================================================
-- HARD DAILY QUESTS (Levels 15+)
-- ============================================================

(
  'Longest Increasing Subsequence',
  'Given an integer array nums, return the length of the longest strictly increasing subsequence.
---EXAMPLES---
Input: [10,9,2,5,3,7,101,18] → Output: 4 (e.g. [2,3,7,101])
Input: [0,1,0,3,2,3] → Output: 4
Input: [7,7,7,7,7,7,7] → Output: 1
---STARTER---
function lengthOfLIS(nums) {
  // Your code here
}',
  'hard', 120, 3, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function lengthOfLIS(nums) {\n  // Your code here\n}',
  '[
    {"input": "lengthOfLIS([10,9,2,5,3,7,101,18])", "expected_output": "4", "description": "Standard case"},
    {"input": "lengthOfLIS([0,1,0,3,2,3])", "expected_output": "4", "description": "Multiple subsequences"},
    {"input": "lengthOfLIS([7,7,7,7,7,7,7])", "expected_output": "1", "description": "All same"},
    {"input": "lengthOfLIS([1,2,3,4,5])", "expected_output": "5", "description": "Already sorted"},
    {"input": "lengthOfLIS([5,4,3,2,1])", "expected_output": "1", "description": "Reverse sorted"}
  ]'::jsonb
),
(
  'Trapping Rain Water',
  'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.
---EXAMPLES---
Input: [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6
Input: [4,2,0,3,2,5] → Output: 9
---STARTER---
function trap(height) {
  // Your code here
}',
  'hard', 130, 3, 'daily',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function trap(height) {\n  // Your code here\n}',
  '[
    {"input": "trap([0,1,0,2,1,0,1,3,2,1,2,1])", "expected_output": "6", "description": "Classic case"},
    {"input": "trap([4,2,0,3,2,5])", "expected_output": "9", "description": "Valley"},
    {"input": "trap([1,2,3,4,5])", "expected_output": "0", "description": "Ascending - no trap"},
    {"input": "trap([5,4,3,2,1])", "expected_output": "0", "description": "Descending - no trap"},
    {"input": "trap([3,0,3])", "expected_output": "3", "description": "Simple valley"}
  ]'::jsonb
),

-- ============================================================
-- HARD MAIN QUESTS
-- ============================================================

(
  'Minimum Window Substring',
  'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included. Return "" if no such window exists.
---EXAMPLES---
Input: s = "ADOBECODEBANC", t = "ABC" → Output: "BANC"
Input: s = "a", t = "a" → Output: "a"
Input: s = "a", t = "aa" → Output: ""
---STARTER---
function minWindow(s, t) {
  // Your code here
}',
  'hard', 140, 3, 'main',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function minWindow(s, t) {\n  // Your code here\n}',
  '[
    {"input": "minWindow(\"ADOBECODEBANC\", \"ABC\")", "expected_output": "BANC", "description": "Standard case"},
    {"input": "minWindow(\"a\", \"a\")", "expected_output": "a", "description": "Single char match"},
    {"input": "minWindow(\"a\", \"aa\")", "expected_output": "", "description": "Impossible"},
    {"input": "minWindow(\"abc\", \"ac\")", "expected_output": "abc", "description": "Full string needed"}
  ]'::jsonb
),
(
  'Serialize and Deserialize BST',
  'Design functions to serialize a binary search tree (BST) as an array (level-order) and deserialize it back. Use null for missing nodes. For this quest, implement insert + inorder traversal to verify.
---EXAMPLES---
Input: insert values [5,3,7,1,4] then inorder → Output: [1,3,4,5,7]
---STARTER---
function createBST(values) {
  // Build a BST from array of values
  // Return inorder traversal as array
}',
  'hard', 150, 3, 'main',
  (SELECT id FROM niches WHERE name = 'DSA'),
  'function createBST(values) {\n  // Build a BST from array of values\n  // Return inorder traversal as array\n}',
  '[
    {"input": "createBST([5,3,7,1,4])", "expected_output": "[1,3,4,5,7]", "description": "Standard BST"},
    {"input": "createBST([1,2,3])", "expected_output": "[1,2,3]", "description": "Ascending insert"},
    {"input": "createBST([3,1,2])", "expected_output": "[1,2,3]", "description": "Mixed insert"},
    {"input": "createBST([1])", "expected_output": "[1]", "description": "Single node"}
  ]'::jsonb
);

-- ============================================================
-- UPDATE EXISTING BOSS QUESTS WITH TEST CASES
-- ============================================================

-- Climbing Stairs boss
UPDATE quests
SET test_cases = '[
  {"input": "climbStairs(2)", "expected_output": "2", "description": "2 steps: (1+1) or (2)"},
  {"input": "climbStairs(3)", "expected_output": "3", "description": "3 steps: (1+1+1), (1+2), (2+1)"},
  {"input": "climbStairs(4)", "expected_output": "5", "description": "4 steps"},
  {"input": "climbStairs(5)", "expected_output": "8", "description": "5 steps"},
  {"input": "climbStairs(1)", "expected_output": "1", "description": "1 step"}
]'::jsonb,
starter_code = 'function climbStairs(n) {\n  // Your code here\n}',
description = 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
---EXAMPLES---
Input: n = 2 → Output: 2 (1+1 or 2)
Input: n = 3 → Output: 3 (1+1+1, 1+2, 2+1)
---STARTER---
function climbStairs(n) {
  // Your code here
}'
WHERE title LIKE '%Climbing Stairs%' AND quest_type = 'boss';

-- Find Missing Number boss
UPDATE quests
SET test_cases = '[
  {"input": "missingNumber([3,0,1])", "expected_output": "2", "description": "Missing 2"},
  {"input": "missingNumber([0,1])", "expected_output": "2", "description": "Missing 2 from 0-2"},
  {"input": "missingNumber([9,6,4,2,3,5,7,0,1])", "expected_output": "8", "description": "Missing 8"},
  {"input": "missingNumber([0])", "expected_output": "1", "description": "Missing 1 from 0-1"}
]'::jsonb,
starter_code = 'function missingNumber(nums) {\n  // Your code here\n}',
description = 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.
---EXAMPLES---
Input: [3,0,1] → Output: 2
Input: [0,1] → Output: 2
Input: [9,6,4,2,3,5,7,0,1] → Output: 8
---STARTER---
function missingNumber(nums) {
  // Your code here
}'
WHERE title LIKE '%Missing Number%' AND quest_type = 'boss';

-- Move Zeroes boss
UPDATE quests
SET test_cases = '[
  {"input": "moveZeroes([0,1,0,3,12])", "expected_output": "[1,3,12,0,0]", "description": "Standard case"},
  {"input": "moveZeroes([0])", "expected_output": "[0]", "description": "Single zero"},
  {"input": "moveZeroes([1,2,3])", "expected_output": "[1,2,3]", "description": "No zeroes"},
  {"input": "moveZeroes([0,0,1])", "expected_output": "[1,0,0]", "description": "Two zeroes at start"}
]'::jsonb,
starter_code = 'function moveZeroes(nums) {\n  // Your code here\n  // Return the modified array\n}',
description = 'Given an integer array nums, move all 0''s to the end of it while maintaining the relative order of the non-zero elements. Return the modified array.
---EXAMPLES---
Input: [0,1,0,3,12] → Output: [1,3,12,0,0]
Input: [0] → Output: [0]
---STARTER---
function moveZeroes(nums) {
  // Your code here
  // Return the modified array
}'
WHERE title LIKE '%Move Zeroes%' AND quest_type = 'boss';

-- Rotate Array boss
UPDATE quests
SET test_cases = '[
  {"input": "rotateArray([1,2,3,4,5,6,7], 3)", "expected_output": "[5,6,7,1,2,3,4]", "description": "Rotate by 3"},
  {"input": "rotateArray([-1,-100,3,99], 2)", "expected_output": "[3,99,-1,-100]", "description": "Rotate by 2"},
  {"input": "rotateArray([1,2], 1)", "expected_output": "[2,1]", "description": "Rotate by 1"},
  {"input": "rotateArray([1], 0)", "expected_output": "[1]", "description": "No rotation"},
  {"input": "rotateArray([1,2,3], 4)", "expected_output": "[3,1,2]", "description": "k > length"}
]'::jsonb,
starter_code = 'function rotateArray(nums, k) {\n  // Your code here\n  // Return the rotated array\n}',
description = 'Given an integer array nums, rotate the array to the right by k steps and return it.
---EXAMPLES---
Input: nums = [1,2,3,4,5,6,7], k = 3 → Output: [5,6,7,1,2,3,4]
Input: nums = [-1,-100,3,99], k = 2 → Output: [3,99,-1,-100]
---STARTER---
function rotateArray(nums, k) {
  // Your code here
  // Return the rotated array
}'
WHERE title LIKE '%Rotate Array%' AND quest_type = 'boss';

-- Verify results
SELECT quest_type, difficulty, title, 
       CASE WHEN test_cases IS NOT NULL THEN 'YES' ELSE 'NO' END as has_tests,
       CASE WHEN starter_code IS NOT NULL THEN 'YES' ELSE 'NO' END as has_starter
FROM quests 
WHERE quest_type != 'fitness'
ORDER BY quest_type, difficulty, title;
