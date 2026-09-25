import { SiteNav } from '@/components/SiteNav';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-pageBg px-6 py-8">
      <div className="flex w-full max-w-[390px] flex-1 flex-col">
        <SiteNav />
        {children}
        <div className="mt-auto flex justify-center pb-4 pt-10">
          <span className="text-xs font-semibold tracking-wide text-chromeText/40">Random Facts</span>
        </div>
      </div>
    </main>
  );
}
