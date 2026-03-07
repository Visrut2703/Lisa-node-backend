/**
 * One-shot demo setup script:
 * 1. Calls the Python API to extract text from the demo resume
 * 2. Calls the Node API to get skills from Gemini
 * 3. Saves an interview session to the DB
 * 4. Prints the interview URL
 */
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PDF_PATH = path.join(__dirname, '..', 'Lisa-Python-backend', 'demo_resume.pdf');
const INTERVIEW_ID = uuidv4();

console.log('Interview ID:', INTERVIEW_ID);

// Step 1: Extract text from PDF via Python server
console.log('\n[1] Extracting text from PDF...');
const form = new FormData();
form.append('file', fs.createReadStream(PDF_PATH), { filename: 'demo_resume.pdf', contentType: 'application/pdf' });

const extractRes = await axios.post('http://localhost:2348/extract-text', form, {
  headers: form.getHeaders()
});
const text = extractRes.data.text;
console.log('Extracted text length:', text.length);
console.log('Preview:', text.slice(0, 150));

// Step 2: Get skills from Gemini via Node API
console.log('\n[2] Getting skills from Gemini...');
const skillsRes = await axios.post('http://localhost:1111/ai/getSkills', { text });
const skills = skillsRes.data.text;
console.log('Skills detected:', skills);

// Step 3: Save interview session to DB
console.log('\n[3] Saving interview session...');
const saveRes = await axios.post('http://localhost:1111/iv/saveIV', {
  interviewId: INTERVIEW_ID,
  skills: skills,
  count: 2
});
console.log('Save response:', saveRes.data);

// Step 4: Print URL
console.log('\n✅ DONE! Open this URL in the browser:');
console.log(`http://localhost:2345/interview/${INTERVIEW_ID}`);
console.log('\nAlso store in localStorage:');
console.log(`  name: "Demo User"`);
console.log(`  interviewId: "${INTERVIEW_ID}"`);
console.log(`  languages: "${skills}"`);
