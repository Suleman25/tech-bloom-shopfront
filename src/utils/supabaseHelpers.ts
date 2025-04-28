
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * A helper function to query any table in Supabase without type safety
 * Returns the query builder for further chaining
 */
export function queryTable<T = any>(table: string) {
  // Direct client usage to bypass TypeScript restrictions
  const client = supabase as any;
  return client.from(table) as PostgrestFilterBuilder<any, any, T>;
}

/**
 * A helper function to call RPC functions in Supabase without type safety
 */
export function rpc<T = any>(fn: string, params?: Record<string, unknown>): Promise<{ data: T | null; error: any }> {
  // @ts-ignore - Intentionally bypassing type safety
  return supabase.rpc(fn, params);
}

/**
 * A helper function to safely assert the type of a response
 * This is particularly useful when dealing with tables that aren't fully typed
 */
export function safelyAssertType<T>(data: any): T {
  return data as T;
}

/**
 * A type assertion utility for explicitly handling database query results
 * Use this when TypeScript can't infer the correct type from a query result
 */
export function assertType<T>(data: any): T {
  // This is just a more explicit alias for type casting
  return data as T;
}
