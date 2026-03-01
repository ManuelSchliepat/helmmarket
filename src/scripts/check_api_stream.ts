async function test() {
    const res = await fetch('http://localhost:4000/api/agent/demo-agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [{ role: 'user', content: 'How is the weather in Munich?' }]
        })
    })
    const reader = res.body?.getReader()
    if (!reader) return
    const decoder = new TextDecoder()
    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        console.log('CHUNK:', decoder.decode(value))
    }
}
test()
