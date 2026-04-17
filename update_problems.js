const fs = require('fs');
const problems = JSON.parse(fs.readFileSync('data/problems.json'));
const urls = [
  "https://leetcode.com/problems/two-sum/",
  "https://leetcode.com/problems/add-two-numbers/",
  "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  "https://leetcode.com/problems/longest-palindromic-substring/",
  "https://leetcode.com/problems/valid-parentheses/",
  "https://leetcode.com/problems/merge-two-sorted-lists/",
  "https://leetcode.com/problems/maximum-subarray/",
  "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  "https://leetcode.com/problems/word-search/",
  "https://leetcode.com/problems/climbing-stairs/",
  "https://leetcode.com/problems/number-of-islands/"
];
problems.forEach((p, i) => p.leetcodeUrl = urls[i]);
fs.writeFileSync('data/problems.json', JSON.stringify(problems, null, 2));
