import * as TestRenderer from 'react-test-renderer'
import * as LINE from '@line/bot-sdk'
import React, { ReactNode } from 'react'

export function render(element) {
  const renderer = TestRenderer.create(element)
  const json = renderer.toJSON()
  const result = toJSON(json)
  return result
}
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Reactify<T> = Omit<T, 'type'>

function element<T>(type: string, update: any) {
  return (props: Reactify<T>) => renderElement(type, props, update)
}

const childKey = Symbol('child')

function child(fn) {
  return { [childKey]: fn }
}

function toJSON(element) {
  if (typeof element === 'string') return element
  if (element === null) return null
  if (element.type !== 'object')
    throw new Error('Not an object! — ' + element.type)
  const obj: any = {}
  for (const prop of Object.keys(element.props)) {
    if (element.props[prop] && element.props[prop][childKey]) {
      obj[prop] = element.props[prop][childKey]()
    } else {
      obj[prop] = element.props[prop]
    }
  }
  return obj
}

function singleChild(propName: string) {
  return (nextProps: any, value: ReactNode) => {
    if (value) {
      const elements = value ? React.Children.toArray(value) : []
      if (elements.length !== 1) {
        throw new Error(
          'Expected 1 child for prop ' +
            propName +
            ': ' +
            elements.length +
            ' found'
        )
      }
      const element = elements[0]
      nextProps[propName] = child(() => render(element))
    }
  }
}
function multiChild(propName: string) {
  return (nextProps: any, value: ReactNode) => {
    const elements = value ? React.Children.toArray(value) : []
    nextProps[propName] = child(() =>
      elements.map(element => {
        return render(element)
      })
    )
  }
}

function renderElement(type: string, props, update: any) {
  const nextProps = {}
  Object.keys(props).forEach(k => {
    if (update[k]) update[k](nextProps, props[k])
    else nextProps[k] = props[k]
  })
  return <object type={type} {...nextProps} />
}

type Modify<Base, Modification> = Pick<
  Base,
  Exclude<keyof Base, keyof Modification>
> &
  Modification

type Children<Base, ChildrenKeys extends string> = Modify<
  Base,
  { [k in ChildrenKeys]?: React.ReactNode }
>

export const FlexMessage = element<
  Omit<LINE.FlexMessage, 'contents'> & { children?: ReactNode }
>('flex', {
  children: singleChild('contents')
})

export const Bubble = element<
  Omit<LINE.FlexBubble, 'body' | 'header' | 'footer' | 'hero'> & {
    children?: ReactNode
    header?: ReactNode
    footer?: ReactNode
    hero?: ReactNode
  }
>('bubble', {
  children: singleChild('body'),
  header: singleChild('header'),
  footer: singleChild('footer'),
  hero: singleChild('hero')
})

export const Carousel = element<
  Omit<LINE.FlexCarousel, 'contents'> & { children?: ReactNode }
>('carousel', {
  children: multiChild('contents')
})

export const Box = element<
  Omit<LINE.FlexBox, 'contents'> & { children?: ReactNode }
>('box', {
  children: multiChild('contents')
})

export const Text = element<
  Omit<LINE.FlexText, 'text'> & { children?: ReactNode }
>('text', {
  children: singleChild('text')
})

export const Image = element<LINE.FlexImage>('image', {})
