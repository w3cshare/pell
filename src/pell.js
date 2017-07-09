if (document && !document.contentEditable && !document.execCommand) {
  // eslint-disable-next-line no-console
  console.error('HTML5 Document Editing API Is Not Supported')
}

const self = {}

const defaultSettings = {
  classes: {
    actionbar: 'pell-actionbar',
    button: 'pell-button',
    editor: 'pell-editor'
  }
}

const execute = (command, value = null) => {
  document.execCommand(command, false, value)
}

const ensureHTTP = str => {
  if (str.indexOf('http://') === 0 || str.indexOf('https://') === 0) return str
  return `http://${str}`
}

const link = () => {
  const url = window.prompt('Enter the link URL')
  if (url) execute('createLink', ensureHTTP(url))
}

const image = () => {
  const url = window.prompt('Enter the image URL')
  if (url) execute('insertImage', ensureHTTP(url))
}

const actions = {
  bold: {
    icon: '<b>B</b>',
    title: 'Bold',
    result: () => execute('bold')
  },
  italic: {
    icon: '<i>I</i>',
    title: 'Italic',
    result: () => execute('italic')
  },
  underline: {
    icon: '<u>U</u>',
    title: 'Underline',
    result: () => execute('underline')
  },
  strikethrough: {
    icon: '<strike>S</strike>',
    title: 'Strike-through',
    result: () => execute('strikeThrough')
  },
  heading1: {
    icon: '<b>H<sub>1</sub></b>',
    title: 'Heading 1',
    result: () => execute('formatBlock', '<H1>')
  },
  heading2: {
    icon: '<b>H<sub>2</sub></b>',
    title: 'Heading 2',
    result: () => execute('formatBlock', '<H2>')
  },
  paragraph: {
    icon: '&#182;',
    title: 'Paragraph',
    result: () => execute('formatBlock', '<P>')
  },
  quote: {
    icon: '&#8220; &#8221;',
    title: 'Quote',
    result: () => execute('formatBlock', '<BLOCKQUOTE>')
  },
  olist: {
    icon: '&#35;',
    title: 'Ordered List',
    result: () => execute('insertOrderedList')
  },
  ulist: {
    icon: '&#8226;',
    title: 'Unordered List',
    result: () => execute('insertUnorderedList')
  },
  code: {
    icon: '&lt;/&gt;',
    title: 'Code',
    result: () => execute('formatBlock', '<PRE>')
  },
  line: {
    icon: '&#8213;',
    title: 'Horizontal Line',
    result: () => execute('insertHorizontalRule', '<PRE>')
  },
  link: {
    icon: '&#128279;',
    title: 'Link',
    result: link
  },
  image: {
    icon: '&#128247;',
    title: 'Image',
    result: image
  },
  undo: {
    icon: '&#8634;',
    title: 'Undo',
    result: () => execute('undo')
  },
  redo: {
    icon: '&#8635;',
    title: 'Redo',
    result: () => execute('redo')
  }
}

export const init = settings => {
  settings.actions = settings.actions
    ? settings.actions.map(action => {
      if (typeof action === 'string') return actions[action]
      return { ...actions[action.name], ...action }
    })
    : Object.keys(actions).map(action => actions[action])

  settings.classes = { ...defaultSettings.classes, ...settings.classes }

  self.root = document.getElementById(settings.root)
  self.editor = document.createElement('div')
  self.editor.contentEditable = true
  self.editor.className = settings.classes.editor
  self.editor.oninput = event => settings.onChange && settings.onChange(event.target.innerHTML)
  self.root.appendChild(self.editor)

  self.actionbar = document.createElement('div')
  self.actionbar.className = settings.classes.actionbar
  self.root.appendChild(self.actionbar)

  settings.actions.forEach(action => {
    const button = document.createElement('button')
    button.className = settings.classes.button
    button.innerHTML = action.icon
    button.title = action.title
    button.onclick = action.result
    self.actionbar.appendChild(button)
  })
}

export default { init }
