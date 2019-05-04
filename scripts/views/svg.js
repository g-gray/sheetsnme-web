/* eslint-disable jsx-quotes, react/self-closing-comp */

import * as React from 'react'
import * as u from '../utils'

/*
Source and credit: https://feathericons.com

To add an icon, copy-paste SVG markup as JSX. Local setup:

  git clone https://github.com/feathericons/feather.git
  cd feather/icons
  subl .

Unused components are ok; they should be removed by minification.
*/

function featherProps({replaceClass, className: cls, ...props}) {
  return {
    className: replaceClass || `feather ${cls || ''}`,
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

export function svgProps({className: cls, ...props}) {
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

export class Square extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      </svg>
    )
  }
}

export class CheckSquare extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )
  }
}

export class Check extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }
}

export class Star extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
}

export class MapPin extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
  }
}

export class Clock extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  }
}

export class ChevronDown extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    )
  }
}

export class ChevronRight extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )
  }
}

export class ChevronLeft extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="15 18 9 12 15 6" />
      </svg>
    )
  }
}

export class ChevronsRight extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="13 17 18 12 13 7" />
        <polyline points="6 17 11 12 6 7" />
      </svg>
    )
  }
}

export class CornerUpLeft extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="9 14 4 9 9 4" />
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
      </svg>
    )
  }
}

export class Paperclip extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </svg>
    )
  }
}

export class LogOut extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    )
  }
}

export class LogIn extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    )
  }
}

export class Female extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="8" r="6" />
        <path d="M12,14 L12,22" />
        <path d="M8,18 L16,18" />
      </svg>
    )
  }
}

export class Male extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="10" cy="14" r="6" />
        <path d="M19,5 L15,9" />
        <path d="M14,4 L20,4" />
        <path d="M20,4 L20,10" />
      </svg>
    )
  }
}

export class MaleFemale extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="11" cy="11" r="5" />
        <path d="M19,4 L16.1715729,6.82842712"  />
        <path d="M16,3 L20,3"  />
        <path d="M20,3 L20,7"  />
        <path d="M11,17 L11,22"  />
        <path d="M7,19 L15,19"  />
      </svg>
    )
  }
}

export class Case extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <rect x="2" y="6" width="20" height="14" rx="2" ry="2" />
        <path d="M16,19 L16,5 C16,3.8954305 15.1045695,3 14,3 L10,3 C8.8954305,3 8,3.8954305 8,5 L8,19" />
      </svg>
    )
  }
}

export class Mail extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )
  }
}

export class Phone extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
  }
}

export class X extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    )
  }
}

export class XCircle extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    )
  }
}

export class Filter extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
    )
  }
}

export class Upload extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    )
  }
}

export class Globe extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  }
}

export class BarChart extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  }
}

export class Eye extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
}

export class Users extends u.ViewComponent {
  render({props}) {
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

export class User extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
}

export class UserPlus extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    )
  }
}

export class Settings extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }
}

export class Camera extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    )
  }
}

export class Heart extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }
}

export class PieChart extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    )
  }
}

export class Hash extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </svg>
    )
  }
}

export class Search extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  }
}

export class Bell extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
      </svg>
    )
  }
}

export class Home extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  }
}

export class Cast extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
        <line x1="2" y1="20" x2="2" y2="20" />
      </svg>
    )
  }
}

export class List extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3" y2="6" />
        <line x1="3" y1="12" x2="3" y2="12" />
        <line x1="3" y1="18" x2="3" y2="18" />
      </svg>
    )
  }
}

export class MessageSquare extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  }
}

export class MessageCircle extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    )
  }
}

export class Share extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    )
  }
}

export class MoreHorizontal extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    )
  }
}

export class MoreVertical extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    )
  }
}

export class Activity extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  }
}

export class Aperture extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="10" />
        <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
        <line x1="9.69" y1="8" x2="21.17" y2="8" />
        <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
        <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
        <line x1="14.31" y1="16" x2="2.83" y2="16" />
        <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
      </svg>
    )
  }
}

