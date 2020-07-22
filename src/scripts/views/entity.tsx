import * as t from '../types'

import React from 'react'
// @ts-ignore
import * as fpx from 'fpx'

import * as u from '../utils'

import * as m from './misc'
import * as s from './svg'
import * as fb from './fake-button'
import * as p from './placeholder'

/**
 * EntityItemList
 */

type EntityListProps = {
  entityList  : any[],
  pending     : boolean,
  Placeholder?: t.RComponentType<EntityListPlaceholderProps>
}

export class EntityList extends m.ViewComponent<EntityListProps> {
  render() {
    const {props: {entityList, pending, Placeholder, children}} = this

    if (pending) {
      return Placeholder
        ? <Placeholder length={entityList.length} />
        : <EntityListPlaceholder length={entityList.length} />
    }

    if (!pending && entityList.length === 0) {
      return null
    }

    return children
  }
}




/**
 * EntityItem
 */

type EntityProps = {
  icon    : t.RReactElement,
  onOpen  : (event: fb.FakeButtonEvent) => void,
  onDelete: (event: fb.FakeButtonEvent) => void,
}

export class Entity extends m.ViewComponent<EntityProps> {
  private actionsRef = React.createRef<HTMLDivElement>()

  onClick = (event: fb.FakeButtonEvent) => {
    const {
      props: {onOpen},
      actionsRef,
    } = this

    if (u.isAncestorOf(actionsRef.current, event.target)) {
      return
    }

    onOpen(event)
  }

  render() {
    const {
      context: {isMobile},
      props: {children, icon, onDelete},
      actionsRef,
      onClick,
    } = this

    return (
      <fb.FakeButton
        type='div'
        className='row-start-stretch gaps-h-1 padding-h-1 text-left theme-drawer-link-busy rounded trigger'
        onClick={onClick}
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
      <div className='col-start-stretch gaps-v-0x25'>
        {fpx.range(0, length).map((value: number) => (
          <EntityPlaceholder key={value} />
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
