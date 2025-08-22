import { forwardRef, useEffect, useLayoutEffect, useRef} from "react";
import Quill from "quill";
import { Delta } from "quill/core";

import "quill/dist/quill.snow.css";

interface EditorProps {
    readOnly?: boolean;
    value?: string;
    onChange?: (html: string) => void;
}

const Editor = forwardRef<Quill, EditorProps>(({ readOnly = false, value, onChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef<string | undefined>(value);
    const onChangeRef = useRef<((html: string) => void) | undefined>(onChange);

    useLayoutEffect(() => {
        onChangeRef.current = onChange;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );
        const quill = new Quill(editorContainer, {
            theme: "snow",
            readOnly,
        });

        // detach ref from component
        if (ref) {
            if (typeof ref === 'function') {
                ref(quill);
            } else if ('current' in ref) {
                ref.current = quill;
            }
        }

        if (valueRef.current) {
            // Handling initial value
            const isHTML = /^<([a-z]+)[^>]*>[\S\s]*<\/\1>$/.test(valueRef.current);
            const contentValue = isHTML
                ? quill.clipboard.convert({ html: valueRef.current })
                : new Delta().insert(valueRef.current);
            quill.setContents(contentValue);
        }

        quill.on(Quill.events.TEXT_CHANGE, () => {
            // return value as HTML
            onChangeRef.current?.(quill.getSemanticHTML());
        });

        return () => {
            // detach ref from component
            if (ref && 'current' in ref) {
                ref.current = null;
            }
            container.innerHTML = "";
        };
    }, [ref, readOnly]);

    return <div ref={containerRef}></div>;
});

Editor.displayName = "Editor";

export default Editor;