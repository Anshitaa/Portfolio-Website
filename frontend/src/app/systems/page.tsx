import type { Metadata } from 'next';
import Showcase from './Showcase';

export const metadata: Metadata = {
  title: 'AI Systems | Anshita Bhardwaj',
  description:
    'How I use AI as workflows, not prompts: architecture, evaluation, guardrails and human-in-the-loop design across TalentLens, Docu-Sync, CreditPulse and my M.S. thesis.',
  openGraph: {
    title: 'A prompt is a request. A workflow is a system.',
    description: 'Interactive architecture walkthroughs of TalentLens, Docu-Sync, CreditPulse and a causal-inference thesis.',
  },
};

export default function SystemsPage() {
  return <Showcase />;
}
