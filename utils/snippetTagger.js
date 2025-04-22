/**
 * Auto-tag snippets based on content patterns
 * @param {string} code - The code snippet
 * @param {string} language - The programming language
 * @returns {string[]} - Array of auto-generated tags
 */
const autoTagSnippet = (code, language) => {
  const tags = [];
  const lowerCode = code.toLowerCase();

  // Language-agnostic patterns
  if (lowerCode.includes('console.log') || lowerCode.includes('print(') || lowerCode.includes('printf(')) {
    tags.push('debugging');
  }

  if (lowerCode.includes('try') && lowerCode.includes('catch')) {
    tags.push('error handling');
  }

  // JavaScript/TypeScript specific patterns
  if (language === 'javascript' || language === 'typescript') {
    if (lowerCode.includes('for (') || lowerCode.includes('while (')) {
      tags.push('loop');
    }

    if (lowerCode.includes('.map(') || lowerCode.includes('.filter(') || lowerCode.includes('.reduce(')) {
      tags.push('array ops');
    }

    if (lowerCode.includes('fetch(') || lowerCode.includes('axios.') || lowerCode.includes('xmlhttprequest')) {
      tags.push('api');
    }

    if (lowerCode.includes('function') || lowerCode.includes('=>')) {
      tags.push('function');
    }

    if (lowerCode.includes('class ')) {
      tags.push('class');
    }
  }

  // Python specific patterns
  if (language === 'python') {
    if (lowerCode.includes('for ') || lowerCode.includes('while ')) {
      tags.push('loop');
    }

    if (lowerCode.includes('def ')) {
      tags.push('function');
    }

    if (lowerCode.includes('class ')) {
      tags.push('class');
    }

    if (lowerCode.includes('requests.') || lowerCode.includes('urllib')) {
      tags.push('api');
    }
  }

  // Add more language-specific patterns as needed

  return tags;
};

module.exports = { autoTagSnippet };