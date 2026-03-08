import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
    env: process.env.NODE_ENV || 'development',
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
        jwtSecret: process.env.JWT_SECRET || 'default_secret',
        encryptionKey: process.env.ENCRYPTION_KEY || 'default_encryption_key',
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
