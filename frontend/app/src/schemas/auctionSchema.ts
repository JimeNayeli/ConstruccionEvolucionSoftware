import moment from "moment"
import { z } from "zod"

export const auctionSchema = z.object({
  name: z.string().max(30).min(5).trim(),
  description: z.string().max(100).min(5).trim(),
  closingTime: z.preprocess((arg) =>  {
      if (typeof arg === 'string') {
        return new Date(arg);
      }
  }, z.date().min(new Date())) 
})

export type Auction = z.infer<typeof auctionSchema>
