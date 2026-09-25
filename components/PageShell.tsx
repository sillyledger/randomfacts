import { SiteFooter } from '@/components/SiteFooter';
import { SiteNav } from '@/components/SiteNav';

const widthClass = {
  deck: 'max-w-[438px] px-6',
  wide: 'max-w-[960px] px-5',
};

export function PageShell({
  children,
  width = 'wide',
}: {
  children: React.ReactNode;
  width?: keyof typeof widthClass;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-pageBg">
      <SiteNav />
      <main className={`mx-auto flex w-full flex-1 flex-col ${widthClass[width]}`}>{children}</main>
      <SiteFooter />
    </div>
  );
}
