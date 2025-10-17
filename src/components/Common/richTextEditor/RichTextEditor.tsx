import { useRef, useCallback, useEffect } from "react";
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
        async (files: File[], insertPosition?: number): Promise<void> => {
            if (!rteRef.current?.editor) {
                return;
            }

            // Convert files to base64 instead of using object URLs
            const fileToBase64 = async (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            };

            try {
                // Process all files and get their base64 representations
                const attributesPromises = files.map(async (file) => ({
                    src: await fileToBase64(file),
                    alt: file.name,
                }));

                const attributesForImageFiles = await Promise.all(attributesPromises);

                insertImages({
                    images: attributesForImageFiles,
                    editor: rteRef.current.editor,
                    position: insertPosition,
                });
            } catch (error) {
                console.error("Error converting images to base64:", error);
            }
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

    // Update editor content when value prop changes
    useEffect(() => {
        // Wait for the editor to be initialized
        if (rteRef.current?.editor && value) {
            // Only update if the current content is different from the new value
            const currentContent = rteRef.current.editor.getHTML();
            if (currentContent !== value) {
                rteRef.current.editor.commands.setContent(value);
            }
        }
    }, [value]);

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
                content={value || ''} /* Ensure we pass at least an empty string */
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
                    sx: {
                        // Fix the paddingLeft which was set to an extremely large value
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