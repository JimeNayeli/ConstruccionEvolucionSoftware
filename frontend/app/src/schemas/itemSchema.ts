import { z } from "zod"

export const itemSchema = z.object({
  name: z.string().max(30).min(10).trim(),
  description: z.string().max(100).min(10).trim(),
  startingPrice: z.preprocess((val) => Number(val), z.number().min(1)),
})

export type Item = z.infer<typeof itemSchema>
