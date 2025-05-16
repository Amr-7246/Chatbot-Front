export async function askAgent(question: string): Promise<string> {
  const res = await fetch("http://localhost:8000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  })
  const data = await res.json()
  return data.answer
}
