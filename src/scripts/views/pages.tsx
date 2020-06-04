import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'

import * as m from './misc'
import * as l from './layouts'

export class Page404 extends m.ViewComponent {
  render() {
    const {context: {isMobile}} = this

    const content = (
      <Fragment>
        <div className='col-start-center gaps-v-0x5'>
          <h2 style={{lineHeight: '1', fontSize: '3em'}}>404</h2>
          <p>Page Not Found</p>
        </div>
        <p className='row-center-center'>
          <Link to='/' className='btn-primary'>Dashboard</Link>
        </p>
      </Fragment>
    )

    if (isMobile) {
      return (
        <l.MobilePageLayout>
          <div className='col-start-stretch gaps-v-1 padding-v-3'>
            {content}
          </div>
        </l.MobilePageLayout>
      )
    }

    return (
      <l.PageLayout className='relative col-start-center padding-r-1x25'>
        <div className='limit-content-width col-start-center gaps-v-1 padding-v-3'>
          {content}
        </div>
      </l.PageLayout>
    )
  }
}
