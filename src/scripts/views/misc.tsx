import * as t from '../types'

import React from 'react'

import * as e from '../env'

/**
 * React-specific
 */

export class ViewComponent<P = any, S = any> extends React.Component<P, S> {
  static contextType: React.Context<t.AppContext> = e.Context
  declare context: React.ContextType<typeof e.Context>

  constructor(props: Readonly<P>, context?: t.AppContext) {
    super(props, context)
    // this.render = renderWithArg
  }
}

// function renderWithArg() {
//   // Minor convenience: pass self as argument.
//   return this.constructor.prototype.render.call(this, this)
// }
