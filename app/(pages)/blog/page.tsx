import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import Grid from '@components/Grid'
import Row from '@components/Row'
import Badge from '@components/Badge'
import ActionListItem from '@components/ActionListItem'


export const dynamic = 'force-static';

interface Post {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
}

async function getBlogPosts(): Promise<Post[]> {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/blog')
    const files = await fs.readdir(postsDirectory)

    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.mdx'))
        .map(async file => {
          const filePath = path.join(postsDirectory, file)
          const fileContents = await fs.readFile(filePath, 'utf8')
          const { data } = matter(fileContents)

          return {
            slug: file.replace('.mdx', ''),
            title: data.title,
            description: data.description,
            date: data.date,
            tags: data.tags || [],
          }
        })
    )

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error getting blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className='blog-container'>
      <Grid>
        <Row>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold">博客文章</h1>
          </div>
          <br />
          <br />
        </Row>

        <Row>
          <div className="blog-posts">
            {posts.map(post => (
              <div key={post.slug}>
                <Link href={`/blog/${post.slug}`}>
                  <h4>{post.title}</h4>
                </Link>
                <span className="post-description">{post.description}</span>
                <div className="post-meta">
                  <time>
                    {new Date(post.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Row>
      </Grid>
    </div>
  )
}
