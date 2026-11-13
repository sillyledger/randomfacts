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
  // overflow-x-clip: a fact card swiped off screen must not add horizontal scroll.
  // On phones the deck page's header and main fill the visible screen, so the card can size to what's left and
  // the buttons stay above the browser toolbar; the footer follows below the fold. Elsewhere the wrapper is `contents`.
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-pageBg">
      <div className={width === 'deck' ? 'flex flex-1 flex-col max-md:min-h-visible-screen md:contents' : 'contents'}>
        <SiteNav />
        <main className={`mx-auto flex w-full flex-1 flex-col ${widthClass[width]}`}>{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
