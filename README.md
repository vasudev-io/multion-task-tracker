# Task Tracker Example

Using MultiOn Connect with GitHub

This example includes a simple task tracker with a chat interface using the MultiOn API. It demonstrates how to build a full-stack application with authentication, task management, and AI-powered chat support.

## Demo

[![Task Tracker Demo](/assets/Task-Tracker-Demo.gif)](https://youtu.be/xdHHyVTnG4E)

This video demonstrates the key features of our Task Tracker application, including MultiOn Connect authentication, task management, and AI-powered chat support.

[Demo Website](https://multion-task-tracker.vercel.app/) 

## Main Features

- User authentication with MultiOn Connect
- Task management (create, read, update, delete)
- AI-powered chat support - (with complete web browsing capabilties of MultiOn agents)

## Tech Stack

- Next.js
- React
- TypeScript
- Shadcn/ui components (built withTailwind CSS/Radix UI)
- Vercel KV for data storage
- MultiOn API for authentication and AI chat

## Key Features

1. **TaskPage** (`app/page.tsx`): The main page component that handles MultiOn Connect user authentication and renders the task table.

2. **DataTable** (`components/data-table.tsx`): A reusable component for displaying and managing tasks.

3. **ChatSupport** (`components/chat-support.tsx`): An AI-powered chat interface for user assistance.

4. **DB API Routes** (`app/api/tasks/route.ts`): Handles CRUD operations for tasks using Vercel KV storage.

5. **MultiOn API Routes** (`app/api/chat/route.ts`): Handles interactions with the MultiOn API.

6. **Responsive Design** (`components/ui`):: User-friendly interface using Shadcn/ui components

See project structure below to find relevant pieces of code.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components (based on Radix UI)
- **Backend**: Next.js API routes
- **Database**: Vercel KV (for task storage)
- **Authentication**: MultiOn Connect
- **AI Integration**: MultiOn API

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A MultiOn developer account
- A Vercel account (for KV storage and deployment)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your specific details:

```
MULTION_API_KEY=your_multion_api_key
MULTION_ORG_ID=your_multion_org_id
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_api_url
KV_REST_API_TOKEN=your_vercel_kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_read_only_token
```

### 4. Set Up Vercel KV Storage

Follow the [Vercel KV Quickstart guide](https://vercel.com/docs/storage/vercel-kv/quickstart) to set up your KV storage for task data.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
task-tracker/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   └── tasks/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── chat-support.tsx
│   ├── columns.tsx
│   ├── data-table.tsx
│   └── user-nav.tsx
├── data/
│   └── schema.ts
├── lib/
│   └── utils.ts
├── styles/
│   └── globals.css
├── public/
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Key Components

1. **TaskPage** (`app/page.tsx`): Main page component handling MultiOn Connect authentication and task display.
2. **DataTable** (`components/data-table.tsx`): Reusable component for task management.
3. **ChatSupport** (`components/chat-support.tsx`): AI-powered chat interface for user assistance.
4. **Task API Routes** (`app/api/tasks/route.ts`): Handles CRUD operations for tasks using Vercel KV.
5. **MultiOn API Routes** (`app/api/chat/route.ts`): Manages interactions with the MultiOn API.

## MultiOn Connect Integration

### Setting Up OAuth

1. Log in to the [MultiOn Developer Portal](https://platform.multion.ai/).
2. Navigate to the [account page](https://platform.multion.ai/account).
3. Create or select an organization from the account dropdown.
4. On the Home page, find your ORG ID and the React script for the MultiOn Connect button.

### Implementing OAuth Flow

Add the following component to your application:

```jsx
import React, { useEffect, useState } from "react";

function MultiOnConnectButton() {
  const [userId, setUserId] = useState<string | null>(null);

  const connectWithMultion = () => {
    const orgId = process.env.NEXT_PUBLIC_MULTION_ORG_ID;
    const redirectUri = encodeURIComponent(window.location.href);
    const multionAuthUrl = `https://platform.multion.ai/authorize?org_id=${orgId}&redirect_uri=${redirectUri}`;

    window.location.href = multionAuthUrl;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user_id');
    if (userId) {
      setUserId(userId);
    }
  }, []);

  return (
    <button onClick={connectWithMultion}>Connect with MultiOn</button>
  );
}
```

## MultiOn API Usage

1. Obtain API keys from [MultiOn API keys](https://platform.multion.ai/api-keys).
2. Add the API key to your `.env.local` file.
3. Use the API in your application, as demonstrated in `app/api/chat/route.ts`.

## Styling with Shadcn/ui

This project uses [shadcn/ui](https://ui.shadcn.com/) for styling, which is built on top of Tailwind CSS and provides a set of accessible and customizable components.

See install instructions here - [shadcn/ui/installation](https://ui.shadcn.com/docs/installation)

The chat interface uses components from - [shadcn-chat/installation](https://github.com/jakobhoeg/shadcn-chat)

The main task tracker is an updated version of the tasks example on the shadcn/ui source Github repository -[shadcn/ui/examples/tasks](https://github.com/shadcn-ui/ui/tree/main/apps/www/app/(app)/examples/tasks).

To add components:

1. Run `npx shadcn-ui@latest add [component-name]`
2. Import and use the component in your React files (usually stored in components/ui)

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Configure environment variables in Vercel's project settings.
4. Deploy the project.

For detailed deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Troubleshooting

### MultiOn API Timeout
For longer tasks, increase the timeout for API calls:
- In development: Implement async functions with longer timeouts.
- In production: Adjust the Function Max Duration in your hosting platform settings (e.g., on Vercel: Settings -> Functions -> Function Max Duration).

### User ID Issues
Ensure the `user_id` is correctly extracted from the redirect URL after the OAuth flow.

## Contributing

We welcome contributions!Please feel free to submit a Pull Request.

## Support

For questions or issues, please open an issue in the GitHub repository or contact the maintainers directly.

---

Happy coding! We hope this Task Tracker serves as a helpful example for building full-stack applications with MultiOn Connect and AI integration.