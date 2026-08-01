import { createClient } from "@supabase/supabase-js";

// .env.local 의 공개 키를 읽어옵니다. (NEXT_PUBLIC_ 접두사가 붙은 값만 브라우저에 노출됩니다)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경변수가 없습니다. .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정하세요."
  );
}

// 앱 전체에서 이 supabase 인스턴스를 import 해서 사용합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
