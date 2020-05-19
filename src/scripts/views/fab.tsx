import * as t from '../types'

import React from 'react'

import * as m from './misc'
import * as s from './svg'
import * as fb from './fake-button'

type FabProps = {
  className?: string,
  onClick: (event: fb.FakeButtonEvent) => void,
}

export class Fab extends m.ViewComponent<FabProps> {
  render() {
    const {props: {className: cls, ...props}} = this

    return (
      <fb.FakeButton
        className={`row-start-stretch width-3x5 ${cls || ''}`}
        {...props}
      >
        <span className='flex-1 relative circle square bg-accent shadow-dept-2'>
          <s.Plus className='abs-center font-giant fg-on-accent' />
        </span>
      </fb.FakeButton>
    )
  }
}
