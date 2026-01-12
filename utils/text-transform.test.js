const { getBionicText } = require('./text-transform');

describe('getBionicText', () => {
    test('should return same text for short words (< 3 chars)', () => {
        expect(getBionicText('bi')).toBe('bi');
        expect(getBionicText('a')).toBe('a');
    });

    test('should bold start of medium words', () => {
        // "reading" -> 7 chars. 50% = 3.5 -> 4 chars bolded? Or ceil?
        // Spec says: Math.ceil(word.length * config.boldRatio)
        // 7 * 0.5 = 3.5 -> 4. "read" should be bold.
        const result = getBionicText('reading');
        expect(result).toContain('<strong class="bionic-bold">read</strong>ing');
    });

    test('should bold start of long words', () => {
        // "transformation" -> 14 chars. 14 * 0.5 = 7.
        // "transfo" should be bold.
        const result = getBionicText('transformation');
        expect(result).toContain('<strong class="bionic-bold">transfo</strong>rmation');
    });

    test('should handle multiple words', () => {
        const input = "Bionic reading is faster";
        const result = getBionicText(input);
        // Bionic (6) -> Bio
        // reading (7) -> read
        // is (2) -> is (skip)
        // faster (6) -> fas
        expect(result).toContain('Bio</strong>nic');
        expect(result).toContain('read</strong>ing');
        expect(result).toContain('is');
        expect(result).not.toContain('<strong class="bionic-bold">is</strong>');
        expect(result).toContain('fas</strong>ter');
    });

    test('should preserve punctuation', () => {
        const result = getBionicText("Hello, world!");
        // Hello (5) -> Hel. "Hel</strong>lo,"
        expect(result).toContain('Hel</strong>lo,');
        expect(result).toContain('wor</strong>ld!');
    });

    test('should preserve whitespace', () => {
        const input = "Hello   world";
        const result = getBionicText(input);
        expect(result).toContain('   ');
    });

    test('should skip numbers if configured', () => {
        // default config.skipNumbers is true
        expect(getBionicText('12345')).toBe('12345');
    });

    test('should skip acronyms if configured', () => {
        // default config.skipAcronyms is true
        expect(getBionicText('NASA')).toBe('NASA');
    });
});
