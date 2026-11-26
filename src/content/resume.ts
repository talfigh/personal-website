/**
 * Single source of truth for all site content.
 *
 * Rules (see CLAUDE.md → "Content"):
 * - Edit text here, never inside components.
 * - Public info only. No phone number, street address, work-permit or
 *   immigration status, or anything else private.
 * - Leave an optional field as an empty string to hide it on the site.
 */

export type Link = {
  label: string;
  href: string;
};

export type Job = {
  role: string;
  company: string;
  location: string;
  period: string;
  blurb: string;
  highlights: string[];
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export type Degree = {
  title: string;
  school: string;
  period: string;
  note: string;
};

export type Resume = {
  name: string;
  title: string;
  location: string;
  summary: string;
  email: string;
  links: Link[];
  experience: Job[];
  skills: SkillGroup[];
  education: Degree[];
  languages: string[];
};

export const resume: Resume = {
  name: 'Ali Reza Ghiasi',
  title: 'Full-Stack / AI Engineer',
  location: 'Toronto, Canada',
  summary:
    'I build production LLM systems and the data pipelines that feed them. ' +
    'At SEEV, one of Canada’s Top 100 AI Startups, I built the ingestion platform and the ' +
    'two-stage LLM matching engine at the core of the product. I ship end to end across ' +
    'Python, React, FastAPI, and serverless AWS.',
  email: 'ghiasi.alireza@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alirezaghiasi' },
    // TODO(owner): add your GitHub profile once the repo is public, e.g.
    // { label: 'GitHub', href: 'https://github.com/<your-username>' },
  ],
  experience: [
    {
      role: 'Full-Stack / AI Engineer',
      company: 'SEEV',
      location: 'Montreal, QC (Remote)',
      period: 'Sep 2025 – Sep 2026',
      blurb: 'Public-procurement tender-matching platform.',
      highlights: [
        'Designed the two-stage LLM matching engine (Gemini, with Claude fallback) that evaluated 873K candidate organization–tender matches and screened out ~73% before customers saw them.',
        'Grounded match decisions in customer judgment: vector search retrieved similar past ratings as few-shot examples, so the engine adapted to feedback without retraining.',
        'Built the data platform behind the product, ingesting ~47K public tenders a month from 21 procurement portals on a shared async scraper with rate limiting and deduplication.',
        'Primary author of the core Lambdas in a 16-function serverless AWS pipeline defined in OpenTofu; the enrichment service ran 206K+ invocations with zero errors as volume grew ~8x.',
        'Built vector and full-text search over 1.4M+ documents in MongoDB Atlas as code, and automated document retrieval from 2FA-protected government portals with Playwright.',
        'Delivered a lead-pipeline CRM end to end with FastAPI, Django, and React.',
      ],
    },
    {
      role: 'AI Developer',
      company: '2MO Studio',
      location: 'New York, NY (Remote)',
      period: 'Dec 2023 – Dec 2024',
      blurb: 'AI image editing and generation.',
      highlights: [
        'Built and deployed an LLM agent (LangChain, OpenAI GPT, Gemini) that held context-aware conversations to drive AI image editing and generation.',
        'Improved image-detection accuracy on visual editing inputs by 15% using CNNs and transfer learning.',
        'Added automated testing and monitoring of model metrics and bias in production outputs.',
      ],
    },
  ],
  skills: [
    {
      name: 'AI & LLMs',
      items: [
        'RAG',
        'Vector search',
        'Embeddings',
        'Prompt engineering',
        'OpenAI GPT',
        'Claude',
        'Gemini',
        'LangChain',
        'AWS Bedrock',
      ],
    },
    {
      name: 'Backend & Web',
      items: [
        'Python',
        'FastAPI',
        'Django',
        'Pydantic',
        'TypeScript',
        'React',
        'Tailwind',
        'Playwright',
      ],
    },
    {
      name: 'Cloud & DevOps',
      items: [
        'AWS Lambda',
        'EventBridge',
        'IAM',
        'OpenTofu / Terraform',
        'Docker',
        'CI/CD',
        'Sentry',
      ],
    },
    {
      name: 'Data',
      items: ['ETL pipelines', 'MongoDB Atlas', 'Atlas Vector Search', 'PostgreSQL', 'SQLite'],
    },
    {
      name: 'Machine Learning',
      items: [
        'PyTorch',
        'OpenCV',
        'Object detection (YOLO)',
        'Image segmentation',
        'Stable Diffusion',
      ],
    },
  ],
  education: [
    {
      title: 'Graduate Studies, Telecommunication Networks (MSc program)',
      school: 'ÉTS, Montreal',
      period: '2021',
      note: 'Funded research assistant: GAN-based data-center simulation to predict bandwidth and optimize load balancing.',
    },
    {
      title: 'BSc, Computer Engineering',
      school: 'Sharif University of Technology',
      period: '2019',
      note: 'Thesis: smart-home supervision system using Raspberry Pi and PLC technology.',
    },
  ],
  languages: ['English (professional)', 'French (B1)', 'Farsi (native)'],
};
