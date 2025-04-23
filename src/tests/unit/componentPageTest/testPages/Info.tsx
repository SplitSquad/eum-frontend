import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import Grid from '@/components/layout/Grid';

function Info() {
  return (
    <>
      <PageWrapper disableAnimation={true}>
        <Container className="bg-red-500">
          <div>정보 홈페이지</div>
          <Grid cols="grid-cols-2 md:grid-cols-4" gap="gap-x-6 gap-y-10">
            <div className="bg-white p-4 shadow rounded">Item 1</div>
            <div className="bg-white p-4 shadow rounded">Item 2</div>
            <div className="bg-white p-4 shadow rounded">Item 3</div>
            <div className="bg-white p-4 shadow rounded">Item 4</div>
          </Grid>
        </Container>
      </PageWrapper>
    </>
  );
}

export default Info;
