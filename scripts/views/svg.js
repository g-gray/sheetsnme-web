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
