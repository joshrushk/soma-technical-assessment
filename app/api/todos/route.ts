import { fetchImageUrl } from '@/lib/pexels';
export async function POST(req: Request) {
  const body = await req.json();
  const { title, dueDate, dependencyIds = [] } = body;
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const imageUrl = await fetchImageUrl(title);

  // Continue with todo creation (
  const tempTodo = await prisma.todo.create({
    data: {
      title,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      imageUrl,
    },
  });

  const cycle = await hasCycle(tempTodo.id, dependencyIds);
  if (cycle) {
    await prisma.todo.delete({ where: { id: tempTodo.id } });
    return NextResponse.json({ error: 'Circular dependency detected' }, { status: 400 });
  }

  const updatedTodo = await prisma.todo.update({
    where: { id: tempTodo.id },
    data: {
      dependencies: {
        connect: dependencyIds.map((id: number) => ({ id })),
      },
    },
    include: {
      dependencies: true,
    },
  });

  return NextResponse.json(updatedTodo, { status: 201 });
}
