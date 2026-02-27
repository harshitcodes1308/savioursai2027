const superjson = require('superjson');

async function main() {
  try {
    const payload = {
      "0": {
        json: {
          email: 'test@example.com',
          password: 'testpassword'
        }
      }
    };

    // superjson stringify to ensure exact tRPC match
    const bodyStr = superjson.stringify({
      email: 'test@example.com',
      password: 'testpassword'
    });

    const response = await fetch('http://localhost:3002/api/trpc/auth.login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // tRPC superjson payload format: {"0":{"json":{...}}}
      body: JSON.stringify({
        "0": {
          json: {
            email: 'test@example.com',
            password: 'testpassword'
          }
        }
      })
    });

    const text = await response.text();
    console.log("STATUS:", response.status);
    console.log("BODY:", text);
  } catch(e) {
    console.error("ERROR:", e);
  }
}

main();
