import { SWRConfig } from 'swr';
import type { FC, ReactNode } from 'react';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'An error occurred while fetching data.');
  }
  return res.json();
};

interface SWRProviderProps {
  children: ReactNode;
}

const SWRProvider: FC<SWRProviderProps> = ({ children }) => (
  <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
    {children}
  </SWRConfig>
);

export default SWRProvider;
