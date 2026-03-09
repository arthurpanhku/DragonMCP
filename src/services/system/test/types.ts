export interface TestResult {
    service: string;
    tool: string;
    status: 'PASS' | 'FAIL';
    message: string;
    duration: number;
}

export interface SystemHealthReport {
    timestamp: string;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    results: TestResult[];
}
