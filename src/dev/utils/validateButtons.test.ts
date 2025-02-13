import { describe, expect, test } from 'vitest'

import { htmlToMetaTags } from './htmlToMetaTags.js'
import { parseButtons } from './parseButtons.js'
import { validateButtons } from './validateButtons.js'

const html = `
  <meta property="fc:frame" content="vNext">

  <meta property="fc:frame:button:1" content="foo">

  <meta property="fc:frame:button:2" content="bar">
  <meta property="fc:frame:button:2:action" content="link">
  <meta property="fc:frame:button:2:target" content="https://example.com">

  <meta property="fc:frame:button:3" content="baz">
  <meta property="fc:frame:button:3:action" content="post_redirect">
  <meta property="fc:frame:button:3:target" content="https://example.com/redirect">

  <meta property="fc:frame:button:4" content="mint">
  <meta property="fc:frame:button:4:action" content="mint">
  <meta property="fc:frame:button:4:target" content="eip155:7777777:0x060f3edd18c47f59bd23d063bbeb9aa4a8fec6df">

  <meta property="fc:frame:image" content="http://example.com/image">
  <meta property="fc:frame:post_url" content="http://localhost:3001">
  <meta property="fc:frame:state" content="frog">
  <meta property="og:image" content="https://example.com/og">
`
const selector = 'meta[property^="fc:"], meta[property^="og:"]'
const metaTags = htmlToMetaTags(html, selector)

describe('validateFrameButtons', () => {
  test('default', () => {
    const buttons = parseButtons(metaTags)
    const result = validateButtons(buttons)
    expect(result).toEqual({
      buttonsAreOutOfOrder: false,
      invalidButtons: [],
    })
  })

  test('missing buttons', () => {
    const html = `
      <meta property="fc:frame:button:2" content="bar">
      <meta property="fc:frame:button:3" content="baz">
    `
    const metaTags = htmlToMetaTags(html, selector)
    const buttons = parseButtons(metaTags)
    const result = validateButtons(buttons)
    expect(result).toEqual({
      buttonsAreOutOfOrder: true,
      invalidButtons: [],
    })
  })

  test('missing buttons', () => {
    const html = `
      <meta property="fc:frame:button:1" content="foo">
      <meta property="fc:frame:button:3" content="baz">
    `
    const metaTags = htmlToMetaTags(html, selector)
    const buttons = parseButtons(metaTags)
    const result = validateButtons(buttons)
    expect(result).toEqual({
      buttonsAreOutOfOrder: true,
      invalidButtons: [],
    })
  })
})
