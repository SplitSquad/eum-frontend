import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import Grid from '@/components/layout/Grid';

function Debate() {
  return (
    <>
      <PageWrapper subtitle="토론 서브타이틀">
        <Container as="article">토론 홈페이지 article</Container>
        <Grid cols="grid-cols-2 md:grid-cols-4" gap="gap-x-6 gap-y-10">
          <div className="bg-white p-4 shadow rounded">Item 1</div>
          <div className="bg-white p-4 shadow rounded">Item 2</div>
          <div className="bg-white p-4 shadow rounded">Item 3</div>
          <div className="bg-white p-4 shadow rounded">Item 4</div>
        </Grid>
      </PageWrapper>
    </>
  );
}

export default Debate;
