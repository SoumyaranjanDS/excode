import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, 'src', 'content', 'articles');

if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

const articles = [
  {
    slug: '10-real-world-development-problems',
    title: '10 Real-World Development Problems Every Senior Engineer Must Know',
    description: 'Learn how to handle race conditions, memory leaks, and distributed system failures that you will actually face in production.',
    date: '2026-08-01',
    content: `
When hiring senior engineers, theoretical knowledge of data structures isn't enough. Companies need developers who can solve **real world development problems**. Here are the top 10 challenges you will actually face in production.

## 1. Race Conditions in Microservices
When multiple services read and write to the same database concurrently, race conditions are inevitable. You need to implement distributed locks, database transactions, or optimistic concurrency control.

## 2. Memory Leaks in Node.js
Unlike short-lived scripts, long-running Node.js backends can slowly leak memory if you aren't careful with closures, event listeners, and global variables.

## 3. The N+1 Query Problem
ORMs make fetching data easy, but they often result in the N+1 query problem, slowing down your application exponentially as your dataset grows.

## 4. Handling API Rate Limits
When integrating with third-party APIs (like Stripe or GitHub), you must gracefully handle 429 Too Many Requests errors using exponential backoff.

## 5. Idempotency in Payments
If a network request drops during a payment capture, you cannot safely retry unless your endpoints are idempotent.

*(These are the exact types of problems you can test on Excode!)*
`
  },
  {
    slug: 'how-to-fix-race-conditions',
    title: 'How to Fix Race Conditions in Distributed Systems',
    description: 'A deep dive into solving race conditions, one of the most difficult real world development challenges.',
    date: '2026-08-02',
    content: `
Race conditions are among the most notoriously difficult **development challenges** to debug because they only happen under load.

## What is a Race Condition?
It occurs when the timing of events affects the correctness of a program. For example, two users purchasing the final ticket at the exact same millisecond.

## How to Fix It
1. **Database Transactions:** Use ACID compliant databases to lock rows during updates.
2. **Distributed Locks:** Use Redis (Redlock) to ensure only one microservice can process a specific resource at a time.
3. **Message Queues:** Route concurrent requests through a message broker like RabbitMQ or Kafka to process them sequentially.
`
  },
  {
    slug: 'algorithmic-vs-systems-interviews',
    title: 'Algorithmic Puzzles vs. Real-World Engineering Interviews',
    description: 'Why the tech industry is shifting away from LeetCode and towards assessing real-world development problems.',
    date: '2026-08-03',
    content: `
For the last decade, tech interviews have been dominated by binary trees, dynamic programming, and graphs. But the industry is waking up to a massive **development challenge**: passing these interviews doesn't mean you can build software.

## The Problem with Algorithms
They test academic computer science knowledge, not software engineering.

## The Solution: Real World Scenarios
Modern platforms like Excode test candidates on:
- Containerized environments (Docker)
- Debugging memory leaks
- Refactoring legacy code
- Optimizing database indexes

Hire developers based on the skills they actually use.
`
  },
  {
    slug: 'debugging-nodejs-memory-leaks',
    title: 'The Ultimate Guide to Debugging Node.js Memory Leaks',
    description: 'Learn how to track down and fix memory leaks in production Node.js applications.',
    date: '2026-08-04',
    content: `
A memory leak in a long-running Node.js process is a massive **real world development problem**.

## Common Causes
1. **Global Variables:** Storing data in global arrays that never get cleared.
2. **Unremoved Event Listeners:** Attaching listeners to \`req\` or \`EventEmitter\` without ever calling \`removeListener\`.
3. **Closures:** Keeping massive objects in scope accidentally.

## How to Debug
Use the Node.js \`--inspect\` flag to capture a heap snapshot, then open it in Chrome DevTools to see exactly what objects are retaining memory.
`
  },
  {
    slug: 'hackerrank-codility-alternatives',
    title: 'The Best HackerRank and Codility Alternatives in 2026',
    description: 'Looking for a HackerRank alternative that tests real-world skills? Here is the breakdown of modern assessment tools.',
    date: '2026-08-05',
    content: `
If you are tired of algorithmic puzzles, you are likely looking for a **HackerRank alternative**.

## Why Companies are Switching
Traditional platforms focus on competitive programming. They don't test if a candidate can write a REST API, configure a Docker container, or fix a production bug.

## Enter Excode
Excode is the premier alternative that provides full sandboxed Linux environments. We evaluate candidates on actual architectural challenges, not just code snippets.
`
  },
  {
    slug: 'n-plus-one-query-problem',
    title: 'Understanding and Fixing the N+1 Query Problem',
    description: 'Database performance is a critical development challenge. Learn how to identify and fix N+1 queries.',
    date: '2026-08-06',
    content: `
The N+1 query problem is a silent performance killer and a classic **real world development problem**.

## What is it?
It happens when your ORM fetches a list of items (1 query), and then loops through them to fetch related data for each item (N queries).

## How to Fix It
- **Eager Loading:** Instruct your ORM to JOIN the tables ahead of time.
- **DataLoader:** In GraphQL, use Facebook's DataLoader pattern to batch and cache database requests automatically.
`
  },
  {
    slug: 'building-idempotent-apis',
    title: 'Why Every Payment API Must Be Idempotent',
    description: 'Learn how idempotency keys prevent double-charging users during network failures.',
    date: '2026-08-07',
    content: `
When building distributed systems, network requests will fail. Handling these failures safely is a massive **development challenge**.

## The Scenario
A user clicks "Pay". The request hits the server, charges the credit card, but the network drops before the server can reply "Success". The user clicks "Pay" again.

## Idempotency
By passing an \`Idempotency-Key\` in the header, the server knows if it has already processed this exact request, safely returning the cached result without double-charging the card.
`
  },
  {
    slug: 'docker-for-interviews',
    title: 'Using Docker for Technical Interviews',
    description: 'Why sandboxed container environments are the future of developer skill assessments.',
    date: '2026-08-08',
    content: `
Testing a candidate's ability to navigate a real system is impossible in a standard text area. 

## The Sandbox Approach
By using Docker, platforms like Excode can spin up entire microservice architectures, databases, and message queues instantly. Candidates get a real terminal and can solve **real world development problems** just like they would on the job.
`
  },
  {
    slug: 'microservices-vs-monolith',
    title: 'Microservices vs Monolith: Development Challenges',
    description: 'Breaking down the pros, cons, and engineering challenges of migrating to microservices.',
    date: '2026-08-09',
    content: `
Migrating from a monolith to microservices introduces immense **development challenges**.

## The Trade-offs
While microservices allow independent scaling and deployment, they introduce:
1. Distributed tracing complexity.
2. Eventual consistency across databases.
3. Network latency.

Before splitting your monolith, ensure your team has the DevOps maturity to handle these real-world architectural problems.
`
  },
  {
    slug: 'exponential-backoff-retries',
    title: 'Implementing Exponential Backoff for API Retries',
    description: 'How to gracefully handle rate limits and service outages in your applications.',
    date: '2026-08-10',
    content: `
APIs go down. Rate limits get hit. Handling third-party outages is a core **real world development problem**.

## Exponential Backoff
Instead of retrying immediately and overwhelming a struggling server (which can cause a cascading failure), use exponential backoff. 

Wait 1 second, then 2, then 4, then 8, while adding "jitter" (randomness) to prevent thundering herds.
`
  }
];

articles.forEach(article => {
  const fileContent = "---\n" +
"title: \"" + article.title + "\"\n" +
"description: \"" + article.description + "\"\n" +
"date: \"" + article.date + "\"\n" +
"author: \"Soumyaranjan\"\n" +
"---\n\n" + 
article.content.trim() + "\n";

  fs.writeFileSync(path.join(articlesDir, article.slug + '.md'), fileContent);
  console.log('Created ' + article.slug + '.md');
});

console.log('Successfully generated 10 SEO articles!');
