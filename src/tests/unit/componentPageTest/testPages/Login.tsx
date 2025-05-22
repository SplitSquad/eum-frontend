import AppLayout from '@/components/layout/LegacyAppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import Grid from '@/components/layout/Grid';
import Eum from '@/assets/images/characters/이음이.png';
import Button from '@/components/base/Button';

function Login() {
  const loginHandler = () => {
    alert('구글 소셜 로그인 호출 했다 칩시다.');
    /*추후 로그인 api 호출*/
  };

  return (
    <AppLayout>
      <PageWrapper title="환영합니다">
        <Container className="flex flex-col items-center justify-center text-center gap-6 max-w-md mx-auto py-12">
          {/* 이음이 캐릭터 */}
          <img src={Eum} alt="이음이" className="h-40 w-auto object-contain drop-shadow-md" />

          {/* 환영 메시지 */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              이음 서비스에 오신 것을 환영합니다!
            </h1>
            <p className="text-sm text-gray-500">소셜 로그인으로 빠르게 시작해보세요.</p>
          </div>

          {/* 시작하기 버튼 */}
          <Button variant="submit" size="lg" onClick={loginHandler}>
            시작하기
          </Button>
        </Container>
      </PageWrapper>
    </AppLayout>
  );
}

export default Login;
