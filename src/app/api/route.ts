export async function get(req: Request, res: Response) {
    const data = { id: 1, name: 'John Doe' };
    return Response.json({ data });
}
