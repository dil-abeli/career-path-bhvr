import { helloGet } from '@/lib/api/hello/hello.get'

export const req = async (useCase: string) => {
  try {
    if (useCase === 'hello') {
      const data = await helloGet()
      return data
    }
    return null
  } catch (error) {
    console.log(error)
  }
}
