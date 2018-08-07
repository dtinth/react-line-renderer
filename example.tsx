import { Box, Bubble, Text, render, Carousel, FlexMessage, Image } from './src'
import React from 'react'
import dotenv from 'dotenv'
import { Client } from '@line/bot-sdk'

dotenv.config()

const element = (
  <FlexMessage altText="Lorem ipsum!">
    <Carousel>
      <Bubble>
        <Box layout="vertical">
          <Text wrap>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </Box>
      </Bubble>
      <Bubble
        hero={
          <Image
            url="https://i.imgur.com/mFHkiNw.png"
            size="full"
            aspectRatio="1.91:1"
          />
        }
      >
        <Box layout="baseline">
          <Text wrap flex={1} size="4xl" color="#ff0000">
            Left
          </Text>
          <Text wrap flex={1} size="3xl" color="#0000ff" align="end">
            Right
          </Text>
        </Box>
      </Bubble>
    </Carousel>
  </FlexMessage>
)

const client = new Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
})
const message = render(element)
console.log(require('util').inspect(message, { depth: 10 }))
client.pushMessage(process.env.MY_USER_ID, message)
