
const defaultConfig = {
    boldRatio: 0.5,
    minWordLength: 3,
    boldWeight: 700,
    skipNumbers: true,
    skipAcronyms: true
};

function getBionicText(text, config = defaultConfig) {
    // Merge config with defaults
    const finalConfig = { ...defaultConfig, ...config };

    // Split by whitespace while preserving it
    // The regex (\s+) captures the whitespace as clear tokens
    const tokens = text.split(/(\s+)/);

    return tokens.map(token => {
        // Skip whitespace tokens
        if (/^\s+$/.test(token)) return token;

        // Extract word and surrounding punctuation
        // Match: [prefix non-word][word chars][suffix non-word]
        const match = token.match(/^([^\w]*)(\w+)([^\w]*)$/);
        if (!match) return token;

        const [, prefix, word, suffix] = match;

        // Apply skip rules
        if (word.length < finalConfig.minWordLength) return token;
        if (finalConfig.skipNumbers && /^\d+$/.test(word)) return token;
        if (finalConfig.skipAcronyms && /^[A-Z]+$/.test(word)) return token;

        // Calculate split point
        const splitPoint = Math.ceil(word.length * finalConfig.boldRatio);
        const boldPart = word.slice(0, splitPoint);
        const normalPart = word.slice(splitPoint);

        return `${prefix}<strong class="bionic-bold">${boldPart}</strong>${normalPart}${suffix}`;
    }).join('');
}

// Universal export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getBionicText };
}
if (typeof window !== 'undefined') {
    window.BionicReader = { getBionicText };
}
