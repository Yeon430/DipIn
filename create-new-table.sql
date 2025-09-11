-- 완전히 새로운 user_profiles 테이블 생성

-- 기존 테이블 완전 삭제
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 새로운 테이블 생성 (최소한의 필드만)
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- RLS 비활성화
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 테스트 데이터 삽입
INSERT INTO user_profiles (user_id, name, email)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Test User', 'test@example.com');





