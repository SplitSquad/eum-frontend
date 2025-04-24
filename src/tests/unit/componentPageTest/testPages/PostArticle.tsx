import AppLayout from '@/components/layout/AppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import Grid from '@/components/layout/Grid';
import TextField from '@/components/base/TextField';

function PostArticle() {
  return (
    <>
      <AppLayout>
        <PageWrapper>
          <Container as="main">
            테스트
            <h2>테스트 필드 테스트</h2>
            <TextField />
          </Container>
        </PageWrapper>
      </AppLayout>
    </>
  );
}

export default PostArticle;
