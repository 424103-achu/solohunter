-- =============================================
-- REPLACE ALL MAIN/BOSS/SPECIAL WITH SIMPLE DSA
-- =============================================

-- First, delete old main/boss/special quests (no submissions yet so safe)
DELETE FROM quests WHERE quest_type IN ('main', 'boss', 'special');

-- =============================================
-- MAIN QUESTS — Classic DSA problems (progressive)
-- =============================================

-- Easy Main Quests
INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type) VALUES

('The First Gate: Two Sum', E'Given an array of numbers and a target, return the indices of the two numbers that add up to the target.\n\n---EXAMPLES---\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] (because 2 + 7 = 9)\n\nInput: nums = [3, 2, 4], target = 6\nOutput: [1, 2]\n\n---STARTER---\nfunction twoSum(nums, target) {\n  // Your code here\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));\nconsole.log(twoSum([3, 2, 4], 6));', 'easy', 25, 1, 'main'),

('Shadow Extract: Reverse String', E'Reverse a string without using the built-in reverse method.\n\n---EXAMPLES---\nInput: "hunter"\nOutput: "retnuh"\n\nInput: "Solo Leveling"\nOutput: "gnileveL oloS"\n\n---STARTER---\nfunction reverseString(str) {\n  // Your code here\n}\n\nconsole.log(reverseString("hunter"));\nconsole.log(reverseString("Solo Leveling"));', 'easy', 20, 1, 'main'),

('Hunter''s Toolkit: Palindrome Check', E'Check if a given string is a palindrome (reads the same forwards and backwards). Ignore case and non-alphanumeric characters.\n\n---EXAMPLES---\nInput: "racecar"\nOutput: true\n\nInput: "A man, a plan, a canal: Panama"\nOutput: true\n\nInput: "hello"\nOutput: false\n\n---STARTER---\nfunction isPalindrome(str) {\n  // Your code here\n}\n\nconsole.log(isPalindrome("racecar"));\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));\nconsole.log(isPalindrome("hello"));', 'easy', 20, 1, 'main'),

('Awakening: FizzBuzz', E'Print numbers from 1 to n. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".\n\n---EXAMPLES---\nInput: 15\nOutput: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]\n\n---STARTER---\nfunction fizzBuzz(n) {\n  // Your code here\n}\n\nconsole.log(fizzBuzz(15));', 'easy', 20, 1, 'main');

-- Medium Main Quests
INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type) VALUES

('Dungeon Crawler: Valid Parentheses', E'Given a string containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string has valid (balanced) brackets.\n\n---EXAMPLES---\nInput: "()[]{}"\nOutput: true\n\nInput: "(]"\nOutput: false\n\nInput: "([{}])"\nOutput: true\n\n---STARTER---\nfunction isValid(s) {\n  // Hint: use a stack\n}\n\nconsole.log(isValid("()[]{}"));\nconsole.log(isValid("(]"));\nconsole.log(isValid("([{}])"));', 'medium', 40, 2, 'main'),

('Raid Boss Prep: Merge Sorted Arrays', E'Merge two sorted arrays into one sorted array.\n\n---EXAMPLES---\nInput: [1, 3, 5], [2, 4, 6]\nOutput: [1, 2, 3, 4, 5, 6]\n\nInput: [1, 2, 3], [4, 5]\nOutput: [1, 2, 3, 4, 5]\n\n---STARTER---\nfunction mergeSorted(arr1, arr2) {\n  // Your code here\n}\n\nconsole.log(mergeSorted([1, 3, 5], [2, 4, 6]));\nconsole.log(mergeSorted([1, 2, 3], [4, 5]));', 'medium', 40, 2, 'main'),

('Shadow Army: Binary Search', E'Implement binary search on a sorted array. Return the index of the target element, or -1 if not found.\n\n---EXAMPLES---\nInput: arr = [1, 3, 5, 7, 9, 11], target = 7\nOutput: 3\n\nInput: arr = [2, 4, 6, 8], target = 5\nOutput: -1\n\n---STARTER---\nfunction binarySearch(arr, target) {\n  // Your code here\n}\n\nconsole.log(binarySearch([1, 3, 5, 7, 9, 11], 7));\nconsole.log(binarySearch([2, 4, 6, 8], 5));', 'medium', 45, 2, 'main'),

('The Red Gate: Anagram Check', E'Given two strings, check if they are anagrams of each other (contain the same characters with the same frequency).\n\n---EXAMPLES---\nInput: "listen", "silent"\nOutput: true\n\nInput: "hello", "world"\nOutput: false\n\nInput: "Dormitory", "dirty room"\nOutput: true (ignore spaces and case)\n\n---STARTER---\nfunction isAnagram(str1, str2) {\n  // Your code here\n}\n\nconsole.log(isAnagram("listen", "silent"));\nconsole.log(isAnagram("hello", "world"));\nconsole.log(isAnagram("Dormitory", "dirty room"));', 'medium', 40, 2, 'main');

