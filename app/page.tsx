import { Container } from '@/components/shared/container';
import { Today } from '@/components/shared/today/today';

export default function Home() {
  return (
    <div>
      <Container>
        <Today />
      </Container>
    </div>
  );
}
