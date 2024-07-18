// backend/index.ts
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const key = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true
  });

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo'});

    res.json(completion);
    

    console.log(completion);

  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Error generating text. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
