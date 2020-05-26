import * as t from '../types'

import React from 'react'
// @ts-ignore
import * as fpx from 'fpx'

import * as u from '../utils'

import * as g from '../geometry'

import * as m from './misc'
import * as s from './svg'
import * as fb from './fake-button'
import * as p from './placeholder'

/**
 * EntityItemList
 */

type EntityItemListProps = {
  entityList: any[],
  pending   : boolean,
}

export class EntityItemList extends m.ViewComponent<EntityItemListProps> {
  render() {
    const {props: {entityList, pending, children}} = this

    if (pending || entityList.length === 0) {
      return (
        <EntityListPlaceholder length={entityList.length} />
      )
    }

    return children
  }
}




/**
 * EntityItem
 */

type EntityItemProps = {
  icon    : t.RReactElement,
  onOpen  : (event: fb.FakeButtonEvent) => void,
  onDelete: (event: fb.FakeButtonEvent) => void,
}

export class EntityItem extends m.ViewComponent<EntityItemProps> {
  actionsRef = React.createRef<HTMLDivElement>()

  onClick = (event: fb.FakeButtonEvent): void => {
    const {
      actionsRef,
      props: {onOpen}
    } = this

    const actionsNode = u.findDomNode(actionsRef.current)
    if (u.isAncestorOf(actionsNode, event.target)) {
      return
    }

    onOpen(event)
  }

  render() {
    const {
      context,
      props: {children, icon, onDelete},
      onClick, actionsRef,
    } = this

    const isMobile = g.isMobile(context)

    return (
      <fb.FakeButton
        type='div'
        onClick={onClick}
        className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-drawer-link-busy rounded trigger'
      >
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            {icon}
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-between-center padding-v-1'>
            {children}
          </div>
        </div>
        {isMobile ? null :
        <div
          ref={actionsRef}
          className='row-center-center padding-h-0x25'
        >
          <div
            className='row-center-center'
            style={{minHeight: '2.5rem'}}
          >
            <fb.FakeButton
              className='row-center-center show-on-trigger-hover decorate-icon-button'
              onClick={onDelete}
            >
              <s.Trash2 className='font-large' />
            </fb.FakeButton>
          </div>
        </div>}
      </fb.FakeButton>
    )
  }
}



/**
 * EntityListPlaceholder
 */

type EntityListPlaceholderProps = {
  length: number,
}

export class EntityListPlaceholder extends m.ViewComponent<EntityListPlaceholderProps> {
  render() {
    const {props: {length}} = this

    return (
      <div className='col-start-stretch'>
        {fpx.range(0, length).map((key: number) => (
          <EntityPlaceholder key={key} />
        ))}
      </div>
    )
  }
}



/**
 * EntityPlaceholder
 */

export class EntityPlaceholder extends m.ViewComponent {
  render() {
    const {context: {isMobile}} = this

    return (
      <div className='row-start-stretch gaps-h-1 padding-h-1'>
        <div className='relative width-2x5 square'>
          <div className='row-center-center abs-center'>
            <div className='width-1x5 square circle decorate-placeholder' />
          </div>
        </div>
        <div className='flex-1 col-start-stretch'>
          <div className='flex-1 row-start-center padding-v-1'>
            <p.Placeholder style={{width: '8em'}} />
          </div>
        </div>
        {isMobile ? null :
        <div className='row-center-center padding-h-0x25'>
          <div
            className='row-center-center'
            style={{minHeight: '2.5rem'}}
          >
            <s.Trash2 className='font-large fg-transparent' />
          </div>
        </div>}
      </div>
    )
  }
}
