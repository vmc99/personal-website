// Experience and education, from the live site's data, updated with Vamsi's answers of
// 14 November 2026. Keep employer, client and university relationships exact (DESIGN.md).
// `placeholder` marks an entry whose details are still to come; it renders highlighted and blocks release.

export type Entry = {
  org: string;
  role: string;
  when: string;
  where: string;
  note?: string;
  url?: string;
  placeholder?: string;
};

export const experience: Entry[] = [
  {
    org: 'AECOM',
    role: 'Software Engineer, AI for engineering',
    when: '2025 to now',
    where: 'London',
    url: 'https://aecom.com',
    placeholder: 'AECOM: exact title, start date and what can be said publicly about the work',
  },
  {
    org: 'IBM Research with UCL',
    role: 'Software Engineer',
    when: 'Jun to Sep 2025',
    where: 'London',
    note: 'Architecture for an AI-driven legacy code remediation system: agentic workflows in LangGraph, vLLM inference, test coverage from JaCoCo.',
  },
  {
    org: 'University College London',
    role: 'Computer Science Student Ambassador',
    when: 'Jan to Sep 2025',
    where: 'London',
    note: 'Represented UCL at outreach events and helped run workshops and seminars.',
  },
  {
    org: 'Accenture, client: Cigna',
    role: 'Associate Software Engineer',
    when: 'Aug 2022 to May 2024',
    where: 'Hyderabad',
    note: 'An automated claims workflow for payments across pharmacy claims; test strategy and ETL automation; AWS jobs and S3.',
  },
  {
    org: 'Blobcity',
    role: 'AI Intern',
    when: 'Jul to Sep 2021',
    where: 'Remote',
    note: 'Machine learning and deep learning model templates with the data science team, published on GitHub.',
  },
];

export const education: Entry[] = [
  { org: 'University College London', role: 'MSc Software Systems Engineering', when: '2024 to 2025', where: 'London' },
  { org: 'GITAM (Deemed to be University)', role: 'B.Tech Computer Science', when: '2018 to 2022', where: 'Visakhapatnam' },
];

// Smaller projects, linked straight to their repositories.
export const otherProjects = [
  { name: 'Zoom Bot', href: 'https://github.com/vmc99/glearn-zoom-bot', note: 'Attended scheduled online classes and reported to Discord. Used by the 2022 CSE cohort at GITAM during COVID-19.' },
  { name: 'Unmasking Human Faces', href: 'https://github.com/vmc99/Mini-Project', note: 'A deep learning model that removes face masks and reconstructs the hidden region.' },
  { name: 'Digit Recognizer', href: 'https://github.com/vmc99/digit-recognizer-mnist-app', note: 'A web app that classifies handwritten digits drawn on a canvas.' },
  { name: 'Pixely', href: 'https://github.com/vmc99/Pixely-Image-Modifier', note: 'Image filters and backgrounds, with image steganography.' },
];
