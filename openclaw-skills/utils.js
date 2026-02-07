/**
 * Obliga API Client for OpenClaw Skills
 * Handles authentication and error logging
 */

const https = require('http'); // Using http for localhost, change to https for prod

const CONFIG = {
    baseUrl: process.env.OBLIGA_API_URL || 'http://localhost:3001/api',
    apiKey: process.env.OBLIGA_API_KEY,
    timeout: 5000
};

function log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ timestamp, level, message, ...data }));
}

function request(method, endpoint, body = null) {
    return new Promise((resolve, reject) => {
        if (!CONFIG.apiKey) {
            log('ERROR', 'Missing OBLIGA_API_KEY environment variable');
            return reject(new Error('Missing API Key'));
        }

        const url = new URL(`${CONFIG.baseUrl}${endpoint}`);
        
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CONFIG.apiKey
            },
            timeout: CONFIG.timeout
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch (e) {
                        // Handle empty response or non-json
                        resolve(data); 
                    }
                } else {
                    let errorMsg = data;
                    try {
                        const errObj = JSON.parse(data);
                        errorMsg = errObj.error || data;
                    } catch (e) {}
                    
                    log('ERROR', `API Request Failed: ${endpoint}`, { status: res.statusCode, error: errorMsg });
                    reject(new Error(`API Error: ${res.statusCode} - ${errorMsg}`));
                }
            });
        });

        req.on('error', (e) => {
            log('ERROR', `Network Error: ${endpoint}`, { error: e.message });
            reject(e);
        });

        req.on('timeout', () => {
            req.destroy();
            log('ERROR', `Request Timeout: ${endpoint}`);
            reject(new Error('Request Timeout'));
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

module.exports = { request, log };
