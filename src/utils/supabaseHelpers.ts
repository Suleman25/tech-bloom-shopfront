
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * A helper function to query any table in Supabase without type safety
 */
export function queryTable(table: string) {
  // @ts-ignore - Intentionally bypassing type safety
  return supabase.from(table);
}

/**
 * A helper function to call RPC functions in Supabase without type safety
 */
export function rpc(fn: string, params?: Record<string, unknown>) {
  // @ts-ignore - Intentionally bypassing type safety
  return supabase.rpc(fn, params);
}

/**
 * A helper function to safely assert the type of a response
 */
export function safelyAssertType<T>(data: any): T {
  return data as T;
}
