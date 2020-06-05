import * as t from '../types'

import React from 'react'
import {withRouter} from 'react-router-dom'
import ReactPaginate from 'react-paginate'

import * as u from '../utils'

import * as i18n from '../i18n'

import * as m from './misc'
import * as s from './svg'

type PaginatorProps = t.RRRouteComponentProps & {
  pageCount    : number,
  onPageChange?: (pageNumber: number) => void,
}

type PaginatorState = {
  forcePage: number,
}


class _Paginator extends m.ViewComponent<PaginatorProps, PaginatorState> {
  readonly state = {
    forcePage: this.getPage(this.props.location.search),
  }

  unlisten: () => void = () => {}

  getPage(search: string): number {
    const query = u.decodeQuery(search)
    const page = parseInt(u.alwaysArray(query.page)[0]) || 1
    return page
  }

  hrefBulder = (page: number) => {
    const query = u.decodeQuery(this.props.location.search)
    return `/transactions/${u.encodeQuery({...query, page})}`
  }

  changePage = ({selected}: {selected: number}): void => {
    const {props: {history, location, onPageChange}} = this

    const query = u.decodeQuery(location.search)
    const page = selected + 1
    history.push(`/transactions/${u.encodeQuery({...query, page})}`)

    if (typeof onPageChange === 'function') {
      onPageChange(page)
    }
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(nextLocation => {
      const location = this.props.location
      if (location.pathname !== nextLocation.pathname) return

      const page = this.getPage(nextLocation.search)
      this.setState({forcePage: page})
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const {
      context, context: {isMobile},
      props: {pageCount},
      state: {forcePage},
      changePage, hrefBulder,
    } = this

    return (
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={isMobile ? 2 : 3}
        marginPagesDisplayed={isMobile ? 1 : 2}
        previousLabel={<s.ArrowLeft />}
        nextLabel={<s.ArrowRight />}
        breakLabel='...'
        breakClassName={`block ${isMobile ? '' : 'padding-h-0x75'}`}
        breakLinkClassName='btn-secondary row-center-center'
        onPageChange={changePage}
        forcePage={forcePage - 1}
        disableInitialCallback={true}
        containerClassName={`${isMobile
          ? 'col-start-stretch gaps-v-1 padding-h-1x25'
          : 'row-center-center gaps-h-0x25'}`}
        pageClassName='block'
        pageLinkClassName='btn-secondary row-center-center'
        previousClassName='block'
        previousLinkClassName='btn-secondary row-center-center'
        nextClassName='block'
        nextLinkClassName='btn-secondary row-center-center'
        hrefBuilder={hrefBulder}
        // @ts-ignore: next-line
        ariaLabelBuilder={(page) => `${i18n.xln(context, i18n.PAGE)} ${page}`}
      />
    )
  }
}

export const Paginator = withRouter(_Paginator)
