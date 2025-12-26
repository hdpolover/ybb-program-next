import { redirect } from 'next/navigation';

export default function DocumentsIndexRedirect() {
  redirect('/dashboard/documents/program');
}
