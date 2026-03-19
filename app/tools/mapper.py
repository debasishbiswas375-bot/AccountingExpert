import pandas as pd
import io
import re
import pdfplumber


# =========================
# 🔍 DETECT BANK STATEMENT
# =========================
def is_bank_statement(text):
    keywords = [
        "account statement",
        "txn date",
        "transaction",
        "balance",
        "debit",
        "credit",
        "withdrawal",
        "deposit"
    ]
    return sum(1 for k in keywords if k in text.lower()) >= 3


# =========================
# 🔍 DETECT BANK
# =========================
def detect_bank(text):
    t = text.lower()

    if "state bank of india" in t or "sbin" in t:
        return "SBI"
    elif "icici" in t:
        return "ICICI"
    elif "hdfc" in t:
        return "HDFC"
    elif "axis" in t:
        return "AXIS"
    else:
        return "UNKNOWN"


# =========================
# 📄 EXTRACT TEXT
# =========================
def extract_text(file_bytes):
    text = ""

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"

    return text


# =========================
# 🏦 SBI PARSER (HIGH ACCURACY)
# =========================
def parse_sbi(lines):
    data = []
    current = None

    for line in lines:
        line = line.strip()

        if re.match(r"\d{2}/\d{2}/\d{4}", line):
            if current:
                data.append(current)

            current = {
                "date": line.split()[0],
                "description": "",
                "reference": "",
                "debit": 0,
                "credit": 0,
                "balance": 0
            }

        elif current:
            current["description"] += " " + line

        # Reference
        ref = re.search(r"(IN\d+|UTR[:\- ]?\w+)", line)
        if ref and current:
            current["reference"] = ref.group(0)

        # Amount extraction
        nums = re.findall(r"\d{1,3}(?:,\d{3})*\.\d{2}", line)

        if current and nums:
            nums = [float(n.replace(",", "")) for n in nums]

            if len(nums) >= 2:
                current["balance"] = nums[-1]

                if "to transfer" in line.lower() or "debit" in line.lower():
                    current["debit"] = nums[0]
                else:
                    current["credit"] = nums[0]

    if current:
        data.append(current)

    return pd.DataFrame(data)


# =========================
# 📊 TABLE PARSER (ICICI/HDFC/AXIS)
# =========================
def parse_table_pdf(file_bytes):
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                df = pd.DataFrame(table)

                if df.shape[1] >= 5:
                    df.columns = [str(c).lower() for c in df.iloc[0]]
                    df = df[1:]
                    return df

    return pd.DataFrame()


# =========================
# 🧠 MAIN MAPPER
# =========================
def smart_map_bank(file_bytes: bytes, filename: str):

    filename = filename.lower()

    # =========================
    # 📄 PDF HANDLING
    # =========================
    if filename.endswith(".pdf"):

        text = extract_text(file_bytes)

        # 👉 STEP 1: CHECK BANK STATEMENT
        if not is_bank_statement(text):
            # Return RAW only
            return pd.DataFrame({
                "raw_text": text.split("\n")
            })

        # 👉 STEP 2: DETECT BANK
        bank = detect_bank(text)
        lines = text.split("\n")

        if bank == "SBI":
            df = parse_sbi(lines)
        else:
            df = parse_table_pdf(file_bytes)

        # 👉 STEP 3: NORMALIZE
        df.columns = [str(c).strip().lower() for c in df.columns]

        col_map = {}

        for col in df.columns:
            if "date" in col:
                col_map[col] = "date"
            elif "narration" in col or "description" in col:
                col_map[col] = "description"
            elif "ref" in col or "cheque" in col:
                col_map[col] = "reference"
            elif "debit" in col or "withdraw" in col:
                col_map[col] = "debit"
            elif "credit" in col or "deposit" in col:
                col_map[col] = "credit"
            elif "balance" in col:
                col_map[col] = "balance"

        df = df.rename(columns=col_map)

        # Ensure columns
        for col in ["date", "description", "reference", "debit", "credit", "balance"]:
            if col not in df.columns:
                df[col] = 0

        return df

    # =========================
    # 📊 EXCEL / CSV
    # =========================
    if filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(file_bytes))
    else:
        df = pd.read_excel(io.BytesIO(file_bytes))

    df.columns = [str(c).strip().lower() for c in df.columns]

    return df
