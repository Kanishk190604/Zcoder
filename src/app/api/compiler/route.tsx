export async function POST(req:any) {
    const { language, version, source ,testcase} = await req.json();
    
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, version,
    
    
        files: [
            {
              name: "main.cpp",
              content: source
            }
          ],
          stdin:testcase
        }),
    });
  
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });}