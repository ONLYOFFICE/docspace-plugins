# Markdown Converter - ONLYOFFICE DocSpace Plugin

Convert DOCX and TXT files to Markdown format directly in DocSpace with a single click.

## Features

- **Easy Conversion**: Right-click any DOCX or TXT file and select "Convert to Markdown"
- **Client-Side Processing**: All conversions happen in your browser - no external services required
- **Supported Formats**:
  - `.docx` - Microsoft Word documents
  - `.txt` - Plain text files
  - `.html` - HTML files
- **Fast & Reliable**: Uses industry-standard libraries (mammoth.js for DOCX parsing, Turndown for HTML-to-Markdown conversion)
- **Creates File in Same Folder**: Converted Markdown file appears in the same folder as the original

## How to Use

1. Navigate to a folder in DocSpace
2. Right-click on a DOCX, TXT, or HTML file
3. Select **"Convert to Markdown"** from the context menu
4. The converted `.md` file will be created in the same folder


## Technical Details

### Conversion Process

- **DOCX Files**: Parsed using [mammoth.js](https://github.com/mwilliamson/mammoth.js) to extract content as HTML, then converted to Markdown
- **TXT Files**: Converted directly to Markdown format

### Technologies Used

- [Turndown](https://github.com/mixmark-io/turndown) - HTML to Markdown conversion
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) - DOCX to HTML conversion

## Limitations

- **Single File Conversion**: Currently converts one file at a time. For batch conversions, repeat the process for each file
- **Supported Formats**: Only DOCX, TXT, and HTML files are supported for conversion
- **File Size**: Large documents may take longer to process

## Troubleshooting

### Conversion Failed
- Check that the file is a valid DOCX or TXT file
- Ensure you have permission to create files in the folder
- Try refreshing the page and attempting again

### File Not Created
- Verify you have "Create" permissions in the folder
- Check the browser console for any error messages

## License

Apache 2.0

## Support

For issues, questions, or suggestions, please open an issue in the repository.

## Version History

### v1.0.0
- Initial release
