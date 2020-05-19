import * as t from '../types'

import React from 'react'

import * as g from '../geometry'

import * as m from './misc'
import * as s from './svg'

type PlaceholderProps = {
  className?: string,
  style?: t.RCSSProperties,
}

export class Placeholder extends m.ViewComponent<PlaceholderProps> {
  render() {
    const {props: {style, className: cls}} = this

    return (
      <span className={`inline-block ${cls || ''}`}>
        <span
          className='inline-block valign-middle decorate-placeholder rounded-50p'
          style={{width: '3em', height: '1em', ...style}} />
      </span>
    )
  }
}
