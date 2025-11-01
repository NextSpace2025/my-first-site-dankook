import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { InlineEditorProvider } from "@/contexts/inline-editor-context"
import { SiteTitle } from "@/components/site-title"
import { getMetadata } from "@/lib/metadata"
import "./globals.css"

// 동적 메타데이터 생성 (Vercel 환경 변수 자동 감지)
export function generateMetadata(): Metadata {
  const metadataInfo = getMetadata()
  
  // Vercel 환경 변수 자동 감지 또는 명시적 설정
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                  'http://localhost:3000'
  
  return {
    metadataBase: new URL(siteUrl),
    title: metadataInfo.siteTitle,
    description: metadataInfo.description,
    keywords: ["포트폴리오", "개발자", "프론트엔드", "웹개발"],
    authors: [{ name: "당신의 이름" }],
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: siteUrl,
      title: metadataInfo.siteTitle,
      description: metadataInfo.description,
      siteName: metadataInfo.siteTitle,
      images: [
        {
          url: "/api/og-image", // 상대 경로로 변경 (절대 URL은 metadataBase에서 자동 처리)
          width: 1200,
          height: 630,
          alt: "프로필 이미지",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataInfo.siteTitle,
      description: metadataInfo.description,
      images: ["/api/og-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          as="style" 
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" 
        />
        {/* 카카오톡 공유 최적화 */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body className="font-pretendard" suppressHydrationWarning>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <InlineEditorProvider>
            <SiteTitle />
            {children}
          </InlineEditorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