export class Plus extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )
  }
}

export class Minus extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )
  }
}

export class Send extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    )
  }
}

export class Cog extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }
}

export class Layers extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    )
  }
}

export class Info extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="8" />
      </svg>
    )
  }
}

export class BookOpen extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  }
}

export class Menu extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    )
  }
}

export class Edit extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
      </svg>
    )
  }
}

export class CreditCard extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    )
  }
}

export class Tag extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7" y2="7" />
      </svg>
    )
  }
}

export class ArrowDown extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    )
  }
}

export class ArrowRight extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    )
  }
}

export class Trash extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...featherProps(props)}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    )
  }
}

export class Trash2 extends u.ViewComponent {
  render({props}) {
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

export class Repeat extends u.ViewComponent {
  render({props}) {
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

export class MaleFigure extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...svgProps(props)}>
        <path d="M15.5,12 C13.7327025,12 12.1181941,12.1006818 10.6571334,12.3011967 C6.78411695,12.8327279 3.69714829,15.8037185 3.01776593,19.6535519 L1.42785096,28.66307 C1.27598024,29.5236708 1.83918825,30.3480337 2.69611614,30.5194193 C3.5460111,30.6893983 4.37478969,30.1450411 4.55639404,29.2975541 L6.91743304,18.2793721 C7.07734164,17.533132 7.73681911,17 8.5,17 C9.32842712,17 10,17.6715729 10,18.5 L10,52 C10,53.1045695 10.8954305,54 12,54 C13.1045695,54 14,53.1045695 14,52 L14,33.5 C14,32.6715729 14.6715729,32 15.5,32 C16.3284271,32 17,32.6715729 17,33.5 L17,52 C17,53.1045695 17.8954305,54 19,54 C20.1045695,54 21,53.1045695 21,52 L21,18.5 C21,17.6715729 21.6715729,17 22.5,17 C23.2631809,17 23.9226584,17.533132 24.082567,18.2793721 L26.443606,29.2975541 C26.6252103,30.1450411 27.4539889,30.6893983 28.3038839,30.5194193 C29.1608117,30.3480337 29.7240198,29.5236708 29.572149,28.6630697 L27.9822376,19.6535542 C27.3028549,15.8037186 24.2158845,12.8327268 20.3428663,12.3011966 C18.8818055,12.1006817 17.2672973,12 15.5,12 Z" />
        <path d="M11.5,5 C11.5,6.10657754 11.8843221,7.02893202 12.677695,7.82230498 C13.471068,8.61567795 14.3934225,9 15.5,9 C16.6065775,9 17.528932,8.61567795 18.322305,7.82230498 C19.1141769,7.03043306 19.5,6.08903582 19.5,4.94117647 C19.5,3.87589424 19.1171873,2.97248191 18.322305,2.17769502 C17.528932,1.38432205 16.6065775,1 15.5,1 C14.3934225,1 13.471068,1.38432205 12.677695,2.17769502 C11.8843221,2.97106798 11.5,3.89342246 11.5,5 Z" />
      </svg>
    )
  }
}

