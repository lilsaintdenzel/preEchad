exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    let email;
    try {
        ({ email } = JSON.parse(event.body));
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    if (!email) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            email,
            listIds: [Number(process.env.BREVO_LIST_ID)],
            updateEnabled: true,
        }),
    });

    const data = res.status === 204 ? {} : await res.json();

    return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
};
