export interface RequestLog {
    timestamp: string;
    // method: 'POST'|'GET'|'PUT'|'DELETE';
    method: string;
    url: string;
    statusCode: number;
    durationMs: number;
    ip: string|undefined;
    userId: string;
    userAgent: string|undefined;
    requestBody: any;
    responseSize: string;
    traceId: string
}