export class FemaleFigure extends u.ViewComponent {
  render({props}) {
    return (
      <svg {...svgProps(props)}>
        <path d="M6.35395927,36 L10,36 L10,52 C10,53.1045695 10.8954305,54 12,54 C13.1045695,54 14,53.1045695 14,52 L14,36 L17,36 L17,52 C17,53.1045695 17.8954305,54 19,54 C20.1045695,54 21,53.1045695 21,52 L21,36 L24.6460407,36 L21.044221,24.2940858 L21.0136061,24.164399 L20.0958056,18.6575959 C19.966553,17.8820808 20.4904524,17.1486216 21.2659676,17.0193691 C21.3433118,17.0064784 21.4215889,17 21.5,17 C22.2424366,17 22.8949215,17.4921703 23.0988845,18.2060408 L26.2611198,29.2738642 C26.5136603,30.1577561 27.4024739,30.6997013 28.3038839,30.5194193 C29.02575,30.3750461 29.4939005,29.6728204 29.3495272,28.9509543 C29.3418008,28.9123219 29.3323653,28.8740511 29.3212487,28.8362547 L26.2915098,18.5351446 C25.2368554,14.9493197 22.0756469,12.3885641 18.3490001,12.1012679 C17.4742818,12.0338337 16.5244942,12 15.5,12 C14.475506,12 13.5257186,12.0338337 12.6510003,12.1012678 C8.92435308,12.3885636 5.76314404,14.9493193 4.70848948,18.5351448 L1.6787513,28.8362546 C1.47103121,29.5425029 1.87516818,30.2834207 2.58141648,30.4911408 C2.619213,30.5022574 2.65748379,30.5116929 2.69611614,30.5194193 C3.59752612,30.6997013 4.48633971,30.1577561 4.73888025,29.2738642 L7.90111549,18.2060408 C8.1050785,17.4921703 8.75756344,17 9.5,17 C10.2862124,17 10.9235635,17.6373511 10.9235635,18.4235635 C10.9235635,18.5019746 10.9170851,18.5802517 10.9041944,18.6575959 L9.98639392,24.164399 L9.95577901,24.2940858 L6.35395927,36 Z" />
        <path d="M11.5,5 C11.5,6.10657754 11.8843221,7.02893202 12.677695,7.82230498 C13.471068,8.61567795 14.3934225,9 15.5,9 C16.6065775,9 17.528932,8.61567795 18.322305,7.82230498 C19.1141769,7.03043306 19.5,6.08903582 19.5,4.94117647 C19.5,3.87589424 19.1171873,2.97248191 18.322305,2.17769502 C17.528932,1.38432205 16.6065775,1 15.5,1 C14.3934225,1 13.471068,1.38432205 12.677695,2.17769502 C11.8843221,2.97106798 11.5,3.89342246 11.5,5 Z" />
      </svg>
    )
  }
}

