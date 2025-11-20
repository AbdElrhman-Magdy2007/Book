# Design Document: Database Connection Fix

## Overview

This design addresses the critical database connection failure in the Next.js book landing application. The root cause is an incorrect Supabase connection string format that doesn't match the requirements for serverless Next.js API routes. The solution involves updating the DATABASE_URL to use Supabase's transaction pooler mode and optimizing the Prisma client configuration for serverless environments.

### Key Issues Identified

1. **Wrong Connection Pooler Mode**: Currently using session mode (port 5432) with `postgres.blpfquieymraohacjqmu` format, which is incompatible with serverless functions
2. **Password Encoding**: Special characters in the password need proper URL encoding
3. **Connection Pooling**: Prisma client needs optimization for serverless cold starts
4. **Error Handling**: Current error logging doesn't provide enough context for debugging

## Architecture

### Connection Flow

```
Next.js API Route → Prisma Client → Supabase Connection Pooler → PostgreSQL Database
```

### Supabase Connection Modes

Supabase offers two connection pooler modes:

1. **Session Mode (Port 5432)**: 
   - Format: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres`
   - Use case: Long-running applications with persistent connections
   - NOT suitable for serverless

2. **Transaction Mode (Port 6543)**:
   - Format: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres`
   - Use case: Serverless functions with short-lived connections
   - RECOMMENDED for Next.js API routes

### Direct Connection (Fallback)

For development or debugging:
- Format: `postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres`
- Use case: Direct connection without pooler

## Components and Interfaces

### 1. Environment Configuration (.env)

**Purpose**: Store database connection strings and configuration

**Structure**:
```env
# Primary connection (Transaction Mode for Production)
DATABASE_URL="postgresql://postgres.blpfquieymraohacjqmu:PASSWORD@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"

# Alternative: Direct connection for development
# DATABASE_URL="postgresql://postgres:PASSWORD@db.blpfquieymraohacjqmu.supabase.co:5432/postgres"
```

**Key Changes**:
- Use port 6543 (transaction mode) instead of 5432
- Ensure password is properly URL-encoded
- Remove `postgres.PROJECT_REF` format, use `postgres` as username
- Keep commented alternatives for reference

### 2. Prisma Client Configuration (src/lib/prisma.ts)

**Current Issues**:
- Eager connection on module load causes issues in serverless
- Excessive logging in production
- Connection test throws unhandled errors

