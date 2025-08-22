import { useRef, useCallback } from "react";
import type { EditorOptions, Editor } from "@tiptap/core";
import {
    LinkBubbleMenu,
    RichTextEditor as CustomRichTextEditor,
    TableBubbleMenu,
    insertImages,
    type RichTextEditorRef,
} from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./useExtensions";
import { Box, Typography } from "@mui/material";

interface RichTextEditorProps {
    label?: string,
    placeholder?: string,
    value: string;
    onChange: (value: string) => void;
    editable?: boolean;
    error?: boolean
}

function fileListToImageFiles(fileList: FileList): File[] {
    // You may want to use a package like attr-accept
    // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
    // types.
    return Array.from(fileList).filter((file) => {
        const mimeType = (file.type || "").toLowerCase();
        return mimeType.startsWith("image/");
    });
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    label = "Description",
    placeholder = "Add your own content here...",
    value,
    onChange,
    editable = true,
    error = false
}) => {

    const rteRef = useRef<RichTextEditorRef>(null);

    const extensions = useExtensions({
        placeholder: placeholder,
    });

    const handleNewImageFiles = useCallback(
        (files: File[], insertPosition?: number): void => {
            if (!rteRef.current?.editor) {
                return;
            }

            // For the sake of a demo, we don't have a server to upload the files to,
            // so we'll instead convert each one to a local "temporary" object URL.
            // This will not persist properly in a production setting. You should
            // instead upload the image files to your server, or perhaps convert the
            // images to bas64 if you would like to encode the image data directly
            // into the editor content, though that can make the editor content very
            // large. You will probably want to use the same upload function here as
            // for the MenuButtonImageUpload `onUploadFiles` prop.
            const attributesForImageFiles = files.map((file) => ({
                src: URL.createObjectURL(file),
                alt: file.name,
            }));

            insertImages({
                images: attributesForImageFiles,
                editor: rteRef.current.editor,
                position: insertPosition,
            });
        },
        []
    );

    // Allow for dropping images into the editor
    const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
        useCallback(
            (view, event, _slice, _moved) => {
                if (!(event instanceof DragEvent) || !event.dataTransfer) {
                    return false;
                }

                const imageFiles = fileListToImageFiles(event.dataTransfer.files);
                if (imageFiles.length > 0) {
                    const insertPosition = view.posAtCoords({
                        left: event.clientX,
                        top: event.clientY,
                    })?.pos;

                    handleNewImageFiles(imageFiles, insertPosition);

                    // Return true to treat the event as handled. We call preventDefault
                    // ourselves for good measure.
                    event.preventDefault();
                    return true;
                }

                return false;
            },
            [handleNewImageFiles]
        );

    // Allow for pasting images
    const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
        useCallback(
            (_view, event, _slice) => {
                if (!event.clipboardData) {
                    return false;
                }

                const pastedImageFiles = fileListToImageFiles(
                    event.clipboardData.files
                );
                if (pastedImageFiles.length > 0) {
                    handleNewImageFiles(pastedImageFiles);
                    // Return true to mark the paste event as handled. This can for
                    // instance prevent redundant copies of the same image showing up,
                    // like if you right-click and copy an image from within the editor
                    // (in which case it will be added to the clipboard both as a file and
                    // as HTML, which Tiptap would otherwise separately parse.)
                    return true;
                }

                // We return false here to allow the standard paste-handler to run.
                return false;
            },
            [handleNewImageFiles]
        );

    // Handler for content changes
    const handleContentChange = useCallback(
        ({ editor }: { editor: Editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        [onChange]
    );

    return (
        <Box>
            {label && (
                <Typography
                    variant="body2"
                    sx={{
                        mb: 1,
                        fontWeight: 500,
                        color: error ? 'error.main' : 'text.primary',
                    }}
                >
                    {label}
                </Typography>
            )}
            <CustomRichTextEditor
                ref={rteRef}
                editable={editable}
                extensions={extensions}
                content={value}
                renderControls={() => <EditorMenuControls />}
                onUpdate={handleContentChange}
                editorProps={{
                    handleDrop: handleDrop,
                    handlePaste: handlePaste,
                }}
                RichTextFieldProps={{
                    // The "outlined" variant is the default (shown here only as
                    // example), but can be changed to "standard" to remove the outlined
                    // field border from the editor
                    variant: "outlined",
                    MenuBarProps: {
                        hide: !true,
                    },
                    sx:{
                        paddingLeft: 2090,
                        borderColor: error ? 'error.main' : 'divider',
                        borderRadius: 1,
                        backgroundColor: 'background.paper',
                        minHeight: 200,
                    }
                }}
            >
                {() => (
                    <>
                        <LinkBubbleMenu />
                        <TableBubbleMenu />
                    </>
                )}

            </CustomRichTextEditor>
        </Box>
    );
}

export default RichTextEditor;