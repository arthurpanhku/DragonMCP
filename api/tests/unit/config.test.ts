import { config } from '../../config/index';

describe('Configuration', () => {
    it('should have default values', () => {
        expect(config.port).toBeDefined();
        expect(config.env).toBeDefined();
    });

    it('should load environment variables', () => {
        // Assuming .env or default values are set
        expect(config.redis.url).toBeDefined();
        expect(config.security.jwtSecret).toBeDefined();
    });
});
