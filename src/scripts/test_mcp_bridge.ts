async function testBridge() {
  const url = 'http://localhost:4000/api/mcp/simple-skill/execute';
  const payload = {
    toolName: 'getPrice',
    arguments: { symbol: 'AAPL' }
  };

  console.log(`Sending request to ${url}...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-install-token'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', text);
    if (response.headers.get('content-type')?.includes('application/json')) {
      console.log('Parsed JSON:', JSON.parse(text));
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testBridge();
