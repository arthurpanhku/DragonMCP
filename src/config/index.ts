import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = process.env.NODE_ENV || 'development';

const getSecuritySecret = (name: 'JWT_SECRET' | 'ENCRYPTION_KEY'): string => {
    const value = process.env[name];

    // Fail fast in production so insecure defaults are never used silently.
    if (!value && env === 'production') {
        throw new Error(`${name} is required in production`);
    }

    return value || '';
};

export const config = {
    env,
    port: parseInt(process.env.PORT || '3000', 10),

    supabase: {
        url: process.env.SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || '',
        serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    },

    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD || '',
    },

    security: {
        jwtSecret: getSecuritySecret('JWT_SECRET'),
        encryptionKey: getSecuritySecret('ENCRYPTION_KEY'),
    },

    external: {
        wechat: {
            appId: process.env.WECHAT_APP_ID || '',
            appSecret: process.env.WECHAT_APP_SECRET || '',
        },
        alipay: {
            appId: process.env.ALIPAY_APP_ID || '',
            privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
        },
        amap: {
            apiKey: process.env.AMAP_API_KEY || '',
        },
        baiduMap: {
            ak: process.env.BAIDU_MAP_AK || '',
        },
    },
};
