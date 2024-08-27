// import { OpenAI } from "openai";
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Filters and prompt template
const filters = {
  gender: ['Men', 'Women'],
  category: [
    'Leggings',
    'Shirts',
    'Coats & Jackets',
    'Joggers',
    'Hoodies & Sweatshirts',
    'Accessories',
    'Bags',
    'Bodysuits',
    'Button Down Shirts',
    'Capris',
    'Dresses',
    'Hair Accessories',
    'Hats',
    'Long Sleeve Shirts',
    'Pants',
    'Polo Shirts',
    'Shoes',
    'Short Sleeve Shirts',
    'Shorts',
    'Socks',
    'Sports Bras',
    'Sweaters',
    'Sweatpants',
    'T-Shirts',
    'Tank Tops',
    'Team Canada',
    'Track Pants',
    'Trousers',
    'Underwear',
    'Water Bottles',
    'Yoga Accessories',
    'Yoga Mats',
    'Hoodies',
  ],
  type: [
    'Athletic Jackets',
    'Athletic Shorts',
    'Bomber Jackets',
    'Bucket Hats',
    'Cardigans',
    'Chino Shorts',
    'Crewneck Sweatshirts',
    'Half Zip Sweatshirts',
    'High Neck Bras',
    'Hoodies',
    'Keychains',
    'Liner Shorts',
    'Longline Bras',
    'Onesies',
    'Puffer Jackets',
    'Pullover Sweaters',
    'Racerback Bras',
    'Rain Jackets',
    'Rompers',
    'Strappy Bras',
    'Sweat Shorts',
  ],
  activity: [
    'On the Move',
    'Bike',
    'Casual',
    'Dance',
    'Golf',
    'Hiking',
    'Running',
    'Swim',
    'Tennis',
    'Thermal',
    'Training',
    'Travel',
    'Work',
    'Workout',
    'Yoga',
  ],
  size: [
    '0',
    '2',
    '4',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '12',
    '14',
    '16',
    '18',
    '20',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '42',
    '44',
    '46',
    'XS',
    'XS/S',
    'S',
    'S/M',
    'M',
    'M/L',
    'L',
    'L/XL',
    'XL',
    'XL/XXL',
    'XXL',
    'XXXL',
    'ONE SIZE',
  ],
  sizeType: ['Plus Size', 'Tall', 'Short'],
  colour: [
    'Camo',
    'Khaki',
    'Neon',
    'Printed',
    'Black',
    'Blue',
    'Brown',
    'Burgundy',
    'Gold',
    'Green',
    'Grey',
    'Navy',
    'Neutral',
    'Olive',
    'Orange',
    'Pastel',
    'Pink',
    'Purple',
    'Red',
    'Tie dye',
    'White',
    'Yellow',
  ],
  collection: [
    'ABC',
    'Align',
    'All Yours',
    'Always In Motion',
    'At Ease',
    'City Sweat',
    'Commission',
    'Dance Studio',
    'Define',
    'Drysense',
    'Energy',
    'Engineered Warmth',
    'Fast & Free',
    'Free to Be',
    'Fundamental',
  ],
  features: [
    'Seamless',
    'Anti Stink',
    'Waterproof',
    'Lightweight',
    'Insulated',
    'Reflective',
    'Down',
    'Primaloft',
    'ABC Technology',
  ],
  fabric: [
    'Everlux™',
    'Nulu™',
    'Nulux™',
    'Luxtreme™',
    'Ultralu™',
    'Warpstreme™',
    'Luon™',
    'Wool',
    'Cotton',
    'Pima Cotton',
    'French Terry',
    'Swift',
    'Fleece',
    'Ripstop',
    'Softstreme™',
    'Utilitech™',
  ],
}

const promptTemplate = `
Given the following categories and options, extract the relevant keywords from the user's input. 
Your answer should only include the categories and values that are defined in the provided lists and are relevant to user inputs.
If the answer includes sizes, please provide slightly more options instead of giving only one.
If any of the categories in the answer has no value, do not include it.


Categories:
- Gender: ${filters.gender.join(', ')}
- Category: ${filters.category.join(', ')}
- Type: ${filters.type.join(', ')}
- Activity: ${filters.activity.join(', ')}
- Size: ${filters.size.join(', ')}
- Colour: ${filters.colour.join(', ')}
- Collection: ${filters.collection.join(', ')}
- Features: ${filters.features.join(', ')}
- Fabric: ${filters.fabric.join(', ')}

User Input: "{{userInput}}"

Extracted Keywords:
- Gender: 
- Category:
- Type:
- Activity:
- Size:
- Colour:
- Collection:
- Features:
- Fabric:
`

export function generatePrompt(userInput: string) {
  return promptTemplate.replace('{{userInput}}', userInput)
}

// Function to send a request to OpenAI
export async function getAIResponse(prompt: string) {
  // console.log("Received response:", prompt);
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    return response.choices[0]?.message?.content
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw new Error('Failed to generate AI response.')
  }
}
