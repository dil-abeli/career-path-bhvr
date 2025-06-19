import { client } from '@/lib/api/client'

export const helloGet = async () => {
  try {
    const res = await client.hello.$get()
    if (!res.ok) {
      console.log('Error fetching data')
      return
    }
    const data = await res.json()

    return data
  } catch (error) {
    console.log(error)
  }
}
