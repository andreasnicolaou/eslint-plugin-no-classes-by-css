const plugin = require('../index.js');

describe('index.js', () => {
    test('should export rules', () => {
        expect(plugin).toHaveProperty('rules');
        expect(plugin.rules).toHaveProperty('no-classes-by-css');
        expect(typeof plugin.rules['no-classes-by-css']).toBe('object');
        expect(typeof plugin.rules['no-classes-by-css'].create).toBe('function');
    });
});
