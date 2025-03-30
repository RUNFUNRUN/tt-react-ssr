import type { Endpoints } from '@octokit/types';
import { Octokit } from 'octokit';
import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';

type UserInfo = Endpoints['GET /users/{username}']['response']['data'];

const App = () => {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const octokit = new Octokit();
    const { data } = await octokit.rest.users.getByUsername({
      username: query,
    });
    setIsSubmitting(false);
    setUserInfo(data);
    console.table(data);
  };

  return (
    <main className='w-[800px] mx-auto my-12 space-y-4'>
      <h1 className='text-center text-2xl font-bold'>GitHub ユーザー検索</h1>
      <form className='flex gap-4' onSubmit={handleSubmit}>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button
          type='submit'
          className='w-24'
          disabled={!query || isSubmitting}
        >
          検索
        </Button>
      </form>
      {userInfo && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>URL</TableHead>
              <TableHead>
                <a
                  href={userInfo.html_url}
                  target='_blank'
                  rel='noreferrer'
                  className='underline text-blue-600'
                >
                  {userInfo.html_url}
                </a>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(userInfo).map(([key, value]) => {
              if (key === 'avatar_url') {
                return (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      <img src={value as string} alt='github avatar' />
                    </TableCell>
                  </TableRow>
                );
              }
              if (key.includes('url')) {
                return null;
              }
              return (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value?.toString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </main>
  );
};

export default App;
