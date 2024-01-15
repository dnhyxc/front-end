document.addEventListener('contextmenu', (e) => {
  e.stopPropagation();
  e.preventDefault()

  console.log(e.clientX, 'eeeeee')
  const { clientX, clientY, pageX, pageY } = e
  console.log(clientX, clientY, pageX, pageY, '00000', e)

  const iframe = document.querySelector('iframe')

  console.log(iframe, 'iframe');

  const styles = `
    background: #fff;
    color: #000;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: ${pageY}px;
    left: ${pageX}px;
  `

  const menu = `
    <div style="${styles}">
      <span id="__search__">搜索</span>
      <span id="__speech__">语音阅读</span>
    </div >
  `
  const node = document.createElement('div')

  node.id = '__EPUB_MENU__'

  node.innerHTML = menu

  const menuNode = document.querySelector('#__EPUB_MENU__')

  if (menuNode) {
    document.body.removeChild(menuNode)
    document.body.appendChild(node)
  } else {
    document.body.appendChild(node)
  }


  const __search__ = document.querySelector('#__search__')
  const __speech__ = document.querySelector('#__speech__')

  __search__?.addEventListener('click', (e) => {
    // e.stopPropagation();
    console.log(e, 'eee---search')
  })
  __speech__?.addEventListener('click', async (e) => {
    const content = window.getSelection().toString();

    const res = await navigator.clipboard.readText()
    console.log(content, 'content', res)

    // 创建 SpeechSynthesisUtterance 对象
    const utterance = new SpeechSynthesisUtterance(content);

    // 使用 SpeechSynthesis API 进行文本到语音的转换
    speechSynthesis.speak(utterance);
    // e.stopPropagation();
    console.log(e, 'eee---__speech__')
  })
})

document.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault()
  const menu = document.querySelector('#__EPUB_MENU__')

  console.log(menu, 'menu');

  if (menu) {
    document.body.removeChild(menu);
  }
})
