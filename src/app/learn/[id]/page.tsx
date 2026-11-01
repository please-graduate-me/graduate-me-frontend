import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LessonLoader } from "@/components/lesson";
export default async function Learn({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.user) redirect("/");
  return <LessonLoader videoId={(await params).id} />;
}
