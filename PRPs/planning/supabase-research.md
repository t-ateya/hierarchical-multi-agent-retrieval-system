# Supabase Research: Implementation Patterns and Best Practices

## Overview

This document contains comprehensive research on Supabase documentation and implementation patterns for user table management, Row Level Security (RLS), transaction patterns, client usage, and database design.

## 1. User Table Management

### Table Alterations and Schema Changes

Based on Supabase documentation, table alterations should be handled through SQL migrations rather than the client libraries. The Python and JavaScript clients focus on data operations rather than schema modifications.

**Key Patterns:**
- Use Supabase Dashboard SQL Editor or migration scripts for schema changes
- Client libraries handle data operations: `select()`, `insert()`, `update()`, `upsert()`, `delete()`
- Filter operations work on row-level data, not schema modifications

**Migration Best Practices:**
- Execute schema changes through SQL migrations
- Use transactions for complex schema alterations
- Test migrations in development environment first
- Consider backward compatibility when adding columns with default values

### Client Timeout Configuration

**Python Client with Timeout Options:**
```python
import os
from supabase import create_client, Client
from supabase.client import ClientOptions

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(
  url,
  key,
  options=ClientOptions(
    postgrest_client_timeout=10,
    storage_client_timeout=10,
    schema="public",
  )
)
```

## 2. Row Level Security (RLS)

### Policy Creation Patterns

While the client documentation doesn't include specific RLS policy creation examples, it shows extensive filtering patterns that work with RLS policies.

**Filter Patterns (work with RLS policies):**
```python
# Python - Correct filter application
response = (
  supabase.table("instruments")
  .select("name, section_id")
  .eq("name", "flute")
  .execute()
)

# Filter chaining
response = (
  supabase.table("cities")
  .select("name, country_id")
  .gte("population", 1000)
  .lt("population", 10000)
  .execute()
)
```

```typescript
// JavaScript - Filter application
const { data, error } = await supabase
 .from('instruments')
 .select('name, section_id')
 .eq('name', 'violin')

// Conditional chaining
const filterByName = null
const filterPopLow = 1000
const filterPopHigh = 10000
let query = supabase
 .from('cities')
 .select('name, country_id')
if (filterByName) {
  query = query.eq('name', filterByName)
}
if (filterPopLow) {
  query = query.gte('population', filterPopLow)
}
if (filterPopHigh) {
  query = query.lt('population', filterPopHigh)
}
const { data, error } = await query
```

**RLS Best Practices:**
- RLS policies are created at the database level, not through client libraries
- Client queries automatically respect RLS policies
- Use authentication context in policies to filter user-specific data
- Test RLS policies with different user roles

### User-Specific Access Patterns

**Authentication State Management:**
```python
# Python - Authentication patterns
response = supabase.auth.sign_in_with_password({
  "email": "email@example.com",
  "password": "example-password",
})

# Link identities
response = supabase.auth.link_identity(
  {"provider": "github"}
)
```

```javascript
// JavaScript - Auth state monitoring
supabase.auth.onAuthStateChange((event, session) => {
 if (event === 'SIGNED_OUT') {
  console.log('SIGNED_OUT', session)
  // Clear local and session storage
  [window.localStorage, window.sessionStorage].forEach((storage) => {
   Object.entries(storage).forEach(([key]) => {
    storage.removeItem(key)
   })
  })
 }
})

// OAuth patterns
supabase.auth.onAuthStateChange((event, session) => {
 if (session && session.provider_token) {
  window.localStorage.setItem('oauth_provider_token', session.provider_token)
 }
})
```

## 3. Transaction Patterns

### Atomic Operations with RPC

**Python RPC Patterns:**
```python
# Bulk processing with RPC
response = (
  supabase.rpc("add_one_each", {"arr": [1, 2, 3]})
  .execute()
)

# RPC with filters
response = (
  supabase.rpc("list_stored_planets")
  .eq("id", 1)
  .single()
  .execute()
)

# Read-only RPC
response = (
  supabase.rpc("hello_world", get=True)
  .execute()
)
```

**Upsert Operations:**
```python
# Python upsert pattern (atomic insert/update)
response = (
  supabase.table("instruments")
  .upsert({"id": 1, "name": "violin", "section_id": 2})
  .execute()
)
```

### Error Handling Patterns

**Standard Error Handling:**
```javascript
// JavaScript error handling
const { data, error } = await supabase
 .from('characters')
 .select('name')
 .limit(1)
 .single()

if (error) {
  console.error('Database error:', error)
  // Handle specific error types
  if (error.code === 'PGRST116') {
    // No rows returned
  }
}
```

**Timeout Handling:**
```javascript
// Set query timeout
const { data, error } = await supabase
 .from('very_big_table')
 .select()
 .abortSignal(AbortSignal.timeout(1000 /* ms */))
```

### Rollback Strategies

**Transaction Isolation:**
- Use PostgreSQL transactions through RPC functions for complex operations
- Implement rollback logic in stored procedures
- Client-side operations are individual transactions unless wrapped in RPC

## 4. Client Usage Patterns

### Python Client for FastAPI

**Basic Client Setup:**
```python
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
```

**Async Patterns:**
```python
# Real-time subscriptions
channel = supabase.channel("room1")

def on_subscribe(status, err):
  if status == RealtimeSubscribeStates.SUBSCRIBED:
    asyncio.create_task(channel.send_broadcast(
      "cursor-pos",
      {"x": random.random(), "y": random.random()}
    ))

def handle_broadcast(payload):
  print("Cursor position received!", payload)

await channel.on_broadcast(
  event="cursor-pos",
  callback=handle_broadcast
).subscribe(on_subscribe)
```

### JavaScript/TypeScript Client for React

