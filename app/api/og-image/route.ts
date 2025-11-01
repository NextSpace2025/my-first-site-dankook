import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  try {
    // Vercel 환경에서도 안전하게 파일 접근
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    // 파일 시스템 접근 시도
    try {
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir)
        const profileImage = files.find(file => 
          file.startsWith('hero-profile') && 
          (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp'))
        )
        
        if (profileImage) {
          const imagePath = path.join(uploadsDir, profileImage)
          
          // 파일이 존재하는지 확인
          if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath)
            
            // 이미지 타입 결정
            const ext = path.extname(profileImage).toLowerCase()
            const contentType = 
              ext === '.png' ? 'image/png' :
              ext === '.webp' ? 'image/webp' :
              'image/jpeg'
            
            return new NextResponse(imageBuffer, {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
              },
            })
          }
        }
      }
    } catch (fileError) {
      // 파일 시스템 접근 실패 시 기본 이미지 반환
      console.warn('파일 시스템 접근 실패, 기본 OG 이미지 사용:', fileError)
    }
    
    // 프로필 이미지가 없으면 기본 OG 이미지 생성 (단색 배경)
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#3b82f6"/>
        <text x="50%" y="50%" font-family="Pretendard, sans-serif" font-size="72" fill="white" text-anchor="middle" dominant-baseline="middle">
          나의 포트폴리오
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('OG 이미지 생성 실패:', error)
    // 에러 발생 시에도 기본 SVG 반환
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#3b82f6"/>
        <text x="50%" y="50%" font-family="Pretendard, sans-serif" font-size="72" fill="white" text-anchor="middle" dominant-baseline="middle">
          나의 포트폴리오
        </text>
      </svg>
    `
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}