const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2Kw72p7Al-YmUn9CTTvreBK7RYdsFJPNaXHKYoI6sV5x9nwXfhwrX9qrG6mV5g8k_0Q/exec';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: 'OK',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ status: 'error', message: 'Method Not Allowed' }),
        };
    }

    try {
        const payload = JSON.parse(event.body || '{}');

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Falha ao enviar para o Google Sheets.');
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ status: 'success' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ status: 'error', message: error.message }),
        };
    }
};

