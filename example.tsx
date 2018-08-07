import { Box, Bubble, Text, render, Carousel, FlexMessage } from './src'
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
      <Bubble>
        <Box layout="horizontal">
          <Text wrap flex={1}>
            Left
          </Text>
          <Text wrap flex={1}>
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
client.pushMessage(process.env.MY_USER_ID, render(element))
