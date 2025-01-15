import * as React from 'react';
import Card from '@components/Card';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Avatar from '@components/Avatar';
import Indent from '@components/Indent';

import Grid from '@components/Grid';
import Row from '@components/Row';
import Badge from '@components/Badge';
import ActionListItem from '@components/ActionListItem';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: filename.replace('.mdx', ''),
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags || [],
      };
    })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="blog-container">
      <Grid>
        <Row>
          <Avatar src="/assets/avatar.jpg" target="_blank">
            <Indent>
              Kirby
              <br />
              Design Enignner
            </Indent>
          </Avatar>
          <br />
          <p>
            I currently work at Jungle, where I focus on refining products to create smooth and polished user interfaces. Previously, I worked at Exata Tech, where I contributed to the development of web applications for clients such as General Motors, Goodyear, and Baanko.
          </p>
        </Row>
      </Grid>

      <Grid>
        <Row>
          <div className="blog-posts">
            {posts.map((post) => (
              <div
                key={post.slug}
              >
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
      </Grid >

      <Grid>
        <Row>
          <ActionListItem
            icon="⭢"
            href="https://github.com/your-username"
            target="_blank"
          >
            在 GitHub 上查看源码
          </ActionListItem>
          <ActionListItem
            icon="⭢"
            href="/rss.xml"
            target="_blank"
          >
            订阅 RSS 更新
          </ActionListItem>
        </Row>
      </Grid>
    </div>
  );
}

