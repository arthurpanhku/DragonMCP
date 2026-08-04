import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

const env = process.env.NODE_ENV || 'development';

export const config = {
    env,
    port: parseInt(process.env.PORT || '3000', 10),

    external: {
        amap: {
            apiKey: process.env.AMAP_API_KEY || '',
        },
    },
};
