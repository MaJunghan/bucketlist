-- bucketlist 데이터베이스에 접속한 후 실행할 SQL 명령어들

-- 1. 현재 스키마 권한 확인
SELECT schema_name, schema_owner 
FROM information_schema.schemata 
WHERE schema_name = 'public';

-- 2. 사용자에게 스키마 권한 부여 (이미 했다면 다시 실행해도 무방)
GRANT ALL ON SCHEMA public TO test;
GRANT USAGE ON SCHEMA public TO test;

-- 3. 기본 권한 설정 (새로 생성되는 테이블에 자동으로 권한 부여)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO test;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO test;

-- 4. 기존 테이블이 있다면 권한 부여
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test;

-- 5. 권한 확인
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'test' AND table_schema = 'public';

-- 6. 스키마 소유자 확인 및 변경 (필요한 경우)
-- ALTER SCHEMA public OWNER TO test;


