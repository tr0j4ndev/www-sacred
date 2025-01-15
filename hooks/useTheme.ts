import { useState, useEffect } from 'react'

const THEME_KEY = 'blog-theme-preference'

export function useTheme() {
  const [theme, setTheme] = useState<string>('')

  // 初始化时从 localStorage 读取主题
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme) {
      setTheme(savedTheme)
      document.body.classList.forEach((className) => {
        if (className.startsWith('theme-')) {
          document.body.classList.remove(className)
        }
      })
      document.body.classList.add(savedTheme)
    }
  }, [])

  // 切换主题的函数
  const changeTheme = (newTheme: string) => {
    const themeToApply = newTheme || 'theme-light' // 如果没有传入主题，默认使用 light
    
    // 移除现有主题类
    document.body.classList.forEach((className) => {
      if (className.startsWith('theme-')) {
        document.body.classList.remove(className)
      }
    })

    // 添加新主题类
    document.body.classList.add(themeToApply)
    
    // 保存到 localStorage
    localStorage.setItem(THEME_KEY, themeToApply)
    
    setTheme(themeToApply)
  }

  return { theme, changeTheme }
} 
