"use client";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <Container>
      <Card className="flex flex-col gap-4 p-4 items-center">
        <Image src="/404.png" alt="404 image" width={250} height={250} />
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight text-center">
          Упс! Страница не найдена!
        </h2>
        <Button variant="secondary" onClick={() => router.push("/")}>
          На главный
        </Button>
      </Card>
    </Container>
  );
}
