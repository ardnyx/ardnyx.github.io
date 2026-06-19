import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.coerce.date(),
    tags:        z.array(z.string()).default([]),
    stack:       z.array(z.string()).default([]),
    link:        z.string().url().optional(),
    github:      z.string().url().optional(),
    cover:       z.string().optional(),
    featured:    z.boolean().default(false),
  }),
});

const writeups = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.coerce.date(),
    category:    z.enum(['ctf', 'malware']),
    tags:        z.array(z.string()).default([]),
    difficulty:  z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    event:       z.string().optional(),
    featured:    z.boolean().default(false),
  }),
});

const achievements = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    date:        z.coerce.date(),
    type:        z.enum(['cert', 'course', 'award', 'competition']),
    issuer:      z.string().optional(),
    link:        z.string().url().optional(),
    credential:  z.string().optional(),
  }),
});

export const collections = { projects, writeups, achievements };
