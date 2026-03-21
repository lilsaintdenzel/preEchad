export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const { email } = await req.json();

    if (!email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
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

    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const config = { path: '/api/subscribe' };
