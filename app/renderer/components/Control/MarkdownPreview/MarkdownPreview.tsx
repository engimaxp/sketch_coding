import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Scrollbars } from 'react-custom-scrollbars';
import {settings} from '../../../constants';
interface MarkdownPreviewProps {
    className: string;
    content: string;
}
export default function MarkdownPreview(props: MarkdownPreviewProps) {
    const { content, className } = props;

    return (
        <Scrollbars className={className}
                    renderView={(props2: any) => (
                        <div {...props2} style={{ ...props2.style, overflowX: 'hidden' }} />
                    )}
                    renderTrackHorizontal=
                        {(props2: any) => <div {...props2} style={{display: 'none'}} className="track-horizontal"/>}
                    style={{ width: `calc(100%-${settings.markdownEditor.padding}px)`}}>
            <Typography component={'div'} style={{
                width: `calc(100%-${settings.markdownEditor.padding}px)`,
                paddingTop: settings.markdownEditor.padding,
                paddingLeft: settings.markdownEditor.padding,
                fontFamily: settings.markdownEditor.fontFamily,
                fontSize: settings.markdownEditor.fontSize,
            }}
                dangerouslySetInnerHTML={{__html: content}}
            />
        </Scrollbars>
    );
}
