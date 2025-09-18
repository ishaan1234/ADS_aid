import PyPDF2

pdf_file = 'lec01.pdf'
output_file = 'lec01_with_pages.txt'

with open(pdf_file, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    total_pages = len(pdf_reader.pages)

    with open(output_file, 'w', encoding='utf-8') as output:
        for page_num in range(total_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()

            # Add clear page marker
            output.write(f"\n{'='*50}\n")
            output.write(f"[PAGE {page_num + 1}]\n")
            output.write(f"{'='*50}\n\n")
            output.write(text)
            output.write('\n')

    print(f"Successfully converted {total_pages} pages to {output_file}")