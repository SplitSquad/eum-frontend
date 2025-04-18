import AppLayout from '@/components/layout/AppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import Grid from '@/components/layout/Grid';
function Community() {
  return (
    <>
      <AppLayout>
        <PageWrapper>
          <Container as="section">community 바디 section 체크</Container>
          <Grid cols="grid-cols-2 md:grid-cols-4" gap="gap-x-6 gap-y-10">
            <div className="bg-white p-4 shadow rounded">Item 1</div>
            <div className="bg-white p-4 shadow rounded">Item 2</div>
            <div className="bg-white p-4 shadow rounded">Item 3</div>
            <div className="bg-white p-4 shadow rounded">Item 4</div>
          </Grid>
        </PageWrapper>
      </AppLayout>
    </>
  );
}

export default Community;
