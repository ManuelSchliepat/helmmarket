async function testPublish() {
  const url = 'http://localhost:4000/api/skills';
  const userId = 'user_3AIVQi8ooSoBVmHK6jT14jaxkA8'; // From check_devs.ts
  const payload = {
    name: 'Test Skill Bridge',
    slug: 'test-skill-bridge',
    description: 'A test skill for verifying the publishing flow',
    price_cents: 1000,
    registry_endpoint: '@helm-market/test-bridge',
    config: JSON.stringify({
      name: 'Test Skill Bridge',
      operations: [
        { name: 'hello', description: 'Say hello', parameters: { name: { type: 'string' } } }
      ]
    }),
    permissions: ['internet-access'],
    tags: ['test', 'mcp']
  };

  console.log(`Sending publish request to ${url}...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
       console.log('Skill published successfully (at least via API).');
    } else {
       console.error('Skill publication failed.');
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testPublish();