export class IO2 extends u.ViewComponent {
  render({props: {className: cls, ...props}}) {
    return (
      <svg
        {...svgProps(props)}
        width="24"
        height="22"
        viewBox="0 0 24 22"
        fill="currentColor"
        stroke="none"
        class={`square-em flex-shrink-none ${cls || ''}`}>
        <circle cx="10.5671642" cy="10.5671642" r="10.5671642" />
        <path d="M12.6677015,6.34423881 L12.6677015,7.85373134 L11.2814328,7.85373134 L11.2814328,6.34423881 L12.6677015,6.34423881 Z M12.6677015,8.97814925 L12.6677015,15.9402985 L11.2814328,15.9402985 L11.2814328,8.97814925 L12.6677015,8.97814925 Z M22.7720597,11.1499701 C22.7720597,11.8893171 22.6745084,12.5670417 22.479403,13.1831642 C22.2842975,13.7992867 22.0019123,14.3306843 21.6322388,14.7773731 C21.2625653,15.2240619 20.8056147,15.5706256 20.2613731,15.8170746 C19.7171316,16.0635236 19.0958841,16.1867463 18.3976119,16.1867463 C17.6993398,16.1867463 17.0780923,16.0635236 16.5338507,15.8170746 C15.9896092,15.5706256 15.5326586,15.2240619 15.1629851,14.7773731 C14.7933116,14.3306843 14.5109263,13.7992867 14.3158209,13.1831642 C14.1207154,12.5670417 14.0231642,11.8893171 14.0231642,11.1499701 C14.0231642,10.4106232 14.1207154,9.7328986 14.3158209,9.11677612 C14.5109263,8.50065364 14.7933116,7.96925596 15.1629851,7.52256716 C15.5326586,7.07587836 15.9896092,6.72931467 16.5338507,6.48286567 C17.0780923,6.23641668 17.6993398,6.11319403 18.3976119,6.11319403 C19.0958841,6.11319403 19.7171316,6.23641668 20.2613731,6.48286567 C20.8056147,6.72931467 21.2625653,7.07587836 21.6322388,7.52256716 C22.0019123,7.96925596 22.2842975,8.50065364 22.479403,9.11677612 C22.6745084,9.7328986 22.7720597,10.4106232 22.7720597,11.1499701 Z M21.3395821,11.1499701 C21.3395821,10.5543851 21.2651351,10.0204203 21.1162388,9.5480597 C20.9673425,9.07569913 20.7594043,8.67779266 20.4924179,8.35432836 C20.2254315,8.03086405 19.9122406,7.78185162 19.5528358,7.60728358 C19.193431,7.43271555 18.8083603,7.34543284 18.3976119,7.34543284 C17.9765949,7.34543284 17.588957,7.43271555 17.2346866,7.60728358 C16.8804161,7.78185162 16.5697924,8.03086405 16.302806,8.35432836 C16.0358196,8.67779266 15.8278813,9.07569913 15.6789851,9.5480597 C15.5300888,10.0204203 15.4556418,10.5543851 15.4556418,11.1499701 C15.4556418,11.7455552 15.5300888,12.2769529 15.6789851,12.7441791 C15.8278813,13.2114053 16.0358196,13.6093118 16.302806,13.9379104 C16.5697924,14.2665091 16.8804161,14.5180887 17.2346866,14.6926567 C17.588957,14.8672248 17.9765949,14.9545075 18.3976119,14.9545075 C18.8083603,14.9545075 19.193431,14.8672248 19.5528358,14.6926567 C19.9122406,14.5180887 20.2254315,14.2665091 20.4924179,13.9379104 C20.7594043,13.6093118 20.9673425,13.2114053 21.1162388,12.7441791 C21.2651351,12.2769529 21.3395821,11.7455552 21.3395821,11.1499701 Z" fill="#FFFFFF" />
        <path d="M21.0483582,14.7940299 C21.1008958,14.3594008 21.2632822,14.0131356 21.5355224,13.7552239 C21.8077626,13.4973121 22.1611919,13.3683582 22.5958209,13.3683582 C22.8250758,13.3683582 23.0256708,13.4029847 23.1976119,13.4722388 C23.3695531,13.5414929 23.5128352,13.6334323 23.6274627,13.7480597 C23.7420901,13.8626871 23.8292534,13.9952231 23.8889552,14.1456716 C23.948657,14.2961202 23.9785075,14.4501485 23.9785075,14.6077612 C23.9785075,14.7892546 23.946269,14.9516411 23.881791,15.0949254 C23.8173131,15.2382097 23.7313438,15.3683576 23.6238806,15.4853731 C23.5164174,15.6023886 23.3922395,15.7122383 23.2513433,15.8149254 C23.1104471,15.9176125 22.9659709,16.019104 22.8179104,16.119403 C22.5934317,16.2722396 22.3916427,16.4262679 22.2125373,16.5814925 C22.0334319,16.7367172 21.8961199,16.9194019 21.800597,17.1295522 L23.9785075,17.1295522 L23.9785075,17.7313433 L21.0698507,17.7313433 L21.0698507,17.2298507 C21.112836,17.0579096 21.1844771,16.8967172 21.2847761,16.7462687 C21.3850751,16.5958201 21.4985068,16.4573141 21.6250746,16.3307463 C21.7516424,16.2041785 21.8853724,16.0871647 22.0262687,15.9797015 C22.1671649,15.8722383 22.3044769,15.7707467 22.438209,15.6752239 C22.5432841,15.6035817 22.6483577,15.5283586 22.7534328,15.4495522 C22.858508,15.3707459 22.9528354,15.2895527 23.0364179,15.2059701 C23.1200004,15.1223876 23.1880594,15.0364184 23.240597,14.9480597 C23.2931346,14.8597011 23.319403,14.7725377 23.319403,14.6865672 C23.319403,14.4238793 23.2501499,14.2256723 23.1116418,14.0919403 C22.9731336,13.9582083 22.8011951,13.8913433 22.5958209,13.8913433 C22.3522376,13.8913433 22.1528366,13.9713425 21.9976119,14.1313433 C21.8423873,14.2913441 21.755224,14.5122374 21.7361194,14.7940299 L21.0483582,14.7940299 Z" />
      </svg>
    )
  }
}
