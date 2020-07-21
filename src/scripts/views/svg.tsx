import * as t from '../types'

import * as React from 'react'

type SvgProps = t.RSVGProps

export function svgProps({
  className: cls,
  ...props
}: SvgProps): t.RSVGProps {
  return {
    className: `${cls || ''}`,
    'xmlns': 'http://www.w3.org/2000/svg',
    'fill': 'none',
    'stroke': 'currentColor',
    'strokeWidth': '2',
    'strokeLinecap': 'round',
    'strokeLinejoin': 'round',
    ...props,
  }
}

export class Logo extends React.Component<SvgProps> {
  render() {
    const {props} = this
    return (
      <svg {...svgProps(props)} viewBox='0 0 24 24'>
        <path d="M14.6139844,15.6510938 C14.6139844,15.0534345 14.403049,14.59465 13.9811719,14.2747266 C13.5592948,13.9548031 12.7999274,13.6173065 11.7030469,13.2622266 C10.6061664,12.9071467 9.7378157,12.5573455 9.09796875,12.2128125 C7.35421003,11.2706203 6.48234375,10.0014924 6.48234375,8.40539062 C6.48234375,7.57569898 6.71613047,6.83566731 7.18371094,6.18527344 C7.6512914,5.53487956 8.32276906,5.02687683 9.19816406,4.66125 C10.0735591,4.29562317 11.0561664,4.1128125 12.1460156,4.1128125 C13.2428961,4.1128125 14.2202301,4.31144333 15.0780469,4.70871094 C15.9358637,5.10597855 16.6020679,5.66671513 17.0766797,6.3909375 C17.5512914,7.11515987 17.7885938,7.93780789 17.7885938,8.85890625 L14.6245313,8.85890625 C14.6245313,8.15577773 14.4030491,7.60910351 13.9600781,7.21886719 C13.5171072,6.82863086 12.8948478,6.63351562 12.0932813,6.63351562 C11.3198399,6.63351562 10.718674,6.79699055 10.2897656,7.12394531 C9.86085723,7.45090007 9.64640625,7.88155983 9.64640625,8.4159375 C9.64640625,8.91515875 9.89777092,9.33351394 10.4005078,9.67101562 C10.9032447,10.0085173 11.6432764,10.3249204 12.620625,10.6202344 C14.420634,11.1616433 15.731949,11.833121 16.5546094,12.6346875 C17.3772697,13.436254 17.7885938,14.4346815 17.7885938,15.63 C17.7885938,16.9589129 17.2858644,18.0012853 16.2803906,18.7571484 C15.2749168,19.5130116 13.9214148,19.8909375 12.2198437,19.8909375 C11.0385878,19.8909375 9.96281735,19.6747287 8.9925,19.2423047 C8.02218265,18.8098807 7.28215099,18.2175038 6.77238281,17.4651562 C6.26261464,16.7128087 6.00773438,15.8409425 6.00773438,14.8495312 L9.18234375,14.8495312 C9.18234375,16.544071 10.1948336,17.3913281 12.2198437,17.3913281 C12.9721913,17.3913281 13.5592948,17.2384 13.9811719,16.9325391 C14.403049,16.6266782 14.6139844,16.199534 14.6139844,15.6510938 Z" stroke="none" fill="currentColor" />
        <circle cx="12" cy="12" r="11.08" />
      </svg>
    )
  }
}



/**
 * Source and credit: https://feathericons.com
 *
 * To add an icon, copy-paste SVG markup as JSX. Local setup:
 *
 * git clone https://github.com/feathericons/feather.git
 * cd feather/icons
 * subl .
 */

type FeatherProps = t.RSVGProps

function featherProps({
  className: cls,
  ...props
}: t.RSVGProps): t.RSVGProps {
  return {
    className: `feather ${cls || ''}`,
    'xmlns': 'http://www.w3.org/2000/svg',
    'width': '24',
    'height': '24',
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'strokeWidth': '2',
    'strokeLinecap': 'round',
    'strokeLinejoin': 'round',
    ...props,
  }
}

export class X extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    )
  }
}

export class BarChart extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  }
}

export class Users extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
}

export class Plus extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )
  }
}

export class Minus extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )
  }
}

export class Menu extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    )
  }
}

export class CreditCard extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    )
  }
}

export class Tag extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7" y2="7" />
      </svg>
    )
  }
}

export class ArrowLeft extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    )
  }
}

export class ArrowRight extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    )
  }
}

export class Trash2 extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    )
  }
}

export class Repeat extends React.Component<FeatherProps> {
  render() {
    const {props} = this
    return (
      <svg {...featherProps(props)}>
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    )
  }
}
