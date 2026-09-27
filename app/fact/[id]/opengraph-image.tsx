import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { CategoryIcon } from '@/components/CategoryIcon';
import { categoryTokens } from '@/lib/categories';
import { getFact, getFacts } from '@/lib/facts';
import { SITE_URL, factPath } from '@/lib/site';

export const alt = 'A fact card from Random Facts';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getFacts().map((fact) => ({ id: fact.id }));
}

// next/og can't read woff2, so the preview uses TTF copies of the site font.
const fontFile = (weight: number) => readFile(join(process.cwd(), `assets/fonts/PlusJakartaSans-${weight}.ttf`));

export default async function Image({ params }: { params: { id: string } }) {
  const fact = getFact(params.id);
  if (!fact) throw new Error(`No fact with id "${params.id}"`);
  const tokens = categoryTokens[fact.category];

  const [medium, extraBold, logo] = await Promise.all([
    fontFile(500),
    fontFile(800),
    readFile(join(process.cwd(), 'public/logo.svg')),
  ]);
  const pageUrl = `${SITE_URL}${factPath(fact.id)}`.replace(/^https?:\/\//, '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          backgroundColor: tokens.bg,
          fontFamily: 'Plus Jakarta Sans',
          color: '#15171A',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/svg+xml;base64,${logo.toString('base64')}`} width={56} height={56} alt="" />
            <span style={{ fontSize: 30, fontWeight: 800 }}>random facts</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: tokens.accent,
            }}
          >
            <CategoryIcon category={fact.category} width={44} height={44} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, gap: 22 }}>
          <div style={{ display: 'block', fontSize: fact.title.length > 60 ? 52 : 62, fontWeight: 800, lineHeight: 1.12, lineClamp: 3 }}>
            {fact.title}
          </div>
          <div style={{ display: 'block', fontSize: 30, fontWeight: 500, lineHeight: 1.45, color: '#31333A', lineClamp: 3 }}>
            {fact.explain}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, fontWeight: 500, color: 'rgba(21,23,26,0.6)' }}>{pageUrl}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Plus Jakarta Sans', data: medium, weight: 500, style: 'normal' },
        { name: 'Plus Jakarta Sans', data: extraBold, weight: 800, style: 'normal' },
      ],
    },
  );
}
