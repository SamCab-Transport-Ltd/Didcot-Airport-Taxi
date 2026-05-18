import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container size="narrow" className="text-center">
        <p className="font-display text-7xl font-semibold text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-ink-secondary">
          The page you're looking for doesn't exist or has been moved. Try the
          home page or book your ride directly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Go home</Button>
          <Button href="/book" variant="outline">Book a ride</Button>
        </div>
      </Container>
    </section>
  );
}
