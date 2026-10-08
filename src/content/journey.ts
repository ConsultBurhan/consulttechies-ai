/** The AI assistant journey shown on the About page. Edit the entries below; the section adapts to any number of chapters. */
export type Chapter = {
  when: string      // the year or span, shown big and on the timeline, e.g. "2024–25"
  title: string     // the milestone name
  tagline: string   // one line under the title
  body: string      // 2 to 3 sentences
  skills: string[]  // key capabilities, shown as small tags (6 to 8 reads best)
}

export const JOURNEY_INTRO = {
  eyebrow: 'The journey',
  title: 'How we built the assistant.',
}

export const JOURNEY_ONE_LINE = ['Deterministic', 'Retrieval-grounded', 'Tool-using', 'Reasoning', 'Adaptive', 'Governed', 'Observable', 'Agentic intelligence']

export const JOURNEY: Chapter[] = [
  {
    when: '2023', title: 'Deterministic foundations', tagline: 'Establishing reliable query execution.',
    body: 'We began with a node-based architecture where each component performed a predefined operation, giving structured database interaction and predictable execution. An open-source approach was evaluated along the way and set aside once its reliability limits showed.',
    skills: ['Deterministic workflows', 'Node-based execution', 'Query resolution', 'Structured database access', 'Predictable execution'],
  },
  {
    when: '2024', title: 'Retrieval-augmented intelligence', tagline: 'Connecting reasoning with continuously changing data.',
    body: 'Retrieval-augmented generation grounded answers in live organizational data instead of static model knowledge. Fine-grained access control limited each person to the brands, areas and stores they were authorized to see.',
    skills: ['RAG', 'Data grounding', 'Retrieval pipelines', 'Fine-grained access control', 'Permission-aware querying'],
  },
  {
    when: '2024–25', title: 'Tool-using reasoning agent', tagline: 'From fixed pipelines to adaptive execution.',
    body: 'The deterministic pipeline became a callable tool inside a reasoning agent. The agent decides whether a question needs the database or another capability, so one system now handles both kinds of query.',
    skills: ['Tool calling', 'Agentic orchestration', 'Query routing', 'Adaptive execution', 'Reusable tools'],
  },
  {
    when: '2025', title: 'ReACT and dynamic model routing', tagline: 'Optimizing reasoning, latency and cost.',
    body: 'As tables, columns and query paths multiplied, a ReACT-based agent began planning actions and choosing tools before executing, cutting unnecessary work. Dynamic model routing matches model capability to query complexity, balancing latency, cost and intelligence.',
    skills: ['ReACT reasoning', 'Query planning', 'Tool selection', 'Dynamic model routing', 'Latency optimization', 'Cost optimization'],
  },
  {
    when: '2025', title: 'Memory and multi-agent exploration', tagline: 'Moving beyond isolated interactions.',
    body: 'Conversational memory now carries relevant context between conversations, so people stop repeating themselves. We also explored multi-agent patterns and a skill-based design, where reusable capabilities are invoked as a task needs them.',
    skills: ['Conversational memory', 'Context management', 'Multi-agent patterns', 'Specialized reasoning', 'Skill-based execution'],
  },
  {
    when: '2025–26', title: 'Harness engineering', tagline: 'Engineering the environment around the model.',
    body: 'Development shifted from tuning the model to designing the harness around it: guardrails, access control, tool restrictions and routing policies. Sensitive data, including brand-identifying information, is masked before it reaches the model, and Auto, Medium and Super response modes adapt reasoning depth to the question and the user.',
    skills: ['Guardrails', 'Permission-aware execution', 'Data masking', 'Tool access controls', 'Model-routing policies', 'Response modes'],
  },
  {
    when: '2026', title: 'Observability and evaluation', tagline: 'From an AI assistant to an adaptive data-intelligence platform.',
    body: 'Retrieval, reasoning, tools, memory, routing and controlled execution now work as one architecture. User feedback and ratings expose weak answers so the system can be tuned, while project-based conversations and answer-to-graph generation turn the assistant into a wider data-analysis interface.',
    skills: ['Observability', 'Continuous evaluation', 'User feedback loops', 'Answer-to-graph', 'Open-source model exploration', 'Domain-specific adaptation'],
  },
]
