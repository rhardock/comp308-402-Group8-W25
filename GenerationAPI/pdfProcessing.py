import fitz
import io
import re

def extract_text_from_pdf(pdf, pages):
    extracted_text = ""
    for page_num in pages:
        if 1 <= page_num <= len(pdf):
            page = pdf[page_num - 1]
            page_text = clean_page(page)
            extracted_text += page_text + "\n\n"
    return extracted_text.strip() or "No text found on selected pages."

def parse_page_range(pages):
    if re.fullmatch(r"\d+", pages):  # "5"
        page_num = int(pages)
        if page_num < 1:
            raise ValueError("Page number must be a positive integer.")
        return [page_num]

    elif re.fullmatch(r"\d+-\d+", pages):  # 4-10
        start, end = map(int, pages.split("-"))
        if start >= end or start < 1:
            raise ValueError("Invalid range. Ensure 'start' is less than 'end' and both are positive.")
        return list(range(start, end + 1))

    else:
        raise ValueError("Invalid format. Provide a single page ('5') or a range ('5-10').")

def clean_page(page):
    width = page.rect.width
    height = page.rect.height

    header_region = (0, 0, width, height * 0.1)
    footer_region = (0, height * 0.95, width, height)

    header_text = page.get_text("text", clip=header_region)
    footer_text = page.get_text("text", clip=footer_region)
    print(f"footer: {footer_text}")
    print(f"header: {header_text}")
    cleaned_text = page.get_text().replace(header_text, "").replace(footer_text, "")
    return cleaned_text