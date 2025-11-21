# Third Space Backend API

Our FastAPI backend is live and deployed on Render.

**Base URL:** https://third-space.onrender.com

---

### Interactive API Documentation

FastAPI automatically generates interactive docs. These pages let you explore all available endpoints, see request/response schemas, and even test endpoints directly in the browser.
Visit this URL in your browser to look at a ui for endpoints

- **Swagger UI:** https://third-space.onrender.com/docs

## Endpoints
### /user/new
- this allows us to create a new user and save to db

### /third_space/new
- this allows us to create a new third space and save to db

---

## Making Requests


### Using JavaScript (fetch) (i got ts from chatgpt so happy to help if neeeded)

```
// GET request
const response = await fetch('https://third-space.onrender.com/your-endpoint');
const data = await response.json();

// POST request
const response = await fetch('https://third-space.onrender.com/your-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key: 'value' }),
});
const data = await response.json();
```


---

We're using Render's free tier, so the server **spins down after 15 minutes of inactivity**. The first request after inactivity may take 30-60 seconds to respond while the server wakes up. Subsequent requests will be fast.
