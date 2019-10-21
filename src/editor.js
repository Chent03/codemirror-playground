import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/mode/overlay';
import 'codemirror/addon/mode/simple';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import './editor.css';

// import 'codemirror/mode/xml/xml.js';

const Editor = () => {
  React.useEffect(() => {
    //custom mode, a little hard to do
    CodeMirror.defineMode('tapecracker', function(config, parserConfig) {
      let tapecrackerOverlay = {
        token: function(stream, state) {
          let ch;
          if (stream.match('{')) {
            while ((ch = stream.next()) != null)
              if (stream.next() == '}') {
                stream.eat('}');
                return 'tapecracker';
              }
          }
          while (stream.next() != null && !stream.match('{', false)) {}
          return null;
        }
      };
      return CodeMirror.overlayMode(
        CodeMirror.getMode(config, parserConfig.backdrop || 'text/html'),
        tapecrackerOverlay
      );
    });

    // simple mode, easier to theme
    CodeMirror.defineSimpleMode('simplemode', {
      // The start state contains the rules that are intially used
      start: [
        // The regex matches the token, the token property contains the type
        { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
        // You can match multiple tokens at once. Note that the captured
        // groups must span the whole string in this case
        { regex: /(function)(\s+)([a-z$][\w$]*)/, token: ['keyword', null, 'variable-2'] },
        // Rules are matched in the order in which they appear, so there is
        // no ambiguity between this one and the one above
        { regex: /(?:ADD|SUBSTRACT|DIVIDE|MULTIPLY|ROUND)\b/, token: 'tc-function' },
        { regex: /{(?:[^\\]|\\.)*?(?:}|$)/, token: 'tc-field' },

        { regex: /true|false|null|undefined/, token: 'atom' },
        { regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: 'number' },
        // A next property will cause the mode to move to a different state
        { regex: /\/\*/, token: 'comment', next: 'comment' },
        { regex: /[-+\/*=<>!]+/, token: 'operator' },
        // indent and dedent properties guide autoindentation
        { regex: /[\{\[\(]/, indent: true },
        { regex: /[\}\]\)]/, dedent: true },
        { regex: /[a-z$][\w$]*/, token: 'variable' }
      ],
      // The multi-line comment state.
      comment: [{ regex: /.*?\*\//, token: 'comment', next: 'start' }, { regex: /.*/, token: 'comment' }],
      // The meta property contains global information about the mode. It
      // can contain properties like lineComment, which are supported by
      // all modes, and also directives like dontIndentStates, which are
      // specific to simple modes.
      meta: {
        dontIndentStates: ['comment'],
        lineComment: '//'
      }
    });

    const code = CodeMirror.fromTextArea(document.getElementById('code'), {
      mode: 'simplemode',
      lineNumbers: true,
      theme: 'solarized dark'
    });
    code.setOption('extraKeys', {
      'Cmd-E': cm => {
        var options = {
          hint: function() {
            return {
              from: code.getDoc().getCursor(),
              to: code.getDoc().getCursor(),
              list: ['ADD', 'SUBSTRACT', 'DIVIDE', 'MULTIPLY', 'ROUND']
            };
          }
        };
        code.showHint(options);
      }
      // 'Shift-[': (cm) => {
      //   var options = {
      //     hint: function() {
      //       return {
      //         from: code.getDoc().getCursor(),
      //         to: code.getDoc().getCursor(),
      //         list: ['Current Actual Balance', 'Gross Rate', 'Interest Rate']
      //       }
      //     }
      //   }
      //   code.showHint(options)
      // }
    });
  }, []);

  return (
    <div>
      <form>
        <textarea id="code" name="code">
          {'ADD({Original Balance}, 100)'}
        </textarea>
      </form>
    </div>
  );
};

export default Editor;
