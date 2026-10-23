// A paragraph immediately after a Markdown table, beginning "Table:", is its caption.
export default function tableCaptions(md) {
  md.core.ruler.after('inline', 'table-captions', state => {
    let number = 0;
    for (const table of state.tokens.filter(token => token.type === 'table_open')) {
      const start = state.tokens.indexOf(table);
      const end = state.tokens.findIndex((token, i) => i > start && token.type === 'table_close');
      const [open, inline, close] = state.tokens.slice(end + 1, end + 4);
      if (open?.type !== 'paragraph_open' || inline?.type !== 'inline' || close?.type !== 'paragraph_close') continue;
      if (!/^Table:\s+/.test(inline.content)) continue;
      number += 1;
      inline.content = inline.content.replace(/^Table:\s+/, `Table ${number}: `);
      // Reparse so emphasis and links remain accessible HTML inside the caption.
      inline.children = [];
      md.inline.parse(inline.content, md, state.env, inline.children);
      open.type = 'caption_open'; open.tag = 'caption';
      close.type = 'caption_close'; close.tag = 'caption';
      state.tokens.splice(end + 1, 3);
      state.tokens.splice(start + 1, 0, open, inline, close);
    }
  });
}
