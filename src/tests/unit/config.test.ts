import { config } from '../../config/index';

describe('Configuration', () => {
    it('should have default values', () => {
        expect(config.port).toBeDefined();
        expect(config.env).toBeDefined();
    });

    it('should load environment variables', () => {
        // Amap is the only external credential the server reads.
        expect(config.external.amap.apiKey).toBeDefined();
    });
});