-- Hard Main Quests (still doable — classic DSA, not system design)
INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type) VALUES

('S-Rank Trial: Longest Substring', E'Find the length of the longest substring without repeating characters.\n\n---EXAMPLES---\nInput: "abcabcbb"\nOutput: 3 (the substring is "abc")\n\nInput: "bbbbb"\nOutput: 1\n\nInput: "pwwkew"\nOutput: 3 (the substring is "wke")\n\n---STARTER---\nfunction lengthOfLongestSubstring(s) {\n  // Hint: use sliding window technique\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb"));\nconsole.log(lengthOfLongestSubstring("bbbbb"));\nconsole.log(lengthOfLongestSubstring("pwwkew"));', 'hard', 70, 3, 'main'),

('National Level: Flatten Nested Array', E'Flatten a deeply nested array into a single-level array. Do NOT use Array.flat().\n\n---EXAMPLES---\nInput: [1, [2, [3, [4]], 5]]\nOutput: [1, 2, 3, 4, 5]\n\nInput: [[1, 2], [3, [4, [5, 6]]]]\nOutput: [1, 2, 3, 4, 5, 6]\n\n---STARTER---\nfunction flatten(arr) {\n  // Your code here (use recursion)\n}\n\nconsole.log(flatten([1, [2, [3, [4]], 5]]));\nconsole.log(flatten([[1, 2], [3, [4, [5, 6]]]]));', 'hard', 65, 3, 'main'),

('Monarch''s Domain: Max Subarray Sum', E'Find the contiguous subarray with the largest sum (Kadane''s Algorithm).\n\n---EXAMPLES---\nInput: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6 (subarray [4, -1, 2, 1])\n\nInput: [1, 2, 3, -2, 5]\nOutput: 9\n\nInput: [-1, -2, -3]\nOutput: -1\n\n---STARTER---\nfunction maxSubarraySum(arr) {\n  // Your code here\n}\n\nconsole.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));\nconsole.log(maxSubarraySum([1, 2, 3, -2, 5]));\nconsole.log(maxSubarraySum([-1, -2, -3]));', 'hard', 70, 3, 'main'),

('Shadow Sovereign: Group Anagrams', E'Given an array of strings, group the anagrams together.\n\n---EXAMPLES---\nInput: ["eat", "tea", "tan", "ate", "nat", "bat"]\nOutput: [["eat","tea","ate"], ["tan","nat"], ["bat"]]\n\nInput: ["abc", "bca", "xyz", "zyx"]\nOutput: [["abc","bca"], ["xyz","zyx"]]\n\n---STARTER---\nfunction groupAnagrams(strs) {\n  // Your code here\n}\n\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));\nconsole.log(groupAnagrams(["abc","bca","xyz","zyx"]));', 'hard', 70, 3, 'main');


-- =============================================
-- BOSS QUESTS — Harder DSA but still doable
-- =============================================

INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type) VALUES

('💀 Igris the Bloodred: Climbing Stairs', E'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?\n\n---EXAMPLES---\nInput: 2\nOutput: 2 (1+1 or 2)\n\nInput: 3\nOutput: 3 (1+1+1, 1+2, 2+1)\n\nInput: 5\nOutput: 8\n\n---STARTER---\nfunction climbStairs(n) {\n  // Hint: think about the pattern — it is like Fibonacci!\n}\n\nconsole.log(climbStairs(2));\nconsole.log(climbStairs(3));\nconsole.log(climbStairs(5));', 'medium', 100, 4, 'boss'),

('💀 Tusk the Ice Elf: Find Missing Number', E'Given an array containing n distinct numbers from 0 to n, find the one number that is missing.\n\n---EXAMPLES---\nInput: [3, 0, 1]\nOutput: 2\n\nInput: [0, 1, 2, 4, 5]\nOutput: 3\n\nInput: [9,6,4,2,3,5,7,0,1]\nOutput: 8\n\n---STARTER---\nfunction missingNumber(nums) {\n  // Hint: use math — sum of 0..n minus sum of array\n}\n\nconsole.log(missingNumber([3, 0, 1]));\nconsole.log(missingNumber([0, 1, 2, 4, 5]));\nconsole.log(missingNumber([9,6,4,2,3,5,7,0,1]));', 'medium', 100, 4, 'boss'),

('💀 Baran the White Flame: Move Zeroes', E'Move all zeroes in an array to the end while keeping the order of non-zero elements. Do it in-place.\n\n---EXAMPLES---\nInput: [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]\n\nInput: [0, 0, 1]\nOutput: [1, 0, 0]\n\nInput: [4, 0, 5, 0, 3]\nOutput: [4, 5, 3, 0, 0]\n\n---STARTER---\nfunction moveZeroes(nums) {\n  // Modify the array in-place\n}\n\nlet arr1 = [0, 1, 0, 3, 12];\nmoveZeroes(arr1);\nconsole.log(arr1);\n\nlet arr2 = [4, 0, 5, 0, 3];\nmoveZeroes(arr2);\nconsole.log(arr2);', 'medium', 100, 4, 'boss'),

