import { MTRLine, MTRStation } from './types.js';

export const MTR_STATIONS: Record<string, MTRStation> = {
    // Island Line (ISL)
    KET: { code: 'KET', name: { en: 'Kennedy Town', zh: '坚尼地城' } },
    HKU: { code: 'HKU', name: { en: 'HKU', zh: '香港大学' } },
    SYP: { code: 'SYP', name: { en: 'Sai Ying Pun', zh: '西营盘' } },
    SHW: { code: 'SHW', name: { en: 'Sheung Wan', zh: '上环' } },
    CEN: { code: 'CEN', name: { en: 'Central', zh: '中环' } },
    ADM: { code: 'ADM', name: { en: 'Admiralty', zh: '金钟' } },
    WAC: { code: 'WAC', name: { en: 'Wan Chai', zh: '湾仔' } },
    CAB: { code: 'CAB', name: { en: 'Causeway Bay', zh: '铜锣湾' } },
    TIN: { code: 'TIN', name: { en: 'Tin Hau', zh: '天后' } },
    FOH: { code: 'FOH', name: { en: 'Fortress Hill', zh: '炮台山' } },
    NOP: { code: 'NOP', name: { en: 'North Point', zh: '北角' } },
    QUB: { code: 'QUB', name: { en: 'Quarry Bay', zh: '鲗鱼涌' } },
    TAK: { code: 'TAK', name: { en: 'Tai Koo', zh: '太古' } },
    SWH: { code: 'SWH', name: { en: 'Sai Wan Ho', zh: '西湾河' } },
    SKW: { code: 'SKW', name: { en: 'Shau Kei Wan', zh: '筲箕湾' } },
    HFC: { code: 'HFC', name: { en: 'Heng Fa Chuen', zh: '杏花邨' } },
    CHW: { code: 'CHW', name: { en: 'Chai Wan', zh: '柴湾' } },

    // Tsuen Wan Line (TWL) - only listing new stations not in ISL
    TST: { code: 'TST', name: { en: 'Tsim Sha Tsui', zh: '尖沙咀' } },
    JOR: { code: 'JOR', name: { en: 'Jordan', zh: '佐敦' } },
    YMT: { code: 'YMT', name: { en: 'Yau Ma Tei', zh: '油麻地' } },
    MOK: { code: 'MOK', name: { en: 'Mong Kok', zh: '旺角' } },
    PEK: { code: 'PEK', name: { en: 'Prince Edward', zh: '太子' } },
    SSP: { code: 'SSP', name: { en: 'Sham Shui Po', zh: '深水埗' } },
    CSW: { code: 'CSW', name: { en: 'Cheung Sha Wan', zh: '长沙湾' } },
    LCK: { code: 'LCK', name: { en: 'Lai Chi Kok', zh: '荔枝角' } },
    MEF: { code: 'MEF', name: { en: 'Mei Foo', zh: '美孚' } },
    LAK: { code: 'LAK', name: { en: 'Lai King', zh: '荔景' } },
    KWF: { code: 'KWF', name: { en: 'Kwai Fong', zh: '葵芳' } },
    KWH: { code: 'KWH', name: { en: 'Kwai Hing', zh: '葵兴' } },
    TWH: { code: 'TWH', name: { en: 'Tai Wo Hau', zh: '大窝口' } },
    TSW: { code: 'TSW', name: { en: 'Tsuen Wan', zh: '荃湾' } },
};

export const MTR_LINES: Record<string, MTRLine> = {
    ISL: {
        code: 'ISL',
        name: { en: 'Island Line', zh: '港岛线' },
        stations: ['KET', 'HKU', 'SYP', 'SHW', 'CEN', 'ADM', 'WAC', 'CAB', 'TIN', 'FOH', 'NOP', 'QUB', 'TAK', 'SWH', 'SKW', 'HFC', 'CHW'],
        upDest: 'CHW',
        downDest: 'KET',
    },
    TWL: {
        code: 'TWL',
        name: { en: 'Tsuen Wan Line', zh: '荃湾线' },
        stations: ['CEN', 'ADM', 'TST', 'JOR', 'YMT', 'MOK', 'PEK', 'SSP', 'CSW', 'LCK', 'MEF', 'LAK', 'KWF', 'KWH', 'TWH', 'TSW'],
        upDest: 'TSW',
        downDest: 'CEN',
    },
};
