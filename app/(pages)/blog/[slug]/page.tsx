import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

import Grid from '@components/Grid'
import Row from '@components/Row'
import Badge from '@components/Badge'
import ActionListItem from '@components/ActionListItem'
import BreadCrumbs from '@components/BreadCrumbs'

interface PostProps {
  params: {
    slug: string
  }
}

interface Post {
  title: string
  description: string
  date: string
  tags: string[]
  content: string
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags || [],
      content,
    }
  } catch (error) {
    console.error('Error getting blog post:', error)
    return null
  }
}

export async function generateMetadata({ params }: PostProps) {
  const post = await getPost(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPost({ params }: PostProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="blog-container">
      <br />
      <Grid>
        <Row>
          <BreadCrumbs
            items={[
              { name: '首页', url: '/' },
              { name: '博客', url: '/blog' },
              { name: post.title, url: `/blog/${params.slug}` },
            ]}
          />
        </Row>
      </Grid>

      <Grid>
        <Row>
          <div className="blog-header">
            <h1>{post.title}</h1>
          </div>
        </Row>
        <br />
        <Row>
          <div className="post-meta">
            <time>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </Row>
        <Row>
          <div className="post-tags">
            {post.tags.map(tag => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </Row>
        <br />
        <br />

        <article className="blog-content">
          <MDXRemote source={post.content} />
        </article>
      </Grid>

      <Grid>
        <ActionListItem icon="←" href="/blog">
          返回文章列表
        </ActionListItem>
      </Grid>
    </div>
  )
}
