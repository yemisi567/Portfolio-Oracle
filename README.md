# Portfolio Project Oracle

**AI-Powered Portfolio Project Ideas for Developers**

Transform your coding journey with personalized portfolio project ideas tailored to your skills and career goals. Generate, track, and showcase projects that matter to your professional growth.

<img width="1771" height="901" alt="Screenshot 2025-09-22 at 22 56 10" src="https://github.com/user-attachments/assets/897cbd90-a189-4d67-ad6e-767613e3a9df" />


## ✨ Features

### AI-Powered Project Generation

- **Smart Recommendations**: Get personalized project ideas based on your skill level, tech stack, and career goals
- **Multiple AI Models**: Powered by GPT-4, Claude, and other advanced language models
- **Context-Aware**: Projects are tailored to current market trends and industry demands

### Market Insights & Analytics

- **Real-Time Data**: Access trending skills and job market insights via RapidAPI LinkedIn integration
- **Country-Specific Analysis**: Get market data for different regions and countries
- **Skill Demand Tracking**: Understand which technologies are in high demand

<img width="1761" height="893" alt="Screenshot 2025-09-22 at 22 55 54" src="https://github.com/user-attachments/assets/2e6c9513-81a7-4de3-9158-357370ec4d13" />


### Project Management

- **Milestone Tracking**: Break down projects into manageable milestones with progress tracking
- **Manual Progress Updates**: Mark milestones as complete/incomplete manually
- **Project Status Management**: Move projects between planned, in-progress, and completed states
- **Detailed Project Views**: Comprehensive project details with challenges, resources, and notes


<img width="1757" height="890" alt="Screenshot 2025-09-22 at 22 55 25" src="https://github.com/user-attachments/assets/625e0d15-12b6-4333-b325-433d36b6bbe2" />

### User Management

- **Secure Authentication**: Built with Supabase Auth for secure user management
- **Email Verification**: Streamlined signup process
- **Password Reset**: Complete forgot password flow with secure token-based reset
- **User Profiles**: Personalized user preferences and skill tracking

### Modern UI/UX

- **Responsive Design**: Beautiful, modern interface that works on all devices
- **Dark Theme**: Eye-friendly dark mode optimized for developers
- **Smooth Animations**: Framer Motion powered animations for delightful interactions
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Lucide React** - Beautiful icons

### Backend

- **Supabase** - Database and authentication
- **PostgreSQL** - Relational database
- **Resend** - Email delivery service
- **RapidAPI** - LinkedIn job market data
- **OpenRouter** - AI model access

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Supabase account
- Resend account (for emails)
- RapidAPI account (for market insights)
- OpenRouter account (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yemisi567/portfolio-project-oracle.git
   cd portfolio-project-oracle
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_KEY=

   # Email Service
   NEXT_PUBLIC_RESEND_API_KEY=

   # AI Service
   OPENROUTER_API_KEY=

   # Market Insights
   RAPIDAPI_KEY=

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=
   ```

4. **Set up the database**
   Run the SQL scripts in your Supabase SQL editor:

   ```sql
   -- Run database-schema.sql
   -- Run add-password-reset-table.sql
   -- Run add-market-insights-cache-tables.sql
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
portfolio-project-oracle/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── projects/      # Project management
│   │   │   └── market-insights/ # Market data
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context providers
│   │   └── [pages]/           # Application pages
│   ├── lib/                   # Utility functions and hooks
│   │   ├── hooks/             # Custom React hooks
│   │   └── services/          # External service integrations
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── database-schema.sql        # Database schema
└── netlify.toml              # Netlify deployment config
```

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the provided SQL scripts to set up tables
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers

### Email Configuration

1. Sign up for Resend
2. Verify your domain (optional)
3. Get your API key
4. Configure email templates

### AI Configuration

1. Sign up for OpenRouter
2. Get your API key
3. Configure model preferences

### Market Insights Setup

1. Sign up for RapidAPI
2. Subscribe to LinkedIn Data API
3. Get your API key

## Database Schema

### Core Tables

- **users** - User authentication and profiles
- **projects** - Generated project ideas
- **milestones** - Project milestone tracking
- **market_insights** - Cached market data
- **password_reset_tokens** - Secure password reset

### Key Features

- **Row Level Security (RLS)** - Secure data access
- **Automatic Timestamps** - Created/updated tracking
- **Foreign Key Constraints** - Data integrity
- **Indexes** - Optimized queries

## Security Features

- **Supabase Auth** - Industry-standard authentication
- **Row Level Security** - Database-level access control
- **Secure Token Generation** - Cryptographically secure tokens
- **Input Validation** - Comprehensive data validation
- **Rate Limiting** - API abuse prevention
- **CORS Configuration** - Cross-origin request security

## Contributing

I welcome contributions. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Write clean, readable code
- Test your changes thoroughly
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Supabase** - Backend infrastructure
- **Vercel** - Deployment platform
- **OpenRouter** - AI model access
- **RapidAPI** - Market data
- **Resend** - Email delivery
- **Next.js Team** - Amazing React framework

## Support

- **Email**: alegbeyemi@gmail.com

---

**Built with ❤️ for developers, by Mojisola Alegbe**
