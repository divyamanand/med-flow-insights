import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

type Doctor = {
  id: string
  name: string
  department: string
  status: 'on-duty' | 'off-duty'
}

export default function Doctors() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors', 'list'],
    queryFn: () => api.get<Doctor[]>('/doctors'),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctors</CardTitle>
        <CardDescription>Active doctors and departments</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading...</div>
        ) : error ? (
          <div className="text-destructive">{(error as Error).message}</div>
        ) : data && data.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.department}</TableCell>
                  <TableCell className="capitalize">{d.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No doctors</EmptyTitle>
              <EmptyDescription>Connect your doctors endpoint.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
