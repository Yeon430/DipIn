-- user_profiles 테이블 수정

-- 기존 테이블 삭제
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 새로운 user_profiles 테이블 생성 (외래키 제약조건 없이)
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- 외래키 제약조건 제거
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  avatar TEXT,
  company VARCHAR(255),
  major VARCHAR(100),
  grade VARCHAR(50),
  interests TEXT[],
  goal VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0,
  response_time VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 인덱스 생성
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- RLS 비활성화
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;