('💀 The Architect: Rotate Array', E'Rotate an array to the right by k steps. Do it in-place.\n\n---EXAMPLES---\nInput: nums = [1,2,3,4,5,6,7], k = 3\nOutput: [5,6,7,1,2,3,4]\n\nInput: nums = [-1,-100,3,99], k = 2\nOutput: [3,99,-1,-100]\n\n---STARTER---\nfunction rotateArray(nums, k) {\n  // Hint: reverse technique works well\n}\n\nlet arr1 = [1,2,3,4,5,6,7];\nrotateArray(arr1, 3);\nconsole.log(arr1);\n\nlet arr2 = [-1,-100,3,99];\nrotateArray(arr2, 2);\nconsole.log(arr2);', 'medium', 120, 5, 'boss');


-- =============================================
-- SPECIAL QUESTS — Fun but simple DSA twists
-- =============================================

INSERT INTO quests (title, description, difficulty, xp_reward, skill_reward, quest_type) VALUES

('🌟 Hunter Exam: Count Vowels', E'Count the number of vowels (a, e, i, o, u) in a given string. Case insensitive.\n\n---EXAMPLES---\nInput: "Solo Leveling"\nOutput: 5\n\nInput: "HELLO WORLD"\nOutput: 3\n\nInput: "rhythm"\nOutput: 0\n\n---STARTER---\nfunction countVowels(str) {\n  // Your code here\n}\n\nconsole.log(countVowels("Solo Leveling"));\nconsole.log(countVowels("HELLO WORLD"));\nconsole.log(countVowels("rhythm"));', 'easy', 25, 1, 'special'),

('🌟 Dungeon Key: Title Case', E'Convert a string to title case — capitalize the first letter of each word.\n\n---EXAMPLES---\nInput: "the shadow monarch rises"\nOutput: "The Shadow Monarch Rises"\n\nInput: "hello world"\nOutput: "Hello World"\n\n---STARTER---\nfunction titleCase(str) {\n  // Your code here\n}\n\nconsole.log(titleCase("the shadow monarch rises"));\nconsole.log(titleCase("hello world"));', 'easy', 25, 1, 'special'),

('🌟 Shadow Exchange: Find Duplicates', E'Given an array of numbers, return an array of numbers that appear more than once.\n\n---EXAMPLES---\nInput: [1, 2, 3, 2, 4, 3, 5]\nOutput: [2, 3]\n\nInput: [1, 1, 1, 2, 2, 3]\nOutput: [1, 2]\n\nInput: [1, 2, 3]\nOutput: []\n\n---STARTER---\nfunction findDuplicates(arr) {\n  // Your code here\n}\n\nconsole.log(findDuplicates([1, 2, 3, 2, 4, 3, 5]));\nconsole.log(findDuplicates([1, 1, 1, 2, 2, 3]));\nconsole.log(findDuplicates([1, 2, 3]));', 'medium', 40, 2, 'special'),

('🌟 Monarch''s Memory: Array Intersection', E'Find the common elements between two arrays.\n\n---EXAMPLES---\nInput: [1, 2, 3, 4], [3, 4, 5, 6]\nOutput: [3, 4]\n\nInput: [1, 2], [3, 4]\nOutput: []\n\nInput: ["a", "b", "c"], ["b", "c", "d"]\nOutput: ["b", "c"]\n\n---STARTER---\nfunction intersection(arr1, arr2) {\n  // Your code here\n}\n\nconsole.log(intersection([1, 2, 3, 4], [3, 4, 5, 6]));\nconsole.log(intersection([1, 2], [3, 4]));\nconsole.log(intersection(["a", "b", "c"], ["b", "c", "d"]));', 'medium', 40, 2, 'special'),

('🌟 System Window: Sum of Digits', E'Given a number, return the sum of its digits. Handle negative numbers too.\n\n---EXAMPLES---\nInput: 123\nOutput: 6\n\nInput: -456\nOutput: 15\n\nInput: 0\nOutput: 0\n\n---STARTER---\nfunction sumOfDigits(num) {\n  // Your code here\n}\n\nconsole.log(sumOfDigits(123));\nconsole.log(sumOfDigits(-456));\nconsole.log(sumOfDigits(0));', 'easy', 20, 1, 'special'),

('🌟 Arise: Chunk Array', E'Split an array into chunks of a given size.\n\n---EXAMPLES---\nInput: [1,2,3,4,5], size = 2\nOutput: [[1,2], [3,4], [5]]\n\nInput: [1,2,3,4,5,6], size = 3\nOutput: [[1,2,3], [4,5,6]]\n\n---STARTER---\nfunction chunkArray(arr, size) {\n  // Your code here\n}\n\nconsole.log(chunkArray([1,2,3,4,5], 2));\nconsole.log(chunkArray([1,2,3,4,5,6], 3));', 'easy', 25, 2, 'special');