**Improved Design**:

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Prisma client configuration optimized for serverless
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const db: PrismaClient = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export default db;
```

**Design Decisions**:
- **Lazy Connection**: Remove eager `$connect()` call - Prisma connects on first query
- **Conditional Logging**: Reduce logs in production to minimize overhead
- **Singleton Pattern**: Prevent multiple instances in development
- **Environment-based Configuration**: Different settings for dev vs prod

### 3. Connection Validation Utility

**Purpose**: Validate database connectivity on application startup

**Location**: `src/lib/db-health.ts` (new file)

**Interface**:
```typescript
export async function checkDatabaseConnection(): Promise<{
  success: boolean;
  message: string;
  timestamp: string;
}>;
```

**Implementation Strategy**:
- Perform a simple query (`SELECT 1`) to test connection
- Return structured result with success status
- Log detailed error information if connection fails
- Use in API health check endpoint

### 4. API Route Error Handling

**Current Issue**: API routes fail silently or with generic errors

**Improved Pattern**:
```typescript
export async function GET() {
  try {
    const products = await db.product.findMany({...});
    return Response.json(products);
  } catch (error) {
    console.error('Database query failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

## Data Models

No changes to existing Prisma schema required. The current schema is well-structured with:
- Proper indexes for query optimization
- Cascade delete rules for referential integrity
- UUID primary keys for distributed systems
- Appropriate field types and constraints

## Error Handling

### Connection Errors

**Error Types**:
1. **Authentication Errors**: "Tenant or user not found"
   - Cause: Wrong connection string format or credentials
   - Solution: Use correct Supabase connection format

2. **Timeout Errors**: Connection timeout
   - Cause: Network issues or wrong host/port
   - Solution: Verify connection string and network access

3. **Pool Exhaustion**: Too many connections
   - Cause: Not using transaction mode in serverless
   - Solution: Switch to port 6543

### Error Logging Strategy

**Development**:
- Log all queries for debugging
- Include full error stack traces
- Log connection attempts

**Production**:
- Log errors only
- Sanitize sensitive information
- Include timestamps and request context

### Graceful Degradation

For critical API routes:
1. Implement retry logic with exponential backoff
2. Return cached data if available
3. Provide meaningful error messages to clients
4. Log errors for monitoring

## Testing Strategy

### 1. Connection Testing

**Manual Testing**:
- Start development server
- Check console for "Prisma connected successfully" message
- Test each API endpoint that uses database

**Automated Testing**:
- Create health check endpoint: `/api/health/db`
- Returns connection status and latency
- Can be used for monitoring

### 2. API Route Testing

**Test Cases**:
1. GET /api/products - Should return product list
2. GET /api/cart - Should return cart items
3. GET /api/auth/session - Should return session data
4. POST /api/orders - Should create order

**Expected Results**:
- All endpoints return 200 status
- No "Tenant or user not found" errors
- Response times under 2 seconds

### 3. Environment Variable Validation

**Test Scenarios**:
1. Missing DATABASE_URL - Should fail fast with clear error
2. Malformed DATABASE_URL - Should log parsing error
3. Wrong credentials - Should log authentication error
4. Correct configuration - Should connect successfully

### 4. Load Testing

**Purpose**: Verify connection pooling works under load

**Approach**:
- Simulate 50 concurrent requests to /api/products
- Monitor connection pool usage
- Verify no connection exhaustion errors
- Measure response time consistency

## Implementation Phases

### Phase 1: Fix Connection String
1. Update DATABASE_URL in .env to use transaction mode (port 6543)
2. Verify password encoding
3. Test connection manually

### Phase 2: Optimize Prisma Client
1. Update src/lib/prisma.ts with lazy connection
2. Adjust logging based on environment
3. Remove eager connection test

### Phase 3: Add Health Check
1. Create db-health utility
2. Add /api/health/db endpoint
3. Test connection validation

### Phase 4: Improve Error Handling
1. Update API routes with better error handling
2. Add structured error logging
3. Test error scenarios

### Phase 5: Validation
1. Test all API endpoints
2. Verify no connection errors
3. Check logs for proper formatting
4. Document connection string format

## Configuration Reference

### Supabase Connection String Anatomy

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?[OPTIONS]
```

**For this project**:
- USER: `postgres` (not `postgres.PROJECT_REF`)
- PASSWORD: `Hfw%26w5%26KKyjrQ%40%21` (URL-encoded)
- HOST: `aws-0-eu-west-2.pooler.supabase.com`
- PORT: `6543` (transaction mode)
- DATABASE: `postgres`

**Final Connection String**:
```
postgresql://postgres:Hfw%26w5%26KKyjrQ%40%21@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
```

### Password Encoding Reference

Original password: `Hfw&w5&KKyjrQ@!`

URL-encoded:
- `&` → `%26`
- `@` → `%40`
- `!` → `%21`

Result: `Hfw%26w5%26KKyjrQ%40%21`

## Monitoring and Maintenance

### Health Checks

Implement `/api/health/db` endpoint that returns:
```json
{
  "status": "healthy",
  "latency": 45,
  "timestamp": "2025-11-19T10:30:00Z"
}
```

### Logging

Log the following events:
- Connection attempts (dev only)
- Connection failures (always)
- Query errors (always)
- Slow queries > 1s (always)

### Alerts

Set up monitoring for:
- Connection failure rate > 5%
- Average query time > 2s
- Error rate > 1%

## Security Considerations

1. **Environment Variables**: Never commit .env files to version control
2. **Password Encoding**: Always URL-encode special characters
3. **Connection Limits**: Use transaction mode to prevent pool exhaustion
4. **Error Messages**: Don't expose connection strings in error responses
5. **SSL**: Supabase enforces SSL by default (sslmode=require)

## Performance Optimization

1. **Connection Pooling**: Transaction mode handles pooling automatically
2. **Query Optimization**: Existing indexes are well-designed
3. **Lazy Loading**: Prisma connects on first query, not on import
4. **Caching**: Consider implementing query result caching for frequently accessed data

## Rollback Plan

If issues persist after implementation:

1. **Immediate**: Switch to direct connection (port 5432 without pooler)
2. **Short-term**: Use session mode pooler for testing
3. **Long-term**: Consider alternative database hosting if Supabase issues continue

## Success Criteria

The implementation is successful when:

1. ✅ All API endpoints connect to database without errors
2. ✅ No "Tenant or user not found" errors in logs
3. ✅ Health check endpoint returns healthy status
4. ✅ Response times are under 2 seconds
5. ✅ Application works in both development and production
6. ✅ Error logs provide clear debugging information
