import React from 'react';
import { Box, Typography, FormHelperText } from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import Editor from './Editor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  height?: number;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error = false,
  helperText,
  height = 200,
  readOnly = false,
}) => {

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
      <Box
        sx={{
          '& .ql-editor': {
            minHeight: `${height}px`,
            fontSize: '14px',
            lineHeight: 1.5,
          },
          '& .ql-toolbar': {
            borderTop: '1px solid #ccc',
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          },
          '& .ql-container': {
            borderBottom: '1px solid #ccc',
            borderLeft: '1px solid #ccc',
            borderRight: '1px solid #ccc',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            fontSize: '14px'
          },
          ...(error && {
            '& .ql-toolbar, & .ql-container': {
              borderColor: 'error.main',
            },
          }),
        }}
      >
        <Editor
          readOnly={false}
          value={value}
          onChange={onChange}
        />
      </Box>
      {helperText && (
        <FormHelperText error={error} sx={{ mt: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default RichTextEditor;