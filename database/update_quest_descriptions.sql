-- Update daily coding quests with examples and starter code

UPDATE quests SET description = E'Implement FizzBuzz for numbers 1-100 with a twist: multiples of 7 also print Buzz.\n- Print "Fizz" for multiples of 3\n- Print "Buzz" for multiples of 5 OR 7\n- Print "FizzBuzz" for multiples of both 3 and (5 or 7)\n- Print the number otherwise\n\n---EXAMPLES---\nInput: 3 → Output: Fizz\nInput: 7 → Output: Buzz\nInput: 21 → Output: FizzBuzz\nInput: 4 → Output: 4\n\n---STARTER---\nfunction fizzBuzz(n) {\n  for (let i = 1; i <= n; i++) {\n    // Your code here\n  }\n}\n\nfizzBuzz(100);'
WHERE title = 'FizzBuzz Classic';

UPDATE quests SET description = E'Check if a given string is a palindrome, ignoring spaces and punctuation.\n\n---EXAMPLES---\nInput: "racecar"\nOutput: true\n\nInput: "A man a plan a canal Panama"\nOutput: true\n\nInput: "hello"\nOutput: false\n\n---STARTER---\nfunction isPalindrome(str) {\n  // Your code here\n}\n\nconsole.log(isPalindrome("racecar"));\nconsole.log(isPalindrome("A man a plan a canal Panama"));'
WHERE title = 'String Palindrome';

UPDATE quests SET description = E'Find two numbers in an array that add up to a target value. Return their indices.\n\n---EXAMPLES---\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)\n\nInput: nums = [3, 2, 4], target = 6\nOutput: [1, 2]\n\n---STARTER---\nfunction twoSum(nums, target) {\n  // Your code here\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));'
WHERE title = 'Two Sum Problem';

UPDATE quests SET description = E'Calculate the sum of both diagonals of a square matrix without double-counting the center element.\n\n---EXAMPLES---\nInput: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: 25 (1+5+9 + 3+5+7 - 5 = 25)\n\nInput: [[1,0],[0,1]]\nOutput: 2\n\n---STARTER---\nfunction diagonalSum(matrix) {\n  // Your code here\n}\n\nconsole.log(diagonalSum([[1,2,3],[4,5,6],[7,8,9]]));'
WHERE title = 'Matrix Diagonal Sum';

UPDATE quests SET description = E'Determine if a string of brackets ()[]{}  is properly balanced. Every opening bracket must have a corresponding closing bracket in the correct order.\n\n---EXAMPLES---\nInput: "()[]{}"\nOutput: true\n\nInput: "([)]"\nOutput: false\n\nInput: "{[()]}"\nOutput: true\n\n---STARTER---\nfunction isBalanced(str) {\n  // Your code here\n}\n\nconsole.log(isBalanced("()[]{}"));\nconsole.log(isBalanced("([)]"));\nconsole.log(isBalanced("{[()]}"));'
WHERE title = 'Balanced Brackets';

UPDATE quests SET description = E'Write a function to flatten a deeply nested array into a single-level array. Do not use Array.flat().\n\n---EXAMPLES---\nInput: [1, [2, [3, [4]], 5]]\nOutput: [1, 2, 3, 4, 5]\n\nInput: [[1, 2], [3, [4, 5]]]\nOutput: [1, 2, 3, 4, 5]\n\n---STARTER---\nfunction flatten(arr) {\n  // Your code here\n}\n\nconsole.log(flatten([1, [2, [3, [4]], 5]]));'
WHERE title = 'Flatten Nested Array';

UPDATE quests SET description = E'Implement insert and search operations for a binary search tree from scratch.\n\n---EXAMPLES---\nOperations: insert(5), insert(3), insert(7), insert(1)\nsearch(3) → true\nsearch(6) → false\n\n---STARTER---\nclass TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nclass BST {\n  constructor() {\n    this.root = null;\n  }\n\n  insert(val) {\n    // Your code here\n  }\n\n  search(val) {\n    // Your code here - return true/false\n  }\n}\n\nconst tree = new BST();\ntree.insert(5);\ntree.insert(3);\ntree.insert(7);\ntree.insert(1);\nconsole.log(tree.search(3)); // true\nconsole.log(tree.search(6)); // false'
WHERE title = 'Binary Search Tree';

UPDATE quests SET description = E'Find the shortest path between two nodes in an unweighted graph using BFS. Return the path as an array of nodes.\n\n---EXAMPLES---\nGraph: { A: [B,C], B: [A,D], C: [A,D], D: [B,C,E], E: [D] }\nInput: start=A, end=E\nOutput: [A, B, D, E] or [A, C, D, E] (length 4)\n\n---STARTER---\nfunction shortestPath(graph, start, end) {\n  // Use BFS - your code here\n}\n\nconst graph = {\n  A: ["B", "C"],\n  B: ["A", "D"],\n  C: ["A", "D"],\n  D: ["B", "C", "E"],\n  E: ["D"]\n};\nconsole.log(shortestPath(graph, "A", "E"));'
WHERE title = 'Graph Shortest Path';

UPDATE quests SET description = E'Implement a Least Recently Used (LRU) cache with O(1) get and put operations.\n\n---EXAMPLES---\ncache = new LRUCache(2)\ncache.put(1, 1)\ncache.put(2, 2)\ncache.get(1)    → 1\ncache.put(3, 3) → evicts key 2\ncache.get(2)    → -1 (not found)\n\n---STARTER---\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    // Your code here\n  }\n\n  get(key) {\n    // Return value or -1 if not found\n  }\n\n  put(key, value) {\n    // Insert/update. Evict LRU if at capacity\n  }\n}\n\nconst cache = new LRUCache(2);\ncache.put(1, 1);\ncache.put(2, 2);\nconsole.log(cache.get(1));  // 1\ncache.put(3, 3);\nconsole.log(cache.get(2));  // -1'
WHERE title = 'LRU Cache';

UPDATE quests SET description = E'Given a list of overlapping intervals, merge them into non-overlapping intervals.\n\n---EXAMPLES---\nInput: [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\n\nInput: [[1,4],[4,5]]\nOutput: [[1,5]]\n\n---STARTER---\nfunction mergeIntervals(intervals) {\n  // Your code here\n}\n\nconsole.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]));'
WHERE title = 'Merge Intervals';

-- Also update the existing coding quest
UPDATE quests SET description = E'Write a function that checks if a number is prime.\n\n---EXAMPLES---\nInput: 7\nOutput: true\n\nInput: 4\nOutput: false\n\nInput: 1\nOutput: false\n\n---STARTER---\nfunction isPrime(n) {\n  // Your code here\n}\n\nconsole.log(isPrime(7));  // true\nconsole.log(isPrime(4));  // false\nconsole.log(isPrime(1));  // false'
WHERE quest_type = 'coding' AND title NOT IN ('Debug the Loop', 'Array Reversal', 'FizzBuzz Classic', 'String Palindrome', 'Two Sum Problem', 'Matrix Diagonal Sum', 'Balanced Brackets', 'Flatten Nested Array', 'Binary Search Tree', 'Graph Shortest Path', 'LRU Cache', 'Merge Intervals');
