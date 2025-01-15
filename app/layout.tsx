import '@root/global.scss';
import type { Metadata } from 'next'
import DefaultActionBar from '@components/page/DefaultActionBar';


export const metadata: Metadata = {
  title: '我的博客',
  description: '使用 Next.js 和 MDX 构建的个人博客',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="theme-light font-use-geist-mono blog-container" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('blog-theme-preference');
                if (theme) {
                  document.body.classList.remove('theme-light');
                  document.body.classList.add(theme);
                }
              } catch (e) {}
            `,
          }}
        />
        <DefaultActionBar />
        <main>{children}</main>
      </body>
    </html>
  )
}
