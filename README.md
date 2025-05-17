# ChatGPT Chat Jump

A Chrome extension that makes it easy to navigate through your ChatGPT conversation history.

## Features

- Navigation dots appear on the right side for each user message in the conversation
- Hover over a dot to see a preview of the message content
- Click a dot to automatically scroll to that message
- Shows up to 20 most recent messages as navigation dots
- Only activates on ChatGPT conversation pages

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the downloaded folder

## Usage

1. Visit ChatGPT website (https://chat.openai.com)
2. Start a conversation - navigation dots will automatically appear on the right
3. Hover over dots to preview message content
4. Click any dot to jump to that message

## Development

- Built with Manifest V3
- Pure JavaScript implementation
- CSS styling
- Uses MutationObserver for real-time updates

## Technical Details

- Detects user messages using `data-message-author-role="user"` selector
- Extracts message content from `.whitespace-pre-wrap` elements
- Smooth scrolling with `scrollIntoView`
- Responsive tooltips with message previews
