import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { STORAGE_KEYS } from "../constants/storageKeys";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function isPlaceholderEnv(value: string | undefined) {
  if (!value) return true;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  return /your-project|your-anon-key/i.test(trimmed);
}

const isSupabaseConfigured =
  !isPlaceholderEnv(supabaseUrl) && !isPlaceholderEnv(supabaseAnonKey);

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

let supabaseDisabled = !isSupabaseConfigured;

export async function getAnonymousId() {
  const storedId = await AsyncStorage.getItem(STORAGE_KEYS.anonymousId);

  if (storedId) {
    return storedId;
  }

  const id = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(STORAGE_KEYS.anonymousId, id);
  return id;
}

export async function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
) {
  if (!supabase || supabaseDisabled) {
    return;
  }

  try {
    const anonymousUserId = await getAnonymousId();
    const { error } = await supabase.from("usage_events").insert({
      anonymous_user_id: anonymousUserId,
      event_name: eventName,
      properties,
    });

    if (error) {
      console.warn(
        "[analytics] supabase 응답 에러 — 이후 이벤트 전송은 스킵된다",
        error.message,
      );
      supabaseDisabled = true;
    }
  } catch (error) {
    console.warn(
      "[analytics] supabase 요청 실패 — 이후 이벤트 전송은 스킵된다",
      error,
    );
    supabaseDisabled = true;
  }
}
