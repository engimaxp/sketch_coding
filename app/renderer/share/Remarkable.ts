import Remarkable from 'remarkable';
import hljs from 'highlight.js';
import path from 'path';
import {settings} from '../constants';
import {escapeHtml, replaceEntities, unescapeMd} from 'remarkable/lib/common/utils';

export const getRemarkable = (localDirectory: string) => {
    const remark = new Remarkable({
        highlight: (str: string, lang: string) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (err) {}
            }

            try {
                return hljs.highlightAuto(str).value;
            } catch (err) {}

            return ''; // use external default escaping
        }
    });
    overrideMarkdownParseToAdaptLink(remark, localDirectory);
    return remark;
};

const overrideMarkdownParseToAdaptLink = (md: Remarkable, assetDir: string): void => {
    md.renderer.rules.image = (tokens, idx, options /*, env */) => {
        const srcUrl = path.resolve(assetDir, settings.imageFileDirectory, path.basename(tokens[idx].src));

        const src = ' src="' + escapeHtml(srcUrl) + '"';
        const style = ` style="width:100%;padding-right:${settings.markdownEditor.padding}px"`;
        const title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
        const alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(unescapeMd(tokens[idx].alt))) : '') + '"';
        const suffix = options!.xhtmlOut ? ' /' : '';

        // noinspection HtmlRequiredAltAttribute
        return '<img' + src + style + alt + title + suffix + '>';
    };
};
