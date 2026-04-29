# CRM Architecture

## System Overview

The CRM application is built as a modern web application using a full-stack JavaScript/TypeScript architecture. It follows a client-server model with a React-based frontend, Node.js backend API, and PostgreSQL database. The system is designed for maintainability, scalability, and developer productivity.

## Architecture Principles

- **Separation of Concerns:** Clear boundaries between UI, business logic, and data layers
- **Type Safety:** TypeScript throughout the stack for reliability and developer experience
- **API-First Design:** Backend provides RESTful APIs that can be consumed by multiple clients
- **Containerization:** Docker ensures consistent development and deployment environments
- **Security by Design:** Authentication, authorization, and input validation built into all layers

## System Components

### Frontend Layer (Next.js Application)

**Technology Stack:**
- Next.js 14+ with App Router
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Hook Form for form management
- TanStack Query for data fetching

**Responsibilities:**
- User interface and user experience
- Client-side routing and navigation
- Form validation and error handling
- Data presentation and visualization
- Authentication flow management

**Architecture Patterns:**
- Component-based architecture with reusable UI components
- Feature-based folder organization
- Server Components for data fetching, Client Components for interactivity
- Custom hooks for business logic encapsulation

### Backend Layer (Express API)

**Technology Stack:**
- Node.js 18+ with TypeScript
- Express.js for API framework
- Prisma ORM for database access
- JWT for authentication
- Zod for input validation

**Responsibilities:**
- Business logic implementation
- Data validation and sanitization
- Authentication and authorization
- API endpoint management
- Error handling and logging

**Architecture Patterns:**
- Layered architecture (routes → controllers → services → repositories)
- Dependency injection for testability
- Middleware pattern for cross-cutting concerns
- Repository pattern for data access abstraction

### Database Layer (PostgreSQL)

**Technology Stack:**
- PostgreSQL 15+
- Prisma ORM with migration system
- Connection pooling via Prisma

**Responsibilities:**
- Data persistence and retrieval
- Data integrity and constraints
- Transaction management
- Query optimization

**Design Principles:**
- Normalized schema for data consistency
- Proper indexing for performance
- Foreign key constraints for referential integrity
- Audit fields (created_at, updated_at, created_by)

## Data Flow

### User Authentication Flow
1. User submits login credentials via frontend form
2. Frontend sends POST request to `/api/v1/auth/login`
3. Backend validates credentials against database
4. JWT token is generated and returned
5. Frontend stores token in httpOnly cookie
6. Subsequent requests include JWT in Authorization header
7. Backend validates JWT and extracts user context

### Contact Management Flow
1. User navigates to contacts page
2. Frontend fetches contacts via GET `/api/v1/contacts`
3. Backend queries database through Prisma
4. Data is serialized and returned as JSON
5. Frontend renders contact list with search/filtering
6. User creates new contact via POST `/api/v1/contacts`
7. Backend validates input, creates record, returns success

### Opportunity Pipeline Flow
1. User views pipeline dashboard
2. Frontend fetches opportunities via GET `/api/v1/opportunities`
3. Backend aggregates data by pipeline stage
4. Frontend renders kanban-style pipeline view
5. User drags opportunity to new stage
6. Frontend sends PATCH request with updated stage
7. Backend updates record and logs change history

## Database Schema

### Core Entities

```sql
-- Users table for authentication and authorization
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'sales_rep',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Contacts table for customer information
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  notes TEXT,
  tags TEXT[], -- Array of tags for categorization
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Opportunities table for sales deals
CREATE TABLE opportunities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  stage VARCHAR(50) NOT NULL,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  close_date DATE,
  contact_id INTEGER REFERENCES contacts(id) NOT NULL,
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Opportunity history for audit trail
CREATE TABLE opportunity_history (
  id SERIAL PRIMARY KEY,
  opportunity_id INTEGER REFERENCES opportunities(id) NOT NULL,
  previous_stage VARCHAR(50),
  new_stage VARCHAR(50) NOT NULL,
  changed_by INTEGER REFERENCES users(id) NOT NULL,
  change_reason TEXT,
  changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Indexes and Performance
- Primary key indexes on all tables
- Foreign key indexes for referential integrity
- Email index on users table for login lookups
- Composite indexes for common query patterns
- Full-text search index on contacts for name/company search

## API Design

### RESTful Endpoints

**Authentication:**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/logout` - User logout

**Contacts:**
- `GET /api/v1/contacts` - List contacts with pagination/filtering
- `POST /api/v1/contacts` - Create new contact
- `GET /api/v1/contacts/:id` - Get contact details
- `PATCH /api/v1/contacts/:id` - Update contact
- `DELETE /api/v1/contacts/:id` - Delete contact

**Opportunities:**
- `GET /api/v1/opportunities` - List opportunities with filtering
- `POST /api/v1/opportunities` - Create new opportunity
- `GET /api/v1/opportunities/:id` - Get opportunity details
- `PATCH /api/v1/opportunities/:id` - Update opportunity
- `DELETE /api/v1/opportunities/:id` - Delete opportunity

**Dashboard:**
- `GET /api/v1/dashboard/metrics` - Get dashboard metrics
- `GET /api/v1/dashboard/pipeline` - Get pipeline data

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### Error Handling
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

## Security Architecture

### Authentication
- JWT tokens with 1-hour expiration
- Refresh tokens for session management
- Password hashing with bcrypt
- Secure cookie settings for token storage

### Authorization
- Role-based access control (RBAC)
- Route-level middleware for permission checks
- Data-level filtering based on user role and ownership

### Input Validation
- Zod schemas for request validation
- SQL injection prevention via parameterized queries
- XSS protection via input sanitization
- Rate limiting on API endpoints

## Deployment Architecture

### Development Environment
- Docker Compose with local PostgreSQL
- Hot reload for frontend and backend
- Volume mounting for code changes
- Environment-specific configuration

### Production Environment
- Docker containerization
- Reverse proxy (nginx) for static assets and API routing
- Database connection pooling
- Environment variable configuration
- Health check endpoints

### Infrastructure Components
- Application container (Next.js built application)
- API container (Node.js/Express)
- Database container (PostgreSQL)
- Redis container (future caching/session store)

## Monitoring and Observability

### Logging
- Structured logging with Winston
- Request/response logging middleware
- Error tracking with correlation IDs
- Log aggregation for production monitoring

### Health Checks
- Application health endpoint (`/health`)
- Database connectivity checks
- Readiness probes for Kubernetes/load balancers

### Metrics
- Response time tracking
- Error rate monitoring
- Database query performance
- User activity metrics

## Scalability Considerations

### Horizontal Scaling
- Stateless API design allows multiple instances
- Session storage in database or Redis
- Load balancing for API requests

### Database Scaling
- Read replicas for query offloading
- Connection pooling for efficient resource usage
- Query optimization and indexing

### Caching Strategy
- API response caching for frequently accessed data
- Database query result caching
- Static asset caching with CDN

## Development Workflow

### Local Development
- Docker Compose for consistent environment
- Hot reload for rapid development
- Pre-commit hooks for code quality
- Automated testing in CI/CD pipeline

### Code Quality
- ESLint and Prettier for code formatting
- TypeScript for type checking
- Unit and integration test coverage
- Code review process for pull requests

### Deployment Pipeline
- Automated testing on push
- Docker image building
- Staging environment deployment
- Production deployment with rollback capability
