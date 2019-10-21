import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';

const Editor = () => {
  React.useEffect(() => {
    const code = CodeMirror(document.getElementById("code"), {
      mode: 'markdown',
      lineNumbers: true,
      theme: 'solarized dark',
      value: '// Cmd-E for Formula Names.\n// { for Field Names'
    })
    code.setOption('extraKeys', {
      'Cmd-E': (cm) => {
        var options = {
          hint: function() {
            return {
              from: code.getDoc().getCursor(),
              to: code.getDoc().getCursor(),
              list: ['Add', 'Substract', 'Divide', 'Multiply', 'Round']
            }
          }
        }
        code.showHint(options)
      },
      'Shift-[': (cm) => {
        var options = {
          hint: function() {
            return {
              from: code.getDoc().getCursor(),
              to: code.getDoc().getCursor(),
              list: ['Current Actual Balance', 'Gross Rate', 'Interest Rate']
            }
          }
        }
        code.showHint(options)
      }
    })
  }, [])


  return (
    <div>
      <div id="code"/>
    </div>
  )
}

export default Editor