import { Request, Response } from "express";
import { generatePrompt, getAIResponse } from "../helper/openai";
import * as fs from "fs";
import * as path from "path";

class OpenAIController {
  async getRecommendations(req: Request, res: Response) {
    const userInput = req.body.input;
    const bodyTemplatePath = path.join(__dirname, "../helper/body.json");
    const bodyTemplate = JSON.parse(fs.readFileSync(bodyTemplatePath, "utf8"));

    function processAIResponse(aiResponse: string) {
      const processedResponse: Record<string, string[]> = {};

      const lines = aiResponse
        .trim()
        .split("\n")
        .filter((line) => line.trim());

      lines.forEach((line) => {
        const [key, value] = line.split(":").map((str) => str.trim());
        if (value) {
          processedResponse[key] = value.split(",").map((item) => item.trim());
        }
      });

      return processedResponse;
    }

    function generateSearchBody(template, aiResponse) {
      console.log(typeof aiResponse);

      if (typeof aiResponse !== "object" || aiResponse === null) {
        throw new Error("Invalid AI response format");
      }

      for (const [category, values] of Object.entries(aiResponse)) {
        const key = category.replace("- ", "").trim(); // Remove the '- ' prefix and trim whitespace
        //console.log("KEY: ", key);
        //console.log("VALUE: ", values);

        if (template[key]) {
          template[key].forEach((item) => {
            // For the 'Colour' category, compare with the 'alt' property
            if (key === "Colour") {
              if (Array.isArray(values) && values.includes(item.alt)) {
                item.isChecked = true;
              }
            } else {
              if (Array.isArray(values) && values.includes(item.name)) {
                item.isChecked = true;
              }
            }
          });
        }
      }
      return template;
    }

    try {
      const prompt = generatePrompt(userInput);
      const aiResponse = await getAIResponse(prompt);
      // console.log("BODY: ", aiResponse);
      const extractedData = processAIResponse(aiResponse);
      console.log("DATA: ", extractedData);
      const searchBody = generateSearchBody(bodyTemplate, extractedData);
      console.log("BODY: ", searchBody);

      res.json({ success: true, data: searchBody });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get recommendations." });
    }
  }
}

export default new OpenAIController();
