import { Request, Response } from 'express'
import { generatePrompt, getAIResponse } from '../helper/openai'

class OpenAIController {
  // Define getRecommendations as a method
  async getRecommendations(req: Request, res: Response) {
    const userInput = req.body.input

    try {
      const prompt = generatePrompt(userInput)
      const aiResponse = await getAIResponse(prompt)
      const extractedData = this.processAIResponse(aiResponse)

      res.json({ success: true, data: extractedData })
    } catch (error) {
      console.error('Error getting recommendations:', error)
      res
        .status(500)
        .json({ success: false, message: 'Failed to get recommendations.' })
    }
  }

  // Define processAIResponse as a method
  private processAIResponse(aiResponse: string) {
    const processedResponse: Record<string, string[]> = {}

    const lines = aiResponse
      .trim()
      .split('\n')
      .filter((line) => line.trim())

    lines.forEach((line) => {
      const [key, value] = line.split(':').map((str) => str.trim())
      if (value) {
        processedResponse[key] = value.split(',').map((item) => item.trim())
      }
    })

    return processedResponse
  }
}

export default new OpenAIController()
