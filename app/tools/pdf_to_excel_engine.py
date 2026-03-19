import pdfplumber
import pandas as pd
import re
import os


def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()


def extract_transactions(text):
    lines = text.split("\n")
    transactions = []

    for line in lines:
        line = clean_text(line)

        # Match SBI-style rows
        match = re.match(
            r"(\d{2}/\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})\s+(.*?)\s+([\d,]+\.\d{2})?\s+([\d,]+\.\d{2})?\s+([\d,]+\.\d{2})",
            line
        )

        if match:
            date, value_date, desc, debit, credit, balance = match.groups()

            transactions.append({
                "Date": date,
                "Value Date": value_date,
                "Description": desc,
                "Debit": debit if debit else "",
                "Credit": credit if credit else "",
                "Balance": balance
            })

    return transactions


def convert_pdf_to_excel(pdf_path, output_path):
    full_text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"

    transactions = extract_transactions(full_text)

    if not transactions:
        raise Exception("❌ No transactions detected. Format may not be supported.")

    df = pd.DataFrame(transactions)

    df.to_excel(output_path, index=False)

    return output_path


# MAIN FUNCTION (ROUTES USE THIS)
def process_pdf_to_excel(file_path):
    output_file = file_path.replace(".pdf", ".xlsx")

    convert_pdf_to_excel(file_path, output_file)

    return output_file