**Client Configuration:**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key'
)
```

**React Native with Secure Storage:**
```javascript
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

const supabase = createClient("https://xyzcompany.supabase.co", "publishable-key", {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### Real-time Subscriptions

**Presence Tracking:**
```javascript
// JavaScript presence patterns
const channel = supabase.channel('room1')
channel
 .on('presence', { event: 'sync' }, () => {
  console.log('Synced presence state: ', channel.presenceState())
 })
 .on('presence', { event: 'join' }, ({ newPresences }) => {
  console.log('Newly joined presences: ', newPresences)
 })
 .on('presence', { event: 'leave' }, ({ leftPresences }) => {
  console.log('Newly left presences: ', leftPresences)
 })
 .subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
   await channel.track({ online_at: new Date().toISOString() })
  }
 })
```

**Database Change Subscriptions:**
```javascript
// Subscribe to database changes
const subscription = supabase
  .channel('table-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'transactions' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## 5. Database Design Patterns

### Transaction Table Schemas

**Recommended Transaction Table Structure:**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending',
  transaction_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

### Foreign Key Relationships

**Complex Relationship Queries:**
```javascript
// Query nested foreign tables
const { data, error } = await supabase
 .from('messages')
 .select(`
  content,
  from:users!messages_sender_id_fkey(name),
  to:users!messages_receiver_id_fkey(name)
 `)

// Query through join tables
const { data, error } = await supabase
  .from('games')
  .select(`
   game_id:id,
   away_team:teams!games_away_team_fkey (
    users (
     id,
     name
    )
   )
  `)
```

### Indexing Strategies

**Query Optimization Patterns:**
```javascript
// Range queries (benefit from indexes)
const { data, error } = await supabase
 .from('reservations')
 .select()
 .rangeLte('during', '[2000-01-01 14:00, 2000-01-01 16:00)')

// Text search (requires indexes)
const result = await supabase
 .from("texts")
 .select("content")
 .textSearch("content", `'eggs' & 'ham'`, {
  config: "english",
 })
```

### Audit Logging Patterns

**JSONB Metadata Storage:**
```python
# Store flexible metadata
response = (
  supabase.table("users")
  .select("name")
  .contained_by("address", {})
  .execute()
)
```

## 6. Security Best Practices

### Authentication Flows

**Password Reset Flow:**
```javascript
/**
 * Step 1: Send reset email
 */
const { data, error } = await supabase.auth
 .resetPasswordForEmail('user@email.com')

/**
 * Step 2: Handle password update
 */
useEffect(() => {
 supabase.auth.onAuthStateChange(async (event, session) => {
  if (event == "PASSWORD_RECOVERY") {
   const newPassword = prompt("What would you like your new password to be?")
   const { data, error } = await supabase.auth
    .updateUser({ password: newPassword })

   if (data) alert("Password updated successfully!")
   if (error) alert("There was an error updating your password.")
  }
 })
}, [])
```

**Multi-Factor Authentication:**
```javascript
// Enroll TOTP factor
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'your_friendly_name'
})
```

### Admin Functions

**User Management:**
```python
# Python admin functions
response = supabase.auth.admin.invite_user_by_email("email@example.com")

# Generate admin links
response = supabase.auth.admin.generate_link({
  "type": "signup",
  "email": "email@example.com",
  "password": "secret",
})
```

## 7. Performance Optimizations

### Query Optimization

**Single vs Multiple Results:**
```javascript
// Single result (throws error if no results)
const { data, error } = await supabase
 .from('characters')
 .select('name')
 .limit(1)
 .single()

// Maybe single (returns null if no results)
const { data, error } = await supabase
 .from('characters')
 .select()
 .eq('name', 'Katniss')
 .maybeSingle()
```

**Pagination Patterns:**
```javascript
// Limit and offset
const { data, error } = await supabase
 .from('characters')
 .select('name')
 .range(0, 9) // First 10 records
```

### Storage Optimization

**File Operations:**
```python
# Python storage patterns
with open("./public/avatar1.png", "rb") as f:
  response = (
    supabase.storage
    .from_("avatars")
    .upload(
      file=f,
      path="public/avatar1.png",
      file_options={"cache-control": "3600", "upsert": "false"}
    )
  )
```

## 8. Implementation Recommendations

### For Transaction Systems

1. **Use RLS policies** for user-specific transaction access
2. **Implement audit logging** with JSONB metadata fields
3. **Use RPC functions** for complex transaction operations requiring atomicity
4. **Handle errors gracefully** with proper error codes and user feedback
5. **Implement proper indexing** on frequently queried fields (user_id, created_at, status)

### For Real-time Features

1. **Use presence tracking** for user activity monitoring
2. **Subscribe to specific table changes** rather than broad listeners
3. **Implement reconnection logic** for unstable connections
4. **Clean up subscriptions** to prevent memory leaks

### For Authentication

1. **Implement proper OAuth handling** with token storage
2. **Use auth state changes** for UI updates
3. **Handle session expiration** gracefully
4. **Implement MFA** for sensitive operations

## 9. Common Patterns Summary

### Error Handling
- Always check for `error` in response objects
- Implement specific error code handling
- Use timeout controls for long-running queries
- Log errors for debugging while maintaining user privacy

### Data Fetching
- Use method chaining for filters: `select()` → `filter()` → `execute()`
- Apply RLS policies automatically through authentication context
- Use `single()` vs `maybeSingle()` appropriately
- Implement pagination for large datasets

### Real-time Updates
- Subscribe to specific events rather than all changes
- Clean up subscriptions in component unmount/cleanup
- Handle connection state changes
- Use presence for user activity tracking

This research provides a comprehensive foundation for implementing Supabase in transaction-heavy applications with proper security, error handling, and real-time capabilities